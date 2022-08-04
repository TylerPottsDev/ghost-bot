const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require('discord.js');

/**
 * Utility function to convert milliseconds to human-readable time-elapsed.
 * @param {Number} value 
 * @returns {String}
 */
function convertMS(value) {
    const date = new Date(value*1000);
    const days = date.getUTCDate() - 1,
    hours = date.getUTCHours(),
    minutes = date.getUTCMinutes(),
    seconds = date.getUTCSeconds(),
    milliseconds = date.getUTCMilliseconds();

    let segments = [];

    if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
    if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
    if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
    if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
    if (milliseconds > 0) segments.push(milliseconds + ' millisecond' + ((milliseconds == 1) ? '' : 's'));

    let final = segments.join(', ');
    if (final.length > 1) return final;
    else return "0 milliseconds"; // Dummy value.
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
        .setDescription("Replies with detailed latency metrics."),
    
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        // Create an embed message with the initial ping data. 
        const pingEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`${interaction.client.user.username} Latency Metrics:`, interaction.client.user.avatarURL())
            .addField("Uptime:", convertMS(process.uptime()))
            .addField("Client Latency:", `${interaction.client.ws.ping}ms`)
            .addField("API Latency:", "`Calculating...`")
            .setFooter("Note: Client and API Latency metrics are approximations.")
        
        // Send the initial reply.
        const startTime = performance.now();
        await interaction.reply({ embeds: [pingEmbed] });
        const endTime = performance.now();

        // Update API Latency field.
        pingEmbed.fields[2].value = `${Math.floor(endTime - startTime)}ms`;

        // Finally, update the initial reply.
        const intitialReply = await interaction.fetchReply();
        intitialReply.edit({ embeds: [pingEmbed] });
	},
};
