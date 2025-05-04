module.exports = {
    name: "unban",
    dm: false,
    description: "Débannir un utilisateur.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'identifiant',
            description: 'ID de l\'utilisateur à débannir',
            required: true,
            type: 3,
        },
        {
            name: "raison",
            description: "Raison du débannissement",
            type: 3,
            required: true,
        }
    ],
    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
       
        const
            member = interaction.options.getString('identifiant'),
            raison = interaction.options.getString('raison'),
            fetch = await interaction.guild.bans.fetch().catch(() => null),
            bans = fetch.find(user => user.user.id === member),
            reason = bans.reason || "Aucune raison spécifiée",
            salon = config.logs.unban,
            logs = await client.channels.fetch(salon);

        if (!bans) { return interaction.reply({ content: "\`❌\` L'utilisateur n'est pas banni.", ephemeral: true }); }

        await interaction.guild.bans.remove(member, `Débanni par ${interaction.user.tag} pour la raison : ${raison}`);
        const log = client.embed();
        log.setAuthor({ name: 'Débannissement d\'un utilisateur' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${bans.user.username}\`\nIdentifiant : \`${bans.user.id}\`\n\n > **Informations :**\nRaison du bannissement initial : \`${reason}\`\nRaison du débannissement : \`${raison}\`\nDate : <t:${Date.parse(new Date) / 1000}:R>`);

        const embed = client.embed();
        embed.setDescription(`L'utilisateur **${bans.user.username}** (\`${bans.user.id}\`) a été débanni.\nRaison : \`${raison}\` par <@${interaction.user.id}>`);
        return interaction.reply({ embeds: [embed] }).then(() => { logs.send({ embeds: [log] }); });
    },
};