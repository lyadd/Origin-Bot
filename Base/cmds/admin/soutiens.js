module.exports = {
    name: "soutiens",
    dm: false,
    description: "Permet de configurer la commande soutiens.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'type',
            description: 'Configurer la commande soutiens',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'set',
                    value: 'set'
                },
                {
                    name: 'remove',
                    value: 'remove'
                },
            ],
        },
        {
            name: 'role',
            description: 'role à mettre',
            required: true,
            type: 8,
        },
        {
            name: 'statut',
            description: 'statut à mettre',
            required: true,
            type: 3,
        },
    ],

    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.staffRole.admin)) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            type = interaction.options.getString('type'),
            statut = interaction.options.getString('statut'),
            role = interaction.options.getRole('role'),
            guild = client.guilds.cache.get(config.guildID);

        if (type === 'set') {
            await db.set(`role_${guild.id}`, role.id);
            await db.set(`statut_${guild.id}`, statut);
            const embed = client.embed();
            embed.setDescription(`Les personnes qui auront en statut \`${statut}\` obtiendront le rôle ${role}`);
            return interaction.reply({ embeds: [embed] });

        } else if (type === 'remove') {
            await db.delete(`role_${guild.id}`);
            await db.delete(`statut_${guild.id}`);
            const embed = client.embed();
            embed.setDescription(`J'ai bien supprimé le système de soutien dans la db`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}