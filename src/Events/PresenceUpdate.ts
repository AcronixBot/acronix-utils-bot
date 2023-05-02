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
            if(!lastBotMessage) lastBotMessage = await channel.send(`Placeholder Status Message`)
            
            let statusEmbed = new EmbedBuilder()
            .setTitle(`Bot Status`)
            .setDescription(`${newPresence.user.username}'s Status is ${newPresence.status}`)

            switch (newPresence.status) {
                case ('online'): {
                    lastBotMessage.edit({embeds:[
                        statusEmbed.setThumbnail(`<urlToGreenSymbole>`).setColor('Green')
                    ]})
                }
                case ('dnd'): {
                    lastBotMessage.edit({embeds:[
                        statusEmbed.setThumbnail(`<urlToRedSymbole>`).setColor('Red')
                    ]})
                }
                case ('idle'): {
                    lastBotMessage.edit({embeds:[
                        statusEmbed.setThumbnail(`<urlToOrangeSymbole>`).setColor('Orange')
                    ]})
                }
                //Same as offline
                case ('invisible'): {
                    lastBotMessage.edit({embeds:[
                        statusEmbed.setThumbnail(`<urlToGreySymbole>`).setColor('Grey')
                    ]})
                }
                //Same as invisible
                case ('offline'): {
                    lastBotMessage.edit({embeds:[
                        statusEmbed.setThumbnail(`<urlToGreySymbole>`).setColor('Grey')
                    ]})
                }
            }
        }
    },
}
export default event;