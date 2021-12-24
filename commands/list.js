const { SlashCommandBuilder } = require('@discordjs/builders');
const Game = require("../models/GameSchema");

const data = new SlashCommandBuilder()
	.setName('list')
	.setDescription('Displays game list');

module.exports = {
	data: data,
	async execute(interaction) {
        const all = await Game.find({});
        let reply = "";
        all.forEach(function(game) {
            reply += `${game.name} [${game.players} player(s)] - ${game.user} \n`;
        })

        await interaction.reply(reply);
	},
};