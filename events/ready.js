require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
	name: "ready",
	once: true,
	execute(client, commands) {
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
	},
};
