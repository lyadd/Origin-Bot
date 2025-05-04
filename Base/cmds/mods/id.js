const mysql = require('mysql');

module.exports = {
    name: 'id',
    dm: false,
    description: "Permet de savoir les informations d'un joueur.",
    options: [
        {
            name: 'id',
            description: 'ID du joueur (Discord ou ID Unique)',
            required: true,
            type: 3
        },
    ],

    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        const
            user = interaction.options.getString("id"),
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

            const query = "SELECT * FROM players WHERE discordId = ? OR id = ?";
            connection.query(query, [user, user], (err, results) => {
                connection.release();

                if (err) {
                    console.error(`Erreur lors de la recherche de l'ID du joueur : ${err.message}`);
                    return interaction.reply({ content: "Une erreur s'est produite lors de la recherche des informations.", ephemeral: true });
                }

                if (results.length > 0) {
                    const
                        info = results[0],
                        embed = client.embed()
                    embed.setTitle('Informations Utilisateur')
                    embed.addFields(
                        { name: "ID Unique", value: `\`${info.id}\`` },
                        { name: "Identifiant Discord", value: info.discordId ? `<@${info.discordId}> (\`${info.discordId}\`)` : '`Discord non lié`' }
                    );
                    interaction.reply({ embeds: [embed] });
                } else {
                    interaction.reply({ content: "Aucune information trouvée pour cet utilisateur.", ephemeral: true });
                }
            });
        });
        client.on('close', () => pool.end());
    }
}