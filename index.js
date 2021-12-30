require("dotenv").config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
// Require the necessary discord.js classes
const mongoose = require('mongoose');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.once('ready', () => {
	console.log('Ready!');
});

// set up MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then((res) => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('messageCreate', (message) => {

	// if bot talking
	if (message.author.bot) return;

	const msgLower = message.content.toLowerCase();

	console.log(msgLower);

	if (msgLower.includes("should")) {
		if(msgLower.includes("stop")) {
			return message.reply('NO');
		} else {
			return message.reply('YES');
		}
	}

	console.log(`Message from ${message.author.username}: ${message.content}`);

})

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);