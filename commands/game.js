const { SlashCommandBuilder } = require('@discordjs/builders');
const Game = require("../models/GameSchema");

const data = new SlashCommandBuilder()
	.setName('game')
	.setDescription('Adds a game to the pick list')
	.addStringOption(option =>
		option.setName('name')
			.setDescription('The game name info required')
			.setRequired(true)
    )
    .addIntegerOption(option2 => 
        option2.setName('players')
            .setDescription('The minimum number of players to play')
            .setRequired(true)
    );


module.exports = {
	data: data,
	async execute(interaction) {
        // add data to database
        const newGame = await Game.create({
            name: interaction.options._hoistedOptions[0].value,
            user: interaction.user.username,
            players: interaction.options._hoistedOptions[1].value, 
        });

        const savedGame = await newGame.save();

        // if data added properly
        if (savedGame) {
            await interaction.reply(`${savedGame.name}, with a minimum players of ${savedGame.players}, has been added to the list by ${savedGame.user}`);
        } else {
            await interaction.reply("Error adding game to list.");
        }
	},
};