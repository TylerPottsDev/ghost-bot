const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, CommandInteraction } = require("discord.js");
const GuildPots = require("../models/GuildPots");
const findUser = require("../bot");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("toppot")
        .setDescription("Shows pot leaderboard"),
    
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {

        const balanceEmbed = new MessageEmbed()
            .setColor("#d81e5b")
            .setAuthor(`Pot Leaderboard:`, guild.iconURL({ dynamic: true }))
            .addField("1. ", "...")
            .addField("2. ", "...")
            .addField("3. ", "...")
            .addField("4. ", "...")
            .addField("5. ", "...")
            .setFooter("Participate in weekly challenges to climb!")
        
        // Send the initial reply.
        interaction.reply({ embeds: [balanceEmbed] });

        // Find pot wallets
        const query = GuildPots.find({}, { user_id: 1, pots: 1, _id: 0 });

        // When query done sort the array, get usernames and return a ready array
        let userArray = await new Promise((resolve, reject) => {

            query.exec(async function(err, array) {

                if(err) {
                    console.log(err)
                }

                function partition(arr, starti, endi) {

                    let pivot = arr[endi].pots;

                    let i = (starti - 1)

                    for(let j = starti; j <= endi - 1; j++) {

                        if(arr[j].pots < pivot) {
                            i++;

                            let temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }

                    }

                    let temp = arr[i+1];
                    arr[i+1] = arr[endi];
                    arr[endi] = temp;

                    return i + 1;

                }

                function quickSort(arr, starti, endi) {
                    if(starti < endi) {
                        let pari = partition(arr, starti, endi);
                        quickSort(arr, starti, pari - 1);
                        quickSort(arr, pari + 1, endi);
                    }
                }

                quickSort(array, 0, array.length - 1);

                for(let i = 0; i < array.length; i++) {
                    array[i].user_id = (await findUser.getUserById(array[i].user_id)).username;
                }

                resolve(array);

            })

        });

        // Write the data to the leaderboard embed
        for(let i = userArray.length - 1; i >= 0; i--) {

            balanceEmbed.fields[userArray.length - i - 1].name += userArray[i].user_id;
            balanceEmbed.fields[userArray.length - i - 1].value = `${userArray[i].pots.toString()} <:pot:1004805543988310037>`;
        }

        // Show the data
        const intitialReply = await interaction.fetchReply();
        intitialReply.edit({ embeds: [balanceEmbed] });

	},
};
