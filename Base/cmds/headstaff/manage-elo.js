const mysql = require('mysql');

module.exports = {
    name: 'manage-elo',
    dm: false,
    description: "Permet de donner ou retirer des elo d'une personne.",
    options: [
        {
            name: 'type',
            description: 'Choisir give ou remove',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'give',
                    value: 'give'
                },
                {
                    name: 'remove',
                    value: 'remove'
                },
            ],
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
        {
            name: 'combien',
            description: 'Combien d\'élo',
            required: true,
            type: 4,
        },
        {
            name: 'id-unique',
            description: 'ID Unique',
            required: true,
            type: 4,
        },
    ],
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            type = interaction.options.getString('type'),
            input = interaction.options.getString('mode'),
            combien = interaction.options.getInteger('combien'),
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

            const check = `SELECT elo FROM stats WHERE playerId = ? AND \`mode\` = ?`;
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

                const deja = results[0].elo;
                let newElo;

                if (type === 'give') { newElo = deja + combien; }
                else if (type === 'remove') { newElo = Math.max(0, deja - combien); }
                else {
                    connection.release();
                    return interaction.reply({ content: "`❌` Type invalide. Utilisez 'give' ou 'remove'.", ephemeral: true });
                }

                const
                    update = `UPDATE stats SET elo = ? WHERE playerId = ? AND \`mode\` = ?`,
                    params = [newElo, id, mode];

                connection.query(update, params, (err, results) => {
                    connection.release();
                    if (err) {
                        console.error("Erreur de mise à jour : ", err);
                        return interaction.reply({ content: "`❌` Une erreur est survenue lors de la mise à jour des données.", ephemeral: true });
                    }

                    const embed = client.embed()
                    embed.setTitle('Mise à jour des statistiques')
                    embed.setDescription(`Type d'action : ${type === 'give' ? '**Ajout**' : '**Retrait**'}\n` +
                        `Mode : **${mode}**\n` +
                        `ID Unique: **${id}**\n` +
                        `Élo : **${combien}**\n` +
                        `Élo avant : **${deja}**\n` +
                        `Élo après : **${newElo}**\n` +
                        `Staff : **<@${interaction.user.id}> | \`${interaction.user.id}\`**`)

                    logs.send({ embeds: [embed] });
                    interaction.reply({ content: "`✅` ELO mis à jour avec succès.", ephemeral: true });
                });
            });
        });
    }
}