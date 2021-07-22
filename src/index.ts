require('dotenv').config();

import Discord, { Guild, Message } from 'discord.js';
import fetch from 'node-fetch';

//https://discord.com/oauth2/authorize?client_id=867672684699713557&scope=bot+applications.commands

//#region token checks
if(process.env.DISCORD_TOKEN == undefined) {
	console.error("No Discord Token Provided")
	process.exit();
}
//#endregion

const client = new Discord.Client({ ws: { intents: ['GUILD_MESSAGES', 'GUILDS'] } });

//#region events
client.once('ready', onBotReady);
client.on('message', onMessage);

/* @ts-ignore */
//client.ws.on('INTERACTION_CREATE', onInteractionCreate);
//#endregion

//#region start
client.login(process.env.DISCORD_TOKEN);
//#endregion

const clientCommands = new Discord.Collection<string, any>();

async function onBotReady() : Promise<void> {
	console.log("Bot Loaded");
}

const PROBABILITY = 0.05;
async function onMessage(msg : Message) {
	if(!msg.author.bot) {
		if(Math.random() <= PROBABILITY) {
			try {
				const fact = await getFact();
				//const trans = await translateText(fact);
				if(fact == "") return;
				msg.reply({
					embed: {
						title: "That's cool but did you know?",
						description: fact,
						color: 10181046
					}
				})
			} catch(err) {
				console.error(err);
			}
			
		}
	}
}

async function getFact() : Promise<string> {
	return await fetch("https://uselessfacts.jsph.pl/random.json?language=en").then(x => x.json()).then(x => x.text).catch(() => {}) ?? "";
}

async function translateText(text : string) : Promise<string> {
	console.log(`https://api.funtranslations.com/translate/shakespeare.json?text=${encodeURI(text)}`);
	return await fetch(`https://api.funtranslations.com/translate/shakespeare.json?text=${encodeURI(text)}`).then(x => x.json()).then(x => x.contents.translated).catch(err => console.error(err)) ?? "";
}