const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, CommandInteraction } = require("discord.js");
const GuildPots = require("../models/GuildPots");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("potwallet")
        .setDescription("Tells how many pots(Weekly challenge points) you have")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("Whoose wallet to check")
            .setRequired(false)
        ),
    
    /**
     * @param {CommandInteraction} interaction // idk what this does but I decided to keep it
     */
	async execute(interaction) {

        // Get whoose wallet to check
        const user = interaction.options.getUser("user") || interaction.user;

        const balanceEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`${user.username}'s Pot Wallet:`, interaction.client.user.avatarURL())
            .addField("Pots:", "...")
            .setFooter("Participate in weekly challenges to get more!")
        
        // Send the initial reply.
        interaction.reply({ embeds: [balanceEmbed] });
        
        // Find the wallet
        const guildPots = await GuildPots.findOne({user_id: user.id});
        if (!guildPots) {
            // Not creating a wallet until some pots get sent to that user

            balanceEmbed.fields[0].value = "0 <:pot:1003948996349411338>";
        } else {
            balanceEmbed.fields[0].value = guildPots.pots.toString() + " <:pot:1003948996349411338>";
        }

        // Show the data
        const intitialReply = await interaction.fetchReply();
        intitialReply.edit({ embeds: [balanceEmbed] });

	},
};
