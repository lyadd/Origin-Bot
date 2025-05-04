const mysql = require('mysql');

module.exports = async (client, db, config) => {
    const pool = mysql.createPool({
        connectionLimit: 15,
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.db
    });

    client.guilds.cache.forEach(async g => {
        const edit_salon = g.channels.cache.get(config.salon.leaderboard);
        if (edit_salon) await edit(g, edit_salon);
    });

    async function edit(guild, channel) {
        const messages = await channel.messages.fetch({ limit: 10 });
        let deja = messages.find(msg => msg.author.id === client.user.id);

        if (!deja) { deja = await channel.send({ embeds: await hehe() }); }
        else { await deja.edit({ content: `**Dernière modification** : <t:${Math.floor(Date.now() / 1000)}:d> (<t:${Math.floor(Date.now() / 1000)}>)`, embeds: await hehe() }); }
        setInterval(() => refresh(deja), 1800000);
    }

    async function refresh(msg) {
        msg.edit({ content: `**Dernière modification** : <t:${Math.floor(Date.now() / 1000)}:d> (<t:${Math.floor(Date.now() / 1000)}>)`, embeds: await hehe() });
    }

    async function hehe() {
        const aa = await top('rankedNormal');
        const bb = slm('Top 10 Ranked Normal', aa);
        const cc = await top('rankedScharmann');
        const dd = slm('Top 10 Ranked Scharmann', cc);
        const ee = await top('rankedMoto');
        const ff = slm('Top 10 Ranked Moto', ee);
        return [bb, dd, ff];
    }

    async function top(mode) {
        return new Promise((resolve, reject) => {
            const query = "SELECT players.discordId, stats.elo FROM stats JOIN players ON stats.playerId = players.id WHERE stats.mode = ? ORDER BY stats.elo DESC LIMIT 10";
            pool.query(query, [mode], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    function slm(title, data) {
        const embed = client.embed()
            .setTitle(title)
            .setFooter({ text: 'Mise à jour toutes les 30 minutes', iconURL: 'https://cdn.discordapp.com/attachments/1059105936532312115/1073691540725186590/logo.png' })
            .setThumbnail('https://cdn.discordapp.com/attachments/1059105936532312115/1073691540725186590/logo.png');

        data.forEach((player, index) => {
            let medal = '';
            if (index === 0) medal = ':first_place: ';
            else if (index === 1) medal = ':second_place: ';
            else if (index === 2) medal = ':third_place: ';
            const rank = index < 3 ? '' : `#${index + 1}`;
            embed.addFields({ name: ` `, value: `**${medal}${rank}** <@${player.discordId}>\nElo : **${player.elo}**` });
        });
        return embed;
    }
    client.on('close', () => pool.end());
};