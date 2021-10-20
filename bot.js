require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

client.once("ready", () => {
	console.log(
		`Ghost is online${
			process.env.ENV === "production" ? "" : " in development mode"
		}.`
	);

	const CLIENT_ID = client.user.id;

	const rest = new REST({
		version: "9",
	}).setToken(process.env.TOKEN);

	(async () => {
		try {
			if (process.env.ENV === "production") {
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands,
				});
				console.log("Successfully registered application commands globally");
			} else {
				await rest.put(
					Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
					{
						body: commands,
					}
				);
				console.log(
					"Successfully registered application commands for development guild"
				);
			}
		} catch (error) {
			if (error) console.error(error);
		}
	})();
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		if (error) console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(process.env.TOKEN);