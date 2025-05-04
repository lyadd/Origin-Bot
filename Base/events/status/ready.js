const net = require('net');

module.exports = async (client, db, config) => {
    client.guilds.cache.forEach(async g => {
        const edit_salon = g.channels.cache.get(config.salon.status);
        if (edit_salon) await edit(g, edit_salon);
    });

    async function check(ip, port) {
        return new Promise((resolve) => {
            const socket = net.createConnection({ host: ip, port }, () => { socket.end(); resolve('\`🟢\`'); });
            socket.on('error', (error) => { resolve('\`🔴\`'); });
        });
    }

    async function edit(guild, channel) {
        const [fivem, cfx] = await Promise.all([
            fetch(`https://servers-frontend.fivem.net/api/servers/single/${config.cfx}`, { method: 'GET', headers: { "User-Agent": "Mozilla" } }).then(res => res.json()),
            fetch(`https://status.cfx.re/api/v2/status.json`, { method: 'GET', headers: { "User-Agent": "Mozilla" } }).then(res => res.json())
        ]);

        const
            row = client.row().addComponents(client.button().setURL(`https://cfx.re/join/odyqej`).setStyle(5).setLabel("Se connecter")),
            embed = client.embed();
        embed.setAuthor({ name: 'Status Serveur' });
        embed.addFields(
            { name: `\`🧑‍🤝‍🧑\`・**IP**`, value: `\`\`\`connect cfx.re/join/odyqej\`\`\`` },
            { name: `\`🧑‍🤝‍🧑\`・**Joueurs**`, value: `**${fivem.Data.clients}/500**`, inline: true },
            { name: `\`🌐\`・**Origin**`, value: `**\`🟢\`**`, inline: true },
            { name: `\`🛠️\`・**Support**`, value: `**\`🟢\`**`, inline: true },
            { name: `\`🔊\`・**Serveur vocal**`, value: `**${await check(config.ip.adress, config.ip.port)}**`, inline: true },
            { name: ' ', value: `Le serveur **Freeroam** offre une expérience de jeu unique et excitante aux joueurs. Il permet aux joueurs de profiter de leur **temps libre** avec leurs amis et de s'amuser sans contraintes. Cependant, pour les joueurs cherchant à relever des défis et prouver leurs compétences, le serveur **Freeroam** propose également un mode **classé** avec de l'**argent** pris chaque **saison**.` }
        );

        const
            messages = await channel.messages.fetch({ limit: 10 }),
            deja = messages.find(msg => msg.author.id === client.user.id);

        if (deja) { await deja.edit({ embeds: [embed], components: [row] }); setInterval(() => refresh(deja), 30000); }
        else { const msg = await channel.send({ embeds: [embed], components: [row] }); setInterval(() => refresh(msg), 30000); }

        async function refresh(msg) {
            const [fivem, cfx] = await Promise.all([
                fetch(`https://servers-frontend.fivem.net/api/servers/single/${config.cfx}`, { method: 'GET', headers: { "User-Agent": "Mozilla" } }).then(res => res.json()),
                fetch(`https://status.cfx.re/api/v2/status.json`, { method: 'GET', headers: { "User-Agent": "Mozilla" } }).then(res => res.json())
            ])

            const embed = client.embed();
            embed.setAuthor({ name: 'Status Serveur' });
            embed.addFields(
                { name: `\`🧑‍🤝‍🧑\`・**IP**`, value: `\`\`\`connect cfx.re/join/odyqej\`\`\`` },
                { name: `\`🧑‍🤝‍🧑\`・**Joueurs**`, value: `**${fivem.Data.clients}/500**`, inline: true },
                { name: `\`🌐\`・**Origin**`, value: `**\`🟢\`**`, inline: true },
                { name: `\`🛠️\`・**Support**`, value: `**\`🟢\`**`, inline: true },
                { name: `\`🔊\`・**Serveur vocal**`, value: `**${await check(config.ip.adress, config.ip.port)}**`, inline: true },
                { name: ' ', value: `Le serveur **Freeroam** offre une expérience de jeu unique et excitante aux joueurs. Il permet aux joueurs de profiter de leur **temps libre** avec leurs amis et de s'amuser sans contraintes. Cependant, pour les joueurs cherchant à relever des défis et prouver leurs compétences, le serveur **Freeroam** propose également un mode **classé** avec de l'**argent** pris chaque **saison**.` }
            );
            msg.edit({ embeds: [embed] });
        }
    }
}