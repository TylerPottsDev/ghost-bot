const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const GuildSettings = require("../models/GuildSettings")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("submitreview")
		.setDescription("Submit a website for review!")
		.addStringOption(option => 
			option.setName("url")
				.setDescription("The URL to review")
				.setRequired(true)
		)
		.addStringOption(option => 
			option.setName("notes")
				.setDescription("Any notes you want to add")
				.setRequired(false)
		),
	async execute(interaction) {
		const guildSettings = await GuildSettings.findOne({
			guildID: interaction.member.guild.id
		})

		if (!guildSettings || !guildSettings.review_channel_id) {
			interaction.reply({
				content: "No review channel set, please contact an administrator." 
			})

			return;
		}

		interaction.reply({
			content: `Thank you, your website has been submitted! Check out <#${guildSettings.review_channel_id}> to see your submission.` 
		})

		const embed = new Discord.MessageEmbed()
			.setColor('#d81e5b')
			.setTitle('New submission for review!')
			.setURL(interaction.options.getString("url"))
			.addField('Submitted by', interaction.member.user.tag, true)
			.addField('URL', interaction.options.getString("url"), true)
			.setDescription(
				interaction.options.getString("notes") 
					? interaction.options.getString("notes") 
					: 'No notes provided.'
			)
			.setTimestamp()

		interaction.client.channels.cache.get(guildSettings.review_channel_id).send({ embeds: [embed] }).then(embedMessage => {
			embedMessage.react("👀");
		});
	},
};
