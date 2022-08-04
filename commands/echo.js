const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Responds with your message")
		.addStringOption(option => 
			option.setName("message")
				.setDescription("The message to send back")
				.setRequired(true)
		),
	async execute(interaction) {
		// Responds with the entered message
		interaction.reply({ content: interaction.options.getString("message") });
	},
};
