

const
    { db } = require('irodb'),
    { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js"),
    { readdirSync } = require("fs"),
    config = require('./config.js');

(async () => {
    const
        { table } = await new db({ cryptData: false, path: './database' }),
        data = new table("data"),
        client = new (class client extends Client {
            constructor() {
                super({
                    fetchAllMembers: true, restTimeOffset: 0, allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: false, },
                    partials: Object.keys(Partials),
                    intents: Object.keys(GatewayIntentBits)
                });
                this.config = config;
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
            go = async () => this.login(this.config.token).catch(() => { throw new Error(`[B0T] => Token invalide ou manque d'intents`) });
            embed = () => new EmbedBuilder().setColor('#fbbb03').setTimestamp();
            row = () => new ActionRowBuilder();
            menu = () => new StringSelectMenuBuilder();
            button = () => new ButtonBuilder();
            modal = () => new ModalBuilder();
            textInput = () => new TextInputBuilder()
        });

    client.rest.on('rateLimited', (info) => console.log(`[BOT] => Rate Limited:` + info));

    let count = 0;
    const dir = `./events`;
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}\\${dirs}\\`).filter(files => files.endsWith(".js"));
        for (const event of events) {
            client.on(event.split(".")[0], (require(`${dir}\\${dirs}\\${event}`)).bind(null, client, data, config));
            count++
        }
    });

    try {
        let allCommands = [];
        const dir = `./cmds`;
        readdirSync(dir).forEach(dirs => {
            for (const file of readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"))) {
                const cmd = require(`${dir}/${dirs}/${file}`);
                cmd.class = dirs;
                if (!cmd.name) {
                    console.log(`[BOT] => Chargement impossible {${dir}/${dirs}/${file}}`)
                    continue;
                } else {
                    switch (cmd.type) {
                        case "CHAT_INPUT": { cmd.type = client.commandsType.CHAT_INPUT } break;
                        case "MESSAGE": { cmd.type = client.commandsType.MESSAGE } break;
                        case "USER": { cmd.type = client.commandsType.USER } break;
                        default: break;
                    }
                    if (cmd.options) cmd.options.forEach((option) => {
                        switch (option.type) {
                            case "STRING": { option.type = client.optionsTypes.STRING } break;
                            case "NUMBER": { option.type = client.optionsTypes.NUMBER } break;
                            case "INTEGER": { option.type = client.optionsTypes.INTEGER } break;
                            case "BOOLEAN": { option.type = client.optionsTypes.BOOLEAN } break;
                            case "USER": { option.type = client.optionsTypes.USER } break;
                            case "ROLE": { option.type = client.optionsTypes.ROLE } break;
                            case "CHANNEL": { option.type = client.optionsTypes.CHANNEL } break;
                            case "MENTIONABLE": { option.type = client.optionsTypes.MENTIONABLE } break;
                            case "ATTACHMENT": { option.type = client.optionsTypes.ATTACHMENT } break;
                            case "SUB_COMMAND": { option.type = client.optionsTypes.SUB_COMMAND } break;
                            case "SUB_COMMAND_GROUP": { option.type = client.optionsTypes.SUB_COMMAND_GROUP } break;
                            default: break
                        }
                    });
                    client.cmds.set(cmd.name, cmd);
                    allCommands.push(cmd)
                }
            }
        });

        client.on("ready", async () => {
            await client.application.commands.set(allCommands);
            console.log(`[B0T] => ${client.cmds.size} Slash Command${client.cmds.size <= 1 ? "" : "s"} ont été chargé !`)
        }).go()
    } catch (e) { console.log(e) }
})()