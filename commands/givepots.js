const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require('discord.js');
const GuildPots = require('../models/GuildPots');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("givepots")
		.setDescription("Give some pots to someone")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("The blessed user")
            .setRequired(true)
        )
        .addIntegerOption(option => 
			option.setName("pots")
			.setDescription("Amount of pots to give")
			.setRequired(true)
        ),
	async execute(interaction) {
		// Return if user is not an admin
		if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
			interaction.reply({ content: "Sorry you do not have permission to use that command" });
			return;
		}

        // Find user's pot count in the database using id
		GuildPots.findOne({ user_id: interaction.options.getUser("user").id }, (err, settings) => {
			if (err) {
				console.error(err);
				interaction.reply({ content: "An error occurred while trying to give pots" });
				return;
			}
			if (!settings) {
                // No pots? No problem
				settings = new GuildPots({
					user_id: interaction.options.getUser("user").id,
					pots: interaction.options.getInteger("pots")
				});
			} else {
                // Got a wallet - got some pots
				settings.pots += interaction.options.getInteger("pots");
			}

			settings.save(err => {
				if (err) {
                    // dammit those errors
					console.error(err);
					interaction.reply({ content: "An error occurred while trying to save the pots" });
					return;
				}
                // Just a reply to confirm that the pots were saved
				interaction.reply({ content: `${interaction.options.getInteger("pots")} <:pot:1004805543988310037> given to <@${interaction.options.getUser("user").id}>` });
			});
		});
	},
};
