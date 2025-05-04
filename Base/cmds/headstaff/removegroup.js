module.exports = {
    name: 'removegroup',
    dm: false,
    description: "Permet de retirer une personne modérateur.",
    options: [
        {
            name: 'utilisateur',
            description: 'Utilisateur',
            required: true,
            type: 6
        },
    ],

    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
       
        const
            user = interaction.options.getUser("utilisateur"),
            member = interaction.guild.members.cache.get(user.id);
        if (!member) { return interaction.reply({ content: "\`❌\` Utilisateur non trouvé dans le serveur.", ephemeral: true }); }

        try {
            const role = [config.staffRole.staff, config.staffRole.moderateur];
            await member.roles.remove(role);
        } catch (error) { return interaction.reply({ content: "\`❌\` Une erreur s'est produite lors de la suppression des rôles.", ephemeral: true }); }

        const
            salon = config.logs.derank,
            logs = await client.channels.fetch(salon),
            log = client.embed();
        log.setAuthor({ name: 'Derank d\'un utilisateur' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n > **Informations :**\nDate : <t:${Math.floor(Date.now() / 1000)}:R>`);
        await logs.send({ embeds: [log] });
        await interaction.reply({ content: `J'ai bien retiré les permissions à ${user}`, ephemeral: true });
    }
}