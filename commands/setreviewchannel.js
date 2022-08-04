const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setreviewchannel")
		.setDescription("Set the review submission channel")
		.addChannelOption(option => 
			option.setName("reviews")
			.setDescription("The channel to set as the reviews channel")
			.setRequired(true)
		),
	async execute(interaction) {
		// Return if user is not an admin
		if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
			interaction.reply({ content: "Sorry you do not have permission to use that command" });
			return;
		}

		// Find the guild's settings document
		GuildSettings.findOne({ guildID: interaction.guild.id }, (err, settings) => {
			if (err) {
				console.error(err);
				interaction.reply({ content: "An error occurred while trying to set the review channel" });
				return;
			}

			if (!settings) {
				settings = new GuildSettings({
					guild_id: interaction.guild.id,
					review_channel_id: interaction.options.getChannel("reviews").id
				});
			} else {
				settings.review_channel_id = interaction.options.getChannel("reviews").id;
			}

			console.log(settings);

			settings.save(err => {
				if (err) {
					console.error(err);
					interaction.reply({ content: "An error occurred while trying to set the review channel" });
					return;
				}
			
				interaction.reply({ content: "The Review Channel has been set to <#" + interaction.options.getChannel("reviews") + ">" });
			});
		});
	},
};
