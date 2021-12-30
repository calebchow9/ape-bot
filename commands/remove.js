const { SlashCommandBuilder } = require('@discordjs/builders');
const Game = require("../models/GameSchema");

const data = new SlashCommandBuilder()
	.setName('remove')
	.setDescription('Removes a game from the pick list')
    .addIntegerOption(option => 
        option.setName('game')
            .setDescription('The name of the game to delete')
            .setRequired(true)
    );

module.exports = {
	data: data,
	async execute(interaction) {
        const name = interaction.options._hoistedOptions[0].value;

        const remove = await Game.findOneAndDelete({name: name});
        console.log(remove);

        if(remove) {
            await interaction.reply(`${name} removed from pick list.`);
        } else {
            await interaction.reply(`Error removing ${name} from the pick list. Did you spell it correctly?`);
        }
	},
};