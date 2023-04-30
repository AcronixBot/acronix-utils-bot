import * as dotenv from 'dotenv'
import { Client, Partials, GatewayIntentBits } from 'discord.js';

dotenv.config()

const { GuildMembers, GuildMessages, GuildPresences, Guilds } = GatewayIntentBits;
const { Channel, GuildMember, Message, User } = Partials;

const client = new Client({
    intents: [GuildMembers, GuildMessages, GuildPresences, Guilds],
    partials: [Channel, GuildMember, Message, User],
    presence: {
        status:'online',
    }
})


client.login(process.env.TOKEN).then((token) => console.log(`[BOT] Bot hat sich eingeloggt.`));