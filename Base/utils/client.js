const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
class client extends Client {
    constructor() {
        super({
            fetchAllMembers: true,
            restTimeOffset: 0,
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false,
            },
            partials: Object.keys(Partials),
            intents: Object.keys(GatewayIntentBits)
        });
        this.config = require("./config.json");
        this.autoReconnect = true;
        this.cmds = new Collection();
        this.commandsType = {
            CHAT_INPUT: 1,
            USER: 2,
            MESSAGE: 3,
        };
        this.optionsTypes = {
            SUB_COMMAND: 1,
            SUB_COMMAND_GROUP: 2,
            STRING: 3,
            INTEGER: 4,
            BOOLEAN: 5,
            USER: 6,
            CHANNEL: 7,
            ROLE: 8,
            MENTIONABLE: 9,
            NUMBER: 10,
            ATTACHMENT: 11,
        };
    };

    async go() {
        this.login(this.config.token).catch(() => {
            throw new Error(`[B0T] => Token invalide ou manque d'intents`)
        })
    };

    embed() {
        const embed = new EmbedBuilder();
        embed.setColor('#fbbb03')
        return embed
    };

    row() {
        return new ActionRowBuilder()
    };

    menu() {
        return new StringSelectMenuBuilder()
    };

    button() {
        return new ButtonBuilder()
    };

    modal() {
        return new ModalBuilder()
    };

    textInput() {
        return new TextInputBuilder()
    };

    userSelect() {
        return new UserSelectMenuBuilder()
    }

    attachment(f, name) {
        return new AttachmentBuilder(f, { name })
    }
};

module.exports = client