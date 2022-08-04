const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Tells you the info of the server you\'re in!'),

	/**
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		await interaction.deferReply();
		const { guild } = interaction;
		const infoEmbed = new MessageEmbed()
			.setAuthor( guild.name, guild.iconURL({ dynamic: true }) )
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.setColor('BLURPLE')
			.addFields(
				{
					name: 'General',
					value: [
						`Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
						`Owner: <@${guild.ownerId}>`,
						`\nDescription: **${guild.description || 'None'}**`
					].join('\n')
				},
				{
					name: 'Users',
					value: [
						`- Members: ${guild.memberCount}`
					].join('\n')
				},
				{
					name: 'Channels',
					value: [
						`- Text: ${guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT').size}`,
						`- Voice: ${guild.channels.cache.filter((c) => c.type === 'GUILD_VOICE').size}`,
						`- Threads: ${guild.channels.cache.filter((c) => c.type === 'GUILD_PUBLIC_THREAD' && 'GUILD_PRIVATE_THREAD' && 'GUILD_NEWS_THREAD').size}`,
						`- Categories: ${guild.channels.cache.filter((c) => c.type === 'GUILD_CATEGORY').size}`,
						`- Stages: ${guild.channels.cache.filter((c) => c.type === 'GUILD_STAGE_VOICE').size}`,
						`- News: ${guild.channels.cache.filter((c) => c.type === 'GUILD_NEWS').size}`,
						`Total: ${guild.channels.cache.size}`
					].join('\n')
				},
				{
					name: 'Emojis and Stickers',
					value: [
						`- Animated: ${guild.emojis.cache.filter((e) => e.animated).size}`,
						`- Static: ${guild.emojis.cache.filter((e) => !e.animated).size}`,
						`Total: ${guild.emojis.cache.size}`
					].join('\n')
				}
			)

		await interaction.editReply({ content: 'Here you go!', embeds: [infoEmbed] });
	},
};
