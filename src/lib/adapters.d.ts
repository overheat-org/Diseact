import { ChatInputCommandInteraction } from "discord.js";

type ExcludeKeys = 
    | 'reply'
    | 'editReply'
    | 'fetchReply'
    | 'deferReply'
    | 'toString'
    | 'sendPremiumRequired';

export interface SlashCommandInteractionAdapter extends Omit<ChatInputCommandInteraction<'cached'>, ExcludeKeys> {}
