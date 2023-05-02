import { Events, GuildChannelResolvable, Message } from "discord.js";
import { client } from "../index.js";
import { IGatewayEvent, ITextCommand } from "../Base/Structures.js";

async function checkPermsAndExecute(message: Message, command: ITextCommand, args: string[]) {
    if (message.guild.members.me.permissions.has(['SendMessages', "ViewChannel"])
        && message.guild.members.me.permissionsIn(message.channel as GuildChannelResolvable).has(['SendMessages', "ViewChannel"])
    ) {
        if (command) {
            if (!message.member.permissions.has(command.data.userPerms || [])) return message.reply(`Du hast nicht die Rechte diesen Befehl auszuführen`);
            if (!message.guild.members.me.permissions.has(command.data.botPerms || [])) return message.reply(`Ich habe nicht die Rechte diesen Befehl auszuführen`);
            if (command.data.ownerOnly === true) {
                if (message.member.id !== process.env.OwnerId) return message.reply(`Du hast nicht die Rechte diesen Befehl auszuführen`)
                else {
                    await command.execute(client, message, args);
                }
            }

            else {
                await command.execute(client, message, args);
            }
        }
    }
}

const event: IGatewayEvent = {
    name: Events.MessageCreate,
    once: false,
    execute: async (message: Message) => {
        let prefix = "u!";
        if (!message.guild) return;
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            if (cmd.length == 0) return;
            let command = client.commands.get(cmd);

            if (typeof command === 'undefined') command = client.commands.get(client.aliases.get(cmd))

            if (typeof command === 'undefined') {
                let aliasCatch = client.aliases.get(cmd);

                if (typeof aliasCatch !== "undefined") {
                    command = client.commands.get(aliasCatch);
                    await checkPermsAndExecute(message, command, args)
                }
            } else {
                await checkPermsAndExecute(message, command, args)
            }
        }
    },
}
export default event;