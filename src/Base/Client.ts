import { Client, Collection, Partials } from "discord.js";
import { IGatewayEvent, ITextCommand } from "./Structures.js";

const { Channel, GuildMember, Message, User } = Partials;

export class BotClient extends Client {
    public commands = new Collection<string, ITextCommand>(); //<commandname name, command>
    public aliases = new Collection<string, string>(); //<alias name, command name>
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