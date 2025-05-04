module.exports = {
    name: 'setgroup',
    dm: false,
    description: "Permet de mettre une personne modérateur ou staff.",
    options: [
        {
            name: 'type',
            description: 'Choisissez le type de rôle à attribuer',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'Modérateur',
                    value: 'Modérateur'
                },
                {
                    name: 'Staff',
                    value: 'Staff'
                },
            ],
        },
        {
            name: 'utilisateur',
            description: 'Utilisateur à qui attribuer le rôle',
            required: true,
            type: 6
        },
    ],

    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        
        const
            type = interaction.options.getString("type"),
            user = interaction.options.getUser("utilisateur"),
            member = interaction.guild.members.cache.get(user.id),
            salon = config.logs.rank,
            logs = await client.channels.fetch(salon),
            log = client.embed();

        log.setAuthor({ name: 'Rank d\'un utilisateur' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n > **Informations :**\nRank : \`${type}\`\nDate : <t:${Math.floor(Date.now() / 1000)}:R>`);

        let role;

        if (type === "Modérateur") { role = config.staffRole.moderateur; }
        else if (type === "Staff") { role = config.staffRole.staff; }

        if (role) {
            if (member.roles.cache.has(role)) { return interaction.reply({ content: `\`✅\` ${user} possède déjà le rôle <@&${role}>.`, ephemeral: true }); }
            await member.roles.add(role);
            await interaction.reply({ content: `J'ai bien attribué le rôle <@&${role}> à ${user}`, ephemeral: true });
            logs.send({ embeds: [log] });
        } else { await interaction.reply({ content: "\`❌\` Type de rôle invalide.", ephemeral: true }); }
    }
}