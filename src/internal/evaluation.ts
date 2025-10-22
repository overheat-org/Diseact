export default async function evaluate(target, content, first) {
    if(
        /(^User$)|(^GuildMember$)|(Channel$)/.test(target.constructor.name)
    ) 
        return evaluateChannelBased(target, content, first);
    else if(
        target.constructor.name == 'ChatInputCommandInteraction'
    )
        return evaluateSlashCommand(target, content, first);
    else if(
        target.constructor.name == 'Message'
    )
        return evaluateMessage(target, content, first);
    else
        throw new Error(`Unexpected target: ${target}`);
}

async function evaluateChannelBased(target, content, first) {
    target = await target.send(content);

    return target;
}

async function evaluateSlashCommand(target, content, first) {
    if (first) {
        await target.reply(content);
    } else {
        if (target.ephemeral) {
            throw new Error("Cannot edit an ephemeral interaction");
        }
        await target.editReply(content);
    }

    return target;
}

async function evaluateMessage(target, content, first) {
    if (first) {
        target = await target.channel.send(content);
    } else {
        target = await target.edit(content);
    }

    return target;
}
