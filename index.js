require("dotenv").config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

const queue = new Map();

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
	const blacklist = [
		'689686762146103335',
		'325523929290768384'
	]

	// if bot talking
	if (message.author.bot) return;

	console.log(message.author);

	if (blacklist.indexOf(message.author.id) > -1) {
		return message.reply('YOU ARE IRRELEVANT');
	}

	const msgLower = message.content.toLowerCase();

	console.log(msgLower);

	// const serverQueue = queue.get(message.guild.id);
	// // play music
	// if (message.content.startsWith(`!play`)) {
	// 	execute(message, serverQueue);
	// 	return;
	// } else if (message.content.startsWith(`!skip`)) {
	// 	skip(message, serverQueue);
	// 	return;
	// } else if (message.content.startsWith(`!stop`)) {
	// 	stop(message, serverQueue);
	// 	return;
	// }

	// should
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


// // music functions
// async function execute(message, serverQueue) {
// 	const args = message.content.split(" ");
  
// 	const voiceChannel = message.member.voice.channel;
// 	if (!voiceChannel)
// 	  return message.channel.send(
// 		"You need to be in a voice channel to play music!"
// 	  );
// 	const permissions = voiceChannel.permissionsFor(message.client.user);
// 	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
// 	  return message.channel.send(
// 		"I need the permissions to join and speak in your voice channel!"
// 	  );
// 	}

// 	const songInfo = await ytdl.getInfo(args[1]);
// 	const song = {
// 		title: songInfo.videoDetails.title,
// 		url: songInfo.videoDetails.video_url,
// 	};

// 	if (!serverQueue) {
// 		const queueContruct = {
// 		  textChannel: message.channel,
// 		  voiceChannel: voiceChannel,
// 		  connection: null,
// 		  songs: [],
// 		  volume: 5,
// 		  playing: true
// 		};
	
// 		queue.set(message.guild.id, queueContruct);
	
// 		queueContruct.songs.push(song);
	
// 		try {
// 		  var connection = await joinVoiceChannel(
// 			{
// 				channelId: message.member.voice.channel,
// 				guildId: message.guild.id,
// 				adapterCreator: message.guild.voiceAdapterCreator
// 			});
// 		  queueContruct.connection = connection;
// 		  play(message.guild, queueContruct.songs[0]);
// 		} catch (err) {
// 		  console.log(err);
// 		  queue.delete(message.guild.id);
// 		  return message.channel.send(err);
// 		}
// 	} else {
// 		serverQueue.songs.push(song);
// 		return message.channel.send(`${song.title} has been added to the queue!`);
// 	}
// }

// function play(guild, song) {
// 	const serverQueue = queue.get(guild.id);
// 	console.log(serverQueue);
// 	if (!song) {
// 	  serverQueue.voiceChannel.leave();
// 	  queue.delete(guild.id);
// 	  return;
// 	}
  
// 	const dispatcher = serverQueue.connection
// 	  .play(ytdl(song.url))
// 	  .on("finish", () => {
// 		serverQueue.songs.shift();
// 		play(guild, serverQueue.songs[0]);
// 	  })
// 	  .on("error", error => console.error(error));
// 	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
// 	serverQueue.textChannel.send(`Start playing: **${song.title}**`);
// }

// function skip(message, serverQueue) {
// 	if (!message.member.voice.channel)
// 	  return message.channel.send(
// 		"You have to be in a voice channel to stop the music!"
// 	  );
// 	if (!serverQueue)
// 	  return message.channel.send("There is no song that I could skip!");
// 	serverQueue.connection.dispatcher.end();
//   }
  
//   function stop(message, serverQueue) {
// 	if (!message.member.voice.channel)
// 	  return message.channel.send(
// 		"You have to be in a voice channel to stop the music!"
// 	  );
	  
// 	if (!serverQueue)
// 	  return message.channel.send("There is no song that I could stop!");
	  
// 	serverQueue.songs = [];
// 	serverQueue.connection.dispatcher.end();
// }

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);