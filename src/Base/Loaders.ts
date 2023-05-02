import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import pgk from 'glob'
import { IGatewayEvent, ITextCommand } from './Structures.js';
import { BotClient } from './Client.js';
import { client } from '../index.js';

const { glob } = pgk;
const proGlob = promisify(glob);

async function loadFiles(dirName: string){
    const Files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/dist/${dirName}/*.js`, {})
    return Files;
}

async function importCommandFile(filePath: string): Promise<ITextCommand> {
    return (await import(`${pathToFileURL(filePath).href}`))?.default;
}
async function importEventFile(filePath: string): Promise<IGatewayEvent> {
    return (await import(`${pathToFileURL(filePath).href}`))?.default;
}

export async function catchCommands(client: BotClient) {
    let Files = await loadFiles('Commands')
    let commandLenght = []
    for (const file of Files) {
        //import command
        let command = await importCommandFile(file);

        //set command
        client.commands.set(command.data.name, command)
        commandLenght.push(command)

        //set alias
        if (command.data.alias && Array.isArray(command.data.alias)) command.data.alias.forEach(alias => client.aliases.set(alias, command.data.name))
    }
    console.log(`[BOT] Loaded ${commandLenght.length} Text Commands`)
}


export async function loadEvents() {
    const Files = await loadFiles('Events');
    Files.forEach(async (evt: string) => {
        let event: IGatewayEvent = await importEventFile(evt);
        event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args));
    })
    console.log(`[Events] Loaded ${Files.length} Events`);
}