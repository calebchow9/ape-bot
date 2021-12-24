const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('coin')
	.setDescription('Flips a two sided coin.')
	.addStringOption(option =>
		option.setName('heads')
			.setDescription('The name of the player betting heads.')
			.setRequired(true)
    )
    .addStringOption(option2 => 
        option2.setName('tails')
            .setDescription('The name of the player betting tails.')
            .setRequired(true)
    );


module.exports = {
	data: data,
	async execute(interaction) {

        let reply = `A coin flip between ${interaction.options._hoistedOptions[0].value} and ${interaction.options._hoistedOptions[1].value}. Flipping...\n`;

        setTimeout(() => {}, 1000);

        const heads = interaction.options._hoistedOptions[0].value.toLowerCase();
        const tails = interaction.options._hoistedOptions[1].value.toLowerCase();

        if(heads == "caleb" || heads == "cleb") {
            reply += `The coin is HEADS! ${heads} wins.`;
        } else if (tails == "caleb" || tails == "cleb") {
            reply += `The coin is TAILS! ${tails} wins.`;
        } else {
            if (Math.random() > 0.50) {
                reply += `The coin is HEADS! ${heads} wins.`;
            } else {
                reply += `The coin is TAILS! ${tails} wins.`;
            }
        }

        await interaction.reply(reply);
	},
};