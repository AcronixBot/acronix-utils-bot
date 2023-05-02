import { CacheType, EmbedBuilder, Events, Interaction, } from "discord.js";
import { IGatewayEvent } from "../Base/Structures.js";

const event: IGatewayEvent = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction<CacheType>) => {
        if(interaction.isStringSelectMenu()) {
            if(interaction.customId === 'info:menu') {
                let baseEmbed = new EmbedBuilder()
                .setColor(`#56a4e7`)
                .setFooter({text:interaction.guild.name, iconURL:interaction.guild.iconURL()})

                switch(interaction.values[0]) {
                    case('info:menu:regeln'): {
                        return interaction.reply({ephemeral:true, embeds:[
                            baseEmbed
                            
                        ]})
                    }
                    case('info:menu:rollen'): {
                        return interaction.reply({ephemeral:true, embeds:[
                            baseEmbed
                            
                        ]})
                    }
                    case('info:menu:kanäle'): {

                        return interaction.reply({ephemeral:true, embeds:[
                            baseEmbed
                            
                        ]})
                    }
                }
            }
        }
    },
}
export default event;