const { SlashCommandBuilder } = require('@discordjs/builders');
const Game = require("../models/GameSchema");

const data = new SlashCommandBuilder()
	.setName('pick')
	.setDescription('Picks a game from the pick list')
    .addIntegerOption(option => 
        option.setName('players')
            .setDescription('The amount of players playing')
            .setRequired(true)
    );

module.exports = {
	data: data,
	async execute(interaction) {
        const numPlayers = interaction.options._hoistedOptions[0].value;

        const all = await Game.find({players: {$lte: numPlayers}})
        const game = all[Math.floor(Math.random() * all.length)]
        console.log(game);

        if(all) {
            await interaction.reply(`You should play ${game.name} (min. ${game.players} players). Blame ${game.user} for suggesting it...`);
        } else {
            await interaction.reply("You have too many people to play any games in the list");
        }
	},
};