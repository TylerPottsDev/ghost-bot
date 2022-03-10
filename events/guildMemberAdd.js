const Discord = require("discord.js")
const GuildSettings = require("../models/GuildSettings")

module.exports = {
	name: "guildMemberAdd",
	async execute(member) {
		const guildSettings = await GuildSettings.findOne({
			guildID: member.guild.id
		})

		if (!guildSettings || !guildSettings.welcome_channel_id) return

		const newMemberEmbed = new Discord.MessageEmbed()
			.setColor('#d81e5b')
			.setTitle('New Member!')
			.setDescription(`Welcome ${member.user}, We hope you enjoy your stay!`)
			.setImage(`https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}.jpeg`)
			.setTimestamp()

		member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({ embeds: [newMemberEmbed] })
	},
};
