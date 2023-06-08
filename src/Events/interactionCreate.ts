import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, EmbedBuilder, Events, Interaction, ModalActionRowComponentBuilder, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle, } from "discord.js";
import { IGatewayEvent } from "../Base/Structures.js";
import { client } from "../index.js";

const event: IGatewayEvent = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction<CacheType>) => {
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'info:menu') {
                let baseEmbed = new EmbedBuilder()
                    .setColor(`#56a4e7`)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

                let ruleParts = [
                    "`1)` Freundlichkeit hat oberste Priorität. Streit braucht keiner!",
                    "`2)` Nicknames dürfen keine beleidigenden oder anderen verbotenen oder geschützten Namen oder Namensteile enthalten.",
                    "`3)` Avatare dürfen keine pornographischen, rassistischen, beleidigenden oder andere gegen das deutsche Recht verstoßenden Inhalte beinhalten.",
                    "`4)` Private Daten wie Telefonnummern, Adressen, Passwörter und ähnlichem dürfen nicht öffentlich ausgetauscht werden. Ein Teammitglied wird zu keinem Zeitpunkt nach sensiblen Daten fragen.",
                    "`5)` Beleidigungen sind zu unterlassen.",
                    "`6)` Jegliche Art von Spam ist verboten.",
                    "`7)` Fremdwerbung jeglicher Art ist strengstens untersagt und wird bestraft!",
                    "`8)` Rassismus und Antisemitismus in jeglicher Form wird nicht geduldet!",
                    "`9)` Unwissenheit schützt dich nicht vor Konsequenzen, solltest du die Regeln nicht einhalten."
                ]

                let channelParts = [
                    "**Acronix**",
                    "<#948593390734409748> → Alles was mit <@905083832695398481> zu tun hat wird hier angekündigt.",
                    "<#1016771095845679134> → Hier siehst du ob <@905083832695398481>  online oder offline ist.",
                    "<#1030395588379955251> →  Du findest Bugs? Dann ist das der richtige Ort um sie dem Dev mitzuteilen.",
                    "<#1019654070945976370>   → In diesem Forum kannst du einen Thread erstellen und Feedback geben oder nach Hilfe fragen.",
                    "**Community**",
                    "<#1030395043153969153> → Alle wichtigen Ankündigung welche die Community oder denn Server und nicht <@905083832695398481> betreffen.",
                    "<#952648892330168390>  → Dieser Kanal.",
                    "<#951852441274564708>  → Ein Kanal in dem alle schreiben können."
                ]

                switch (interaction.values[0]) {
                    case ('info:menu:regeln'): {
                        return interaction.reply({
                            ephemeral: true, embeds: [
                                baseEmbed
                                    .setDescription(ruleParts.join(`\n`))
                                    .setTitle('Regeln')
                            ]
                        })
                    }
                    case ('info:menu:rollen'): {
                        return interaction.reply({
                            ephemeral: true,
                            embeds: [
                                baseEmbed
                                    .setDescription(`<@&1093587481632444587>  → Ist die Bot Rolle von <@905083832695398481> und <@1071139948209655828>.`)
                                    .setTitle('Rollen')
                                    .addFields([
                                        {
                                            name: "Verwaltung",
                                            value: "<@&1104716831312326666> verwaltet Acronix und den Server.",
                                            inline: false
                                        },
                                        {
                                            name: "Team",
                                            value: "Für alle die in irgendeiner Art und Weise dem Server oder <@905083832695398481> bei der Entwicklung helfen.",
                                            inline: false
                                        },
                                        {
                                            name: "Certified Bug Hunter",
                                            value: `Die <@&1099317024091553842> haben viele und wichtige Bugs gefunden.`,
                                            inline: true
                                        },
                                        {
                                            name: "Bug Hunter",
                                            value: "Die <@&1099758393088020490> haben bereits einige Bugs gefunden.",
                                            inline: true
                                        },
                                        {
                                            name: "Beta Tester",
                                            value: "Die <@&1100866589248729090> Tester überprüfen Acronix auf Bugs und vieles mehr.",
                                            inline: true
                                        },
                                        {
                                            name: "Community Rollen",
                                            value: "<@&1050800146377625672>  → Die Rolle für alle die denn Server Boosten.\n<@&1083176450213040149>  → Bekommt man bei 1000 Server Punkten.\n<@&1083174762093744211>  → Bekommt man ab 500 Server Punkten (`/rank view` → <@452763583348998155> ).\n<@&946059549469712384> → Standard Rolle aller Mitglieder.\n<@&947157565085736973>  → Zeichnet Bots aus. ",
                                            inline: false
                                        }
                                    ])
                            ],
                            components: [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .setComponents([
                                        new ButtonBuilder()
                                            .setCustomId(`info:button:roles:apply`)
                                            .setLabel('Frag eine Rolle an')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setCustomId(`info:button:roles:aksfornew`)
                                            .setLabel('Schlage eine Rolle vor')
                                            .setStyle(ButtonStyle.Primary)
                                    ])
                            ]
                        })
                    }
                    case ('info:menu:kanäle'): {

                        return interaction.reply({
                            ephemeral: true, embeds: [
                                baseEmbed
                                    .setDescription(channelParts.join(`\n`))
                                    .setTitle('Kanäle')
                            ]
                        })
                    }
                }
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'info:button:roles:apply') {
                try {
                    let modal = new ModalBuilder()
                        .setCustomId('info:modal:apply')
                        .setTitle('Bewerbe dich für eine Rolle')
                        .setComponents([
                            new ActionRowBuilder<TextInputBuilder>()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`info:modal:apply:role`)
                                        .setLabel('Rollen Name')
                                        .setPlaceholder('Beta Access / ...')
                                        .setStyle(TextInputStyle.Short)
                                        .setMaxLength(35)
                                        .setMinLength(1)
                                        .setRequired(true),
                                ),
                            new ActionRowBuilder<TextInputBuilder>()
                                .setComponents(new TextInputBuilder()
                                    .setCustomId(`info:modal:apply:reason`)
                                    .setLabel('Grund')
                                    .setMaxLength(4000)
                                    .setMinLength(250)
                                    .setPlaceholder('Und warum möchtest du dich bewerben?')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true))
                        ])

                    await interaction.showModal(modal)
                } catch (e) {
                    console.log(e)
                }

            }
            if (interaction.customId === 'info:button:roles:aksfornew') {
                try {
                    let modal = new ModalBuilder()
                        .setCustomId('info:modal:roles')
                        .setTitle('Schlage einen neue Rolle vor')
                        .setComponents([
                            new ActionRowBuilder<TextInputBuilder>()
                                .setComponents(new TextInputBuilder()
                                    .setCustomId(`info:modal:aksfornew:role`)
                                    .setLabel('Rollen Name')
                                    .setPlaceholder('<emoji> | <name>')
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(35)
                                    .setMinLength(1)
                                    .setRequired(true)),
                            new ActionRowBuilder<TextInputBuilder>()
                                .setComponents(new TextInputBuilder()
                                    .setCustomId(`info:modal:aksfornew:reason`)
                                    .setLabel('Grund')
                                    .setPlaceholder('Und warum sollte es diese Rolle geben?')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMaxLength(4000)
                                    .setMinLength(250)
                                    .setRequired(true))
                        ])

                    await interaction.showModal(modal)
                } catch (e) {
                    console.log(e)
                }

            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'info:modal:roles') {
                let role = interaction.fields.getTextInputValue('info:modal:aksfornew:role')
                let reason = interaction.fields.getTextInputValue('info:modal:aksfornew:reason')

                let embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Neuer Rollen Vorschlag')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()
                    .addFields([
                        {
                            name: `Rolle`,
                            value: role,
                            inline: false
                        },
                        {
                            name: `Grund`,
                            value: `\`\`\`${reason}\`\`\``,
                            inline: false
                        },
                    ])

                let channel = await client.channels.fetch(process.env.WelcomeInfoButtonLogChannel) as TextChannel;
                channel.send({ embeds: [embed] })
                return interaction.reply({ ephemeral: true, content: `Der Vorschlag wurde weitergeleitet` })
            }
            if (interaction.customId === 'info:modal:apply') {
                let role = interaction.fields.getTextInputValue('info:modal:apply:role')
                let reason = interaction.fields.getTextInputValue('info:modal:apply:reason')

                let embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Neue Bewerbung')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()
                    .addFields([
                        {
                            name: `Rolle`,
                            value: role,
                            inline: false
                        },
                        {
                            name: `Grund`,
                            value: `\`\`\`${reason}\`\`\``,
                            inline: false
                        },
                    ])

                let channel = await client.channels.fetch(process.env.WelcomeInfoButtonLogChannel) as TextChannel;
                channel.send({ embeds: [embed] })
                return interaction.reply({ ephemeral: true, content: `Die Bewerbung wurde weiter geleitet` })
            }
        }

        if (interaction.isAutocomplete()) {
            const command = client.slashCommand.get(interaction.commandName);

            if (typeof command === 'undefined') return interaction.respond([{ name: `Der Befehl wurde nicht gefunden`, value: `interaction:commmand:notfound` }]);
            else {
                await command.autoComplete(client, interaction)
            }
        }

        if (interaction.isChatInputCommand()) {
            const command = client.slashCommand.get(interaction.commandName);

            if (typeof command === 'undefined') return interaction.reply({ content: `Der Befehl wurde nicht gefunden`, ephemeral: true });
            else {
                try {
                    await command.execute(client, interaction)
                } catch (e) {
                    console.log(e)
                    return interaction.reply({ content: `Es ist ein unbekannter Fehler aufgetreten`, ephemeral: true })
                }
            }
        }
    },
}
export default event;