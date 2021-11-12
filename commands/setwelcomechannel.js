const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setwelcomechannel")
		.setDescription("Set the welcome message channel")
		.addChannelOption(option => 
			option.setName("welcome")
			.setDescription("The channel to set as the welcome channel")
			.setRequired(true)
		),
	async execute(interaction) {
		// Return if user is not an admin
		if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
			interaction.reply({ content: "Sorry you do not have permission to use that command" });
			return;
		}

		console.log(interaction.options.getChannel("welcome"));

		GuildSettings.findOne({ guildID: interaction.guild.id }, (err, settings) => {
			if (err) {
				console.log(err);
				interaction.reply({ content: "An error occurred while trying to set the welcome channel" });
				return;
			}

			if (!settings) {
				settings = new GuildSettings({
					guild_id: interaction.guild.id,
					welcome_channel_id: interaction.options.getChannel("welcome").id
				});
			} else {
				settings.welcome_channel_id = interaction.options.getChannel("welcome").id;
			}

			settings.save(err => {
				if (err) {
					console.log(err);
					interaction.reply({ content: "An error occurred while trying to set the welcome channel" });
					return;
				}
			
				interaction.reply({ content: "Welcome Channel has been set to <#" + interaction.options.getChannel("welcome") + ">" });
			});
		});
	},
};
