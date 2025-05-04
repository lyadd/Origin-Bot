const { ChannelType } = require('discord.js')

module.exports = async (client, db, config, message) => {
    if (!client.soutienCooldowns) { client.soutienCooldowns = new Map(); }
    if (!client.streamerCooldowns) { client.streamerCooldowns = new Map(); }

    if (message.channel.type === ChannelType.GuildText && message.channel.id === config.cmd.discussion) {
        const soutien = ["soutien", "soutiens", "soutient"];
        if (soutien.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
            if (message.author.id === client.user.id) return;

            const
                time = client.soutienCooldowns.get(message.author.id),
                now = Date.now();

            if (time && (now - time < 60 * 1000)) { return; }
            client.soutienCooldowns.set(message.author.id, now);
            message.channel.send("*Pour obtenir le rôle de soutien, veuillez ajouter **.gg/playorigin** à votre **statut Discord**. Le rôle vous sera attribué automatiquement. Vous bénéficierez également d'avantages en jeu tels que **des armes et une priorité d'accès.** *");
        }
    }
    if (message.channel.type === ChannelType.GuildText && message.channel.id === config.cmd.discussion) {
        const streamer = ["streamer"];
        if (streamer.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
            if (message.author.id === client.user.id) return;

            const
                time = client.streamerCooldowns.get(message.author.id),
                now = Date.now();

            if (time && (now - time < 60 * 1000)) { return; }
            client.streamerCooldowns.set(message.author.id, now);
            message.channel.send("*Pour obtenir le rôle de **streamer**, veuillez ouvrir un ticket au **Bot Support** en indiquant vos **Statistique Twitch.***");
        }
    }
};