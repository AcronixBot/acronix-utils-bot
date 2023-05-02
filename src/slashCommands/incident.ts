import { ChannelType, Colors, Embed, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { ISlashCommand } from "../Base/Structures";
import Incident, { Status, updateOptions } from "../db/incident.js";

const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName('incident')
        .setDescription('Verwaltet die Incidents [OWNER ONLY]')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('neu')
                .setDescription('Erstellt ein neues Incident')
                .addStringOption(option => option.setName('title').setDescription('Der Title des Incidents').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription(`Der Kanalö`).addChannelTypes(ChannelType.GuildText).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('löschen')
                .setDescription('Löscht eine Incident')
                .addStringOption(option => option.setName('title').setDescription('Der Title des Incidents').setRequired(true).setAutocomplete(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Updates ein Incident')
                .addStringOption(option => option
                    .setName('messageid')
                    .setDescription('Die Message Id vom Incident')
                    .setRequired(true)
                    .setAutocomplete(true)
                )
                .addStringOption(option =>
                    option
                        .setName('newstatus')
                        .setDescription(`Der neue Status vom Incident`)
                        .setRequired(true)
                        .addChoices(
                            {
                                name: Status.MONITORING,
                                value: Status.MONITORING,
                            },
                            {
                                name: Status.UPDATE,
                                value: Status.UPDATE,
                            },
                            {
                                name: Status.RESOLVED,
                                value: Status.RESOLVED,
                            }
                        )
                )
        ),
    execute: async (client, interaction) => {
        if (interaction.options.getSubcommand() === 'löschen') {
            let title = interaction.options.getString('title');

            //extract message id
            let messageId = title.split(`(`)[1].split(')')[0];
            if (/^.{17,20}$/gm.test(messageId) !== true) return interaction.reply({ content: `I could not extract the message Id`, ephemeral: true });

            //get incident
            let incident = await Incident.findOne({ messageId: messageId }).then((i) => i);
            if (typeof incident === 'undefined') return interaction.reply({ content: `Ich konnte keine Datenbank finden`, ephemeral: true });

            else {
                incident.deleteOne().then(() => interaction.reply({ephemeral:true, content:`Deleted the Incident`}))
            }
        }

        if (interaction.options.getSubcommand() === 'neu') {
            let title = interaction.options.getString('title');
            let channel = interaction.options.getChannel('channel') as TextChannel;
            let timestamp = interaction.createdTimestamp;

            let newIncident = await channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Grey')
                        .setTitle(title)
                        .setTimestamp()
                        .addFields([
                            {
                                inline: false,
                                name: Status.INVESTIGATING,
                                value: `> <t:${timestamp / 1000 | 0}> Wir untersuchen das Problem`
                            }
                        ])
                ]
            })

            let newIncidentEntry = await Incident.create({
                messageId: newIncident.id,
                status: Status.INVESTIGATING,
                investigating: timestamp,
                title: title,
            })

            return interaction.reply({ content: `Created a new Incident with title: \`${title}\`\nhttps://discord.com/channels/${newIncident.guildId}/${newIncident.channelId}/${newIncidentEntry.messageId}`, ephemeral: true })
        }
        if (interaction.options.getSubcommand() === 'update') {
            /**
             * [x] check for resolve
             *      if resolved return
             * []
             */

            //define properties
            let newStatus = interaction.options.getString('newstatus')
            let choosenOption = interaction.options.getString('messageid')
            let timestamp = interaction.createdTimestamp;

            //extract message id
            let messageId = choosenOption.split(`(`)[1].split(')')[0];
            if (/^.{17,20}$/gm.test(messageId) !== true) return interaction.reply({ content: `I could not extract the message Id`, ephemeral: true });

            //get incident
            let incident = await Incident.findOne({ messageId: messageId }).then((i) => i);
            if (typeof incident === 'undefined') return interaction.reply({ content: `Ich konnte keine Datenbank finden`, ephemeral: true });

            //return if already resolved
            if (incident.status === Status.RESOLVED) return interaction.reply({ content: `Das Incident wurde bereits als beendet makiert`, ephemeral: true });

            //fetch message and embed
            let message = await (await interaction.channel.messages.fetch()).get(incident.messageId);
            if (typeof message === 'undefined') return interaction.reply({ content: `Das Incident scheint nicht in diesem Kanal zu sein`, ephemeral: true });

            let embed = message.embeds[0];


            //update incident
            let updateOptions: updateOptions = {
                status: Status[newStatus],
            }
            switch (newStatus) {
                case (Status.MONITORING): {
                    updateOptions.monitoring = timestamp
                }
                case (Status.UPDATE): {
                    updateOptions.update = timestamp
                }
                case (Status.RESOLVED): {
                    updateOptions.resolved = timestamp
                }
            }

            await incident.updateOne({
                $set: {
                    updateOptions
                }
            })


            //function to build the embed
            function buildUpdatedEmbed(embed: Embed, status: string, value: string, color: keyof typeof Colors) {
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
                        name: `${status}`,
                        value: value
                    }
                ])

                return updatedEmbed;
            }

            let updateEmbed = buildUpdatedEmbed(embed,
                newStatus,
                newStatus === Status.MONITORING
                    ? `> <t:${timestamp / 1000 | 0}> Wir haben das Incident gefunden und beobachten es` : newStatus === Status.UPDATE
                        ? `> <t:${timestamp / 1000 | 0}> Wir haben einen Fix implmentiert und das Issue wird bald behoben sein` : `> <t:${timestamp / 1000 | 0}> Das Issue wurde behoben`,
                newStatus === Status.MONITORING
                    ? 'Orange' : newStatus === Status.UPDATE
                        ? 'Purple' : 'Green'
            )

            message.edit({ embeds: [updateEmbed] })

            return interaction.reply({ content: `Das Incident wurde geupdated`, ephemeral: true })
        }
    },
    autoComplete: async (client, interaction) => {
        /**
         * [] filter the incidents out which a resolved
         */
        const focusedValue = interaction.options.getFocused();

        let collection = await Incident.find()

        const choices: string[] = []

        if (Array.isArray(collection) && collection.length !== 0) {
            collection.map((entry) => {
                if (entry.status === Status.RESOLVED) choices.push(`${entry.title} (${entry.messageId})  [ENDED]`)
                else choices.push(`${entry.title} (${entry.messageId})`)
            })

            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        } else {
            choices.push(`Keine Incidents vorhanden`)

            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    },
}
export default command;