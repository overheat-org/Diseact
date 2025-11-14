// @ts-nocheck

import { ChatInputCommandInteraction } from "discord.js";

const KEYS_BLACKLIST = [
    'reply',
    'editReply',
    'fetchReply',
    'deferReply',
    'followUp',
    'toString',
    'sendPremiumRequired'
    // 'showModal',
    // 'awaitModalSubmit',
];

export class SlashCommandInteractionAdapter {
    constructor(__interaction__) {
        this.__interaction__ = __interaction__;
        
        Object.keys(__interaction__).forEach(p => {
            if (KEYS_BLACKLIST.includes(p)) return;

            this[p] = __interaction__[p];
        });
    }

    followUp(...args) {
        this.__interaction__.followUp(...args);
    }
}
