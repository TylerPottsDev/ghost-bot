module.exports = {
	name: "guildMemberRemove",
	async execute(member) {
		// member.guild.channels.cache.get("849283385808912384").send(`${member.user} left the server!`);
		console.log("A member left the server");
	},
};
