import { EmbedBuilder, Events, GuildChannelResolvable, Message, Presence, TextChannel } from "discord.js";
import { client } from "../index.js";
import { IGatewayEvent, ITextCommand } from "../Base/Structures.js";
const event: IGatewayEvent = {
    name: Events.PresenceUpdate,
    once: false,
    execute: async (oldPresence: Presence | null, newPresence: Presence) => {
        if (newPresence.userId !== process.env.PRESENCEBOTID) return;
        if (oldPresence.status !== newPresence.status) {
            let channel = client.channels.cache.get(process.env.PresenceLogChannelId) as TextChannel;
            if(!channel) return;

            let lastBotMessage = channel.messages.cache.get(process.env.PresenceLogMessageId);
            if(!lastBotMessage) lastBotMessage = await (await channel.messages.fetch()).get(process.env.PresenceLogMessageId);
            if(!lastBotMessage) lastBotMessage = await channel.send({embeds:[new EmbedBuilder().setColor('Red').setDescription(`Status Embed Placeholder`)]})
            
            let statusEmbed = new EmbedBuilder()
            .setTitle(`Bot Status`)
            .setDescription(`${newPresence.user.username}'s Status ist ${newPresence.status}`)

            switch (newPresence.status) {
                case ('online'): {
                    return lastBotMessage.edit({embeds:[
                        statusEmbed
                        .setThumbnail(`https://cdn.discordapp.com/attachments/963863032184836146/1102643105930432532/online.png`)
                        .setColor('Green')
                        .setDescription(`Last Change: <t:${Date.now() / 1000 | 0}>`)
                    ]})
                }
                case ('dnd'): {
                    return lastBotMessage.edit({embeds:[
                        statusEmbed
                        .setThumbnail(`https://cdn.discordapp.com/attachments/963863032184836146/1102643105506787410/dnd.png`)
                        .setColor('Red')
                        .setDescription(`Last Change: <t:${Date.now() / 1000 | 0}>`)
                    ]})
                }
                case ('idle'): {
                    return lastBotMessage.edit({embeds:[
                        statusEmbed
                        .setThumbnail(`https://cdn.discordapp.com/attachments/963863032184836146/1102643105716514947/idle.png`)
                        .setColor('Orange')
                        .setDescription(`Last Change: <t:${Date.now() / 1000 | 0}>`)
                    ]})
                }
                //Same as offline
                case ('invisible'): {
                    return lastBotMessage.edit({embeds:[
                        statusEmbed
                        .setThumbnail(`https://cdn.discordapp.com/attachments/963863032184836146/1102643105288704082/offline.png`)
                        .setColor('Grey')
                        .setDescription(`Last Change: <t:${Date.now() / 1000 | 0}>`)
                    ]})
                }
                //Same as invisible
                case ('offline'): {
                    return lastBotMessage.edit({embeds:[
                        statusEmbed
                        .setThumbnail(`https://cdn.discordapp.com/attachments/963863032184836146/1102643105288704082/offline.png`)
                        .setColor('Grey')
                        .setDescription(`Last Change: <t:${Date.now() / 1000 | 0}>`)
                    ]})
                }
            }
        }
    },
}
export default event;