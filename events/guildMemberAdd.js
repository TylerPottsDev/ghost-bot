const Discord = require("discord.js");

module.exports = {
	name: "guildMemberAdd",
	async execute(member) {
		const newMemberEmbed = new Discord.MessageEmbed()
			.setColor('#d81e5b')
			.setTitle('New Member!')
			.setDescription(`Welcome ${member.user}, We hope you enjoy your stay!`)
			.setImage(member.user.avatarURL)
			.setTimestamp()

		member.guild.channels.cache.get("849283385808912384").send({ embeds: [newMemberEmbed] });
	},
};
