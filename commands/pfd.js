const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pfd')
		.setDescription('Replies with professional financial advice!'),
	async execute(interaction) {
		await interaction.reply('BUY BUY BUY!');
	},
};