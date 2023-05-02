import { SlashCommandBuilder, ChatInputCommandInteraction, Message, type PermissionResolvable } from "discord.js"
import { BotClient } from "./Client.js"

export interface ITextCommandData {
    name: string,
    alias?: string[],
    ownerOnly?: boolean,
    userPerms?: PermissionResolvable,
    botPerms?: PermissionResolvable
}

export interface ITextCommand {
    data: ITextCommandData,
    execute: (client: BotClient, message: Message, args: string[]) => void
}

export interface IGatewayEvent {
    name: string,
    once?: boolean | false,
    execute: (...args: any) => void
}