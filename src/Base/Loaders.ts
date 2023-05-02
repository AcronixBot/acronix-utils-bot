import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import pgk from 'glob'
import { IGatewayEvent, ISlashCommand, ITextCommand } from './Structures.js';
import { BotClient } from './Client.js';
import { client } from '../index.js';
import { ApplicationCommandDataResolvable } from 'discord.js';

const { glob } = pgk;
const proGlob = promisify(glob);

async function loadFiles(dirName: string) {
    const Files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/dist/${dirName}/*.js`, {})
    return Files;
}

async function importSlashCommandFile(filePath: string): Promise<ISlashCommand> {
    return (await import(`${pathToFileURL(filePath).href}`))?.default;
}
async function importTextCommandFile(filePath: string): Promise<ITextCommand> {
    return (await import(`${pathToFileURL(filePath).href}`))?.default;
}
async function importEventFile(filePath: string): Promise<IGatewayEvent> {
    return (await import(`${pathToFileURL(filePath).href}`))?.default;
}

export async function catchTextCommands(client: BotClient) {
    let Files = await loadFiles('Commands')
    let commandLenght = []
    for (const file of Files) {
        //import command
        let command = await importTextCommandFile(file);

        //set command
        client.commands.set(command.data.name, command)
        commandLenght.push(command)

        //set alias
        if (command.data.alias && Array.isArray(command.data.alias)) command.data.alias.forEach(alias => client.aliases.set(alias, command.data.name))
    }
    console.log(`[BOT] ${commandLenght.length} Text Commands wurden geladen`)
}

export async function catchSlashCommands(client: BotClient) {
    let Files = await loadFiles('slashCommands')
    var commands: Array<ApplicationCommandDataResolvable> = [];
    for (const file of Files) {
        let slashCommand = await importSlashCommandFile(file);
        commands.push(slashCommand.data.toJSON())
        client.slashCommand.set(slashCommand.data.name, slashCommand)
    }
    return commands;
}


export async function pushCommands(client: BotClient) {
    try {
        let commands = await catchSlashCommands(client)
        client.application.commands.set(commands)
        console.log(`[BOT] ${commands.length} Slash Commmands wurden geladen`)
    } catch (e) {
        console.error(e)
    }
}


export async function loadEvents() {
    const Files = await loadFiles('Events');
    Files.forEach(async (evt: string) => {
        let event: IGatewayEvent = await importEventFile(evt);
        event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args));
    })
    console.log(`[BOT] ${Files.length} Events wurden geladen`);
}