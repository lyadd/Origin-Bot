const mysql = require('mysql');

module.exports = {
    name: 'reset-elo',
    dm: false,
    description: "Réinitialise les statistiques d'un joueur à leurs valeurs par défaut.",
    options: [
        {
            name: 'id-unique',
            description: 'ID Unique',
            required: true,
            type: 4,
        },
        {
            name: 'mode',
            description: 'Choisir le mode',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'ranked',
                    value: 'ranked'
                },
                {
                    name: 'scharmann',
                    value: 'scharmann'
                },
                {
                    name: 'moto',
                    value: 'moto'
                },
                {
                    name: 'mme',
                    value: 'mme'
                },
                {
                    name: 'league',
                    value: 'league'
                },
            ],
        },
    ],
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            input = interaction.options.getString('mode'),
            id = interaction.options.getInteger('id-unique'),
            salon = config.logs.elo,
            logs = await client.channels.fetch(salon),
            map = { 'ranked': 'rankedNormal', 'scharmann': 'rankedScharmann', 'moto': 'rankedMoto', 'mme': 'mme', 'league': 'league' },
            mode = map[input],
            pool = mysql.createPool({
                connectionLimit: 15,
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.db
            });

        if (!mode) { return interaction.reply({ content: "`❌` Mode invalide. Utilisez 'ranked', 'scharmann', 'moto', 'mme' ou 'league'.", ephemeral: true }); }

        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Erreur de connexion à la base de données : ", err);
                return interaction.reply({ content: "`❌` Une erreur est survenue lors de la connexion à la base de données.", ephemeral: true });
            }

            const check = `SELECT * FROM stats WHERE playerId = ? AND \`mode\` = ?`;
            connection.query(check, [id, mode], (err, results) => {
                if (err) {
                    connection.release();
                    console.error("Erreur de vérification : ", err);
                    return interaction.reply({ content: "`❌` Une erreur est survenue lors de la vérification des données.", ephemeral: true });
                }

                if (results.length === 0) {
                    connection.release();
                    return interaction.reply({ content: "Aucune statistique trouvée pour ce joueur.", ephemeral: true });
                }

                const update = `UPDATE stats SET kills = 0, deaths = 0, wins = 0, looses = 0, elo = 500 WHERE playerId = ? AND \`mode\` = ?`;
                connection.query(update, [id, mode], (err, results) => {
                    connection.release();
                    if (err) {
                        console.error("Erreur de mise à jour : ", err);
                        return interaction.reply({ content: "`❌` Une erreur est survenue lors de la réinitialisation des données.", ephemeral: true });
                    }

                    const embed = client.embed()
                    embed.setTitle('Mise à jour des statistiques')
                    embed.setDescription(`Type d'action : **Reset**\n` +
                        `Mode : **${mode}**\n` +
                        `ID Unique: **${id}**\n` +
                        `Staff : **<@${interaction.user.id}> | \`${interaction.user.id}\`**`)

                    logs.send({ embeds: [embed] });
                    interaction.reply({ content: "`✅` Les statistiques ont été réinitialisées avec succès.", ephemeral: true });
                });
            });
        });
    }
};
