import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { IGatewayEvent, ISlashCommand, ITextCommand } from "./Structures.js";

const { Channel, GuildMember, Message, User } = Partials;

export class BotClient extends Client {
    public commands = new Collection<string, ITextCommand>(); //<TextCmmandname name, command>
    public aliases = new Collection<string, string>(); //<alias name, command name>

    public slashCommand = new Collection<string, ISlashCommand>() //<SlashCmmandname name, command>

    public events = new Collection<string, IGatewayEvent>(); //<event name, event>

    constructor() {
        super(
            {
                intents: ["GuildMembers", "GuildMessages", "GuildPresences", "Guilds", "MessageContent"],
                partials: [Channel, GuildMember, Message, User],
                presence: {
                    status:'online',
                }
            }
        )
    }
}