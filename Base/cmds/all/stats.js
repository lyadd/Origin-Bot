const mysql = require('mysql');

module.exports = {
    name: 'stats',
    dm: false,
    description: "Permet de savoir les statistiques d'un joueur.",
    options: [
        {
            name: 'joueur',
            description: 'Joueur dont vous souhaitez récupérer les statistiques.',
            required: true,
            type: 6
        },
    ],

    go: async (client, db, config, interaction) => {
        if (interaction.channelId !== config.cmd.stats) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.cmd.stats}>`, ephemeral: true }); }

        const
            user = interaction.options.getUser("joueur"),
            pool = mysql.createPool({
                connectionLimit: 15,
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.db
            });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error(`Erreur de connexion à la base de données : ${err.message}`);
                return interaction.reply({ content: "Une erreur s'est produite lors de la connexion à la base de données.", ephemeral: true });
            }

            const player = "SELECT id FROM players WHERE discordId = ?";
            connection.query(player, [user.id], (err, aa) => {
                if (err) {
                    console.error(`Erreur lors de la recherche de l'ID du joueur : ${err.message}`);
                    connection.release();
                    return interaction.reply({ content: "Une erreur s'est produite lors de la recherche de l'ID du joueur.", ephemeral: true });
                }

                if (aa.length === 0) {
                    connection.release();
                    return interaction.reply({ content: "Aucun joueur trouvé avec cet ID Discord.", ephemeral: true });
                }

                const
                    id = aa[0].id,
                    stats = "SELECT * FROM stats WHERE playerId = ?";
                connection.query(stats, [id], (err, bb) => {
                    if (err) {
                        console.error(`Erreur lors de la recherche des statistiques : ${err.message}`);
                        connection.release();
                        return interaction.reply({ content: "Une erreur s'est produite lors de la recherche des statistiques.", ephemeral: true });
                    }

                    if (bb.length === 0) {
                        connection.release();
                        return interaction.reply({ content: "Aucune statistique trouvée pour ce joueur.", ephemeral: true });
                    }

                    const top = "SELECT playerId, mode FROM stats ORDER BY elo DESC";
                    connection.query(top, (err, cc) => {
                        if (err) {
                            console.error(`Erreur lors de la récupération du classement : ${err.message}`);
                            connection.release();
                            return interaction.reply({ content: "Une erreur s'est produite lors de la récupération du classement.", ephemeral: true });
                        }

                        let rank = { rankedNormal: 0, rankedScharmann: 0, rankedMoto: 0, league: 0, mme: 0 };
                        let rankEnded = { rankedNormal: false, rankedScharmann: false, rankedMoto: false, league: false, mme: false };

                        cc.forEach(stat => {
                            if (!rankEnded[stat.mode]) {
                                rank[stat.mode]++;
                                if (stat.playerId === aa[0].id) { rankEnded[stat.mode] = true; }
                            }
                        });

                        const
                            mode = { rankedNormal: "Ranked", rankedScharmann: "Scharmann", rankedMoto: "Moto", league: "League", mme: "MME" },
                            embed = client.embed().setTitle(`Statistiques de ${user.username}`).setThumbnail(user.displayAvatarURL());

                        bb.forEach(stat => {
                            const
                                rankMode = rank[stat.mode],
                                name = mode[stat.mode] || stat.mode,
                                ratio = stat.deaths > 0 ? (stat.kills / stat.deaths).toFixed(2) : "N/A";
                            embed.addFields({
                                name: `${name}`,
                                value: `> **Classement :** #${rankMode}\n` +
                                    `> **Kills :** ${stat.kills}\n` +
                                    `> **Deaths :** ${stat.deaths}\n` +
                                    `> **Wins :** ${stat.wins}\n` +
                                    `> **Looses :** ${stat.looses}\n` +
                                    `> **Elo :** ${stat.elo}\n` +
                                    `> **Ratio (KD) :** ${ratio}`
                            });
                        });

                        interaction.reply({ embeds: [embed] });
                        connection.release();
                    });
                });
            });
        });

        client.on('close', () => pool.end());
    }
};
