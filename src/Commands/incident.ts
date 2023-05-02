import { Colors, Embed, EmbedBuilder, Message, escapeMarkdown } from "discord.js";
import { ITextCommand } from "../Base/Structures.js";
import Incident, { Status } from "../db/incident.js";
const command: ITextCommand = {
    data: {
        name: 'incident',
        alias: [`inc`],
        ownerOnly: true
    },
    execute: async (client, message, args) => {
        let incidentId = args[0];

        let collection = await Incident.findOne({ messageId: incidentId }).then((i) => i);
        if (!collection) {
            //create a new one


            if (/^.{17,20}$/gm.test(incidentId) !== false) args.shift()
            let title = args.join(" ")

            if (!title) return message.reply(`I need a title`)

            let IncidentCreated = message.createdTimestamp;



            let newIncident = await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Grey')
                        .setTitle(title)
                        .setTimestamp()
                        .addFields([
                            {
                                inline: false,
                                name: Status.INVESTIGATING,
                                value: `> <t:${IncidentCreated / 1000 | 0}> Wir untersuchen das Problem`
                            }
                        ])
                ]
            })

            let newIncidentEntry = await Incident.create({
                messageId: newIncident.id,
                status: Status.INVESTIGATING,
                investigating: IncidentCreated,
                title: title,
            })

            return message
                .reply({ content: `Created a new Incident with title: \`${title}\`\nhttps://discord.com/channels/${newIncident.guildId}/${newIncident.channelId}/${newIncidentEntry.messageId}` })
                .then((m) => {
                    setTimeout(async () => {
                        message.delete();
                        m.delete()
                    }, 5000)
                })
        } else {
            //update an old one

            let timestamp = message.createdTimestamp;
            let fetchedMessage = message.channel.messages.cache.get(collection.messageId);

            if (typeof fetchedMessage === 'undefined') fetchedMessage = (await message.channel.messages.fetch()).get(collection.messageId)

            if (typeof fetchedMessage === 'undefined') return message.reply(`I cant get the message`)

            let embed = fetchedMessage.embeds[0];

            if (typeof fetchedMessage === 'undefined') return message
                .reply(`Es tut mir leid, aber die Ursprungsnachricht befindet sich nicht in diesem Kanal.`)
                .then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, 5000)
                })


            function buildUpdatedEmbed(embed: Embed, status: Status, value: string, color: keyof typeof Colors) {
                let updatedEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(embed.title)
                    .setTimestamp()

                embed.fields.forEach((embedFiled) => {
                    updatedEmbed.addFields([
                        {
                            inline: embedFiled.inline,
                            name: embedFiled.name,
                            value: embedFiled.value
                        }
                    ])
                })

                updatedEmbed.addFields([
                    {
                        inline: false,
                        name: status,
                        value: value
                    }
                ])

                return updatedEmbed;
            }

            if (collection.status === Status.INVESTIGATING) {
                //INVESTIGATING -> MONITORING

                await Incident.findOneAndUpdate({
                    messageId: message.id,
                }, {
                    $set: {
                        status: Status.MONITORING,
                        monitoring: timestamp
                    }
                }).then(async (db) => {
                    let updatedEmbed = buildUpdatedEmbed(embed, Status.MONITORING, `> <t:${timestamp / 1000 | 0}> Wir haben das Problem gefunden einen fix implementiert und beobachten das Problem`, "Orange",)
                    fetchedMessage.edit({ embeds: [updatedEmbed] })

                    return await message
                        .reply(`Das Incident wurde geupdated`).then((msg) => {
                            setTimeout(async () => {
                                message.delete();
                                msg.delete();
                            }, 5000);
                        });
                })
            } else if (collection.status === Status.MONITORING) {
                //MONITORING -> UPDATE

                await Incident.findOneAndUpdate({
                    messageId: message.id,
                }, {
                    $set: {
                        status: Status.UPDATE,
                        update: timestamp
                    }
                }).then(async (db) => {
                    let updatedEmbed = buildUpdatedEmbed(embed, Status.UPDATE, `> <t:${timestamp / 1000 | 0}> Das Incident wurde geupdated und wird bald behoben sein.`, "Purple",)
                    fetchedMessage.edit({ embeds: [updatedEmbed] })

                    return await message
                        .reply(`Das Incident wurde geupdated`).then((msg) => {
                            setTimeout(async () => {
                                message.delete();
                                msg.delete();
                            }, 5000);
                        });
                })
            } else if (collection.status === Status.UPDATE) {
                //UPDATE -> RESOLVED

                await Incident.findOneAndUpdate({
                    messageId: message.id,
                }, {
                    $set: {
                        status: Status.RESOLVED,
                        update: timestamp
                    }
                }).then(async (db) => {
                    let updatedEmbed = buildUpdatedEmbed(embed, Status.RESOLVED, `> <t:${timestamp / 1000 | 0}> Das Incident wurde behoben`, "Green",)
                    fetchedMessage.edit({ embeds: [updatedEmbed] })

                    return await message
                        .reply(`Das Incident wurde geupdated`).then((msg) => {
                            setTimeout(async () => {
                                message.delete();
                                msg.delete();
                            }, 5000);
                        });
                })
            } else if (collection.status === Status.RESOLVED) {
                //RESOLVED -> return

                return message
                    .reply(`Das Incident ist bereits abgeschlossen`)
                    .then((m) => {
                        setTimeout(() => {
                            m.delete()
                        }, 5000)
                    })
            }
        }
    },
}

export default command;