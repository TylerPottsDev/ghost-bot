const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

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
		interaction.reply({
			content: "Thank you, your website has been submitted! Check out <#950736154448236594> to see your submission. (It may take a few minutes to appear)" 
		});

		const res = await axios(`https://shot.screenshotapi.net/screenshot?&url=${encodeURIComponent(interaction.options.getString("url"))}&width=1920&height=1080&output=image&file_type=jpeg&wait_for_event=load`)

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
			.setImage(res.request.res.responseUrl)
			.setTimestamp()

		interaction.client.channels.cache.get("950736154448236594").send({ embeds: [embed] });
	},
};
