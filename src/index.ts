import * as dotenv from 'dotenv'
import { BotClient } from './Base/Client.js';
import { catchCommands, loadEvents } from './Base/Loaders.js'
import { connect } from 'mongoose';
dotenv.config()

export const client = new BotClient();


client.login(process.env.TOKEN).then((token) => console.log(`[BOT] Bot hat sich eingeloggt.`));

client.on('ready', async () => {
    catchCommands(client)
    loadEvents();
    connect(process.env.MONGODB).then(() => console.log(`[DATABASE] Connected to Database`))
})



process.on("unhandledRejection", (reason, p) => {
    console.log(`[ANTI-CRASH]:    :: Unhandled Rejection  ::  `)
    console.log(p)
})

process.on("uncaughtException", (reason, p) => {
    console.log(`[ANTI-CRASH]:    :: Uncaught Exeption  ::  `)
    console.log(reason, p)
})

process.on("uncaughtExceptionMonitor", (reason, p) => {
    return;
})
