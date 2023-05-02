import { ITextCommand } from "../Base/Structures.js";

const command: ITextCommand = {
    data: {
        name: 'ping',
    },
    execute: async (client, message, args) => {
        return message.reply(`Pong!`)
    },
}

export default command;