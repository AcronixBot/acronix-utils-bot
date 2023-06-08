import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import { ITextCommand } from "../Base/Structures.js";

const command: ITextCommand = {
    data: {
        name: 'welcomeinfomessage',
        alias: ['wim'],
        ownerOnly: true
    },
    execute: async (client, message, args) => {
        try {
            let channel = message.guild.channels.cache.get(process.env.WelcomeInfoMessageChannelId) as TextChannel;

            let embed = new EmbedBuilder()
                .setThumbnail(message.guild.iconURL())
                .setDescription(`**Willkommen** <a:wave_hey:1102972211775684688>\n\nHerzlich Willkommen auf diesem Server. Schön das du her gefunden hast.\n\nHier über dieses Menü könnt ihr eine kleine Übersicht über Rollen, Regeln und Kanäle finden.`)
                .setColor(`#56a4e7`)

            let SelectMenuActionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
                .setComponents([
                    new StringSelectMenuBuilder()
                        .setPlaceholder(`Wähle etwas`)
                        .setCustomId(`info:menu`)
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setOptions([
                            new StringSelectMenuOptionBuilder()
                                .setDescription(`Siehe dir die Regeln des Servers an`)
                                .setEmoji(`1103027056742244395`)
                                .setLabel(`Regeln`)
                                .setValue(`info:menu:regeln`),
                            new StringSelectMenuOptionBuilder()
                                .setDescription(`Eine Übersicht über die Rollen dieses Servers`)
                                .setEmoji(`1103027407092453479`)
                                .setLabel(`Rollen`)
                                .setValue(`info:menu:rollen`),
                            new StringSelectMenuOptionBuilder()
                                .setDescription(`Eine Übersicht über die Kanäle dieses Servers`)
                                .setEmoji(`1103027015348662353`)
                                .setLabel(`Kanäle`)
                                .setValue(`info:menu:kanäle`)
                        ])
                ])

            let buttonActionRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(`Lade Acronix ein`)
                        .setEmoji(`1103027402466136134`)
                        .setURL(`https://canary.discord.com/api/oauth2/authorize?client_id=905083832695398481&permissions=1376537373730&scope=bot%20applications.commands`),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(`Invite für hier`)
                        .setEmoji(`1103027036127232081`)
                        .setURL(`https://discord.gg/sj3ZTNn9d7`)
                ])

            let DirectoryActionRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(`App Verzeichnis`)
                        .setEmoji(`1103027014136500254`)
                        .setURL(`discord://-/application-directory/905083832695398481`)
                ])

            channel.send({ embeds: [embed], components: [SelectMenuActionRow, buttonActionRow, DirectoryActionRow] })
            message.delete();
        } catch (e) {
            console.log(e)
        }
    },
}

export default command;