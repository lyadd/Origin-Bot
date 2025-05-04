module.exports = {
    name: "warnlist",
    dm: false,
    description: "Affiche les warn d'un utilisateur spécifique.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: 'user',
            required: true,
            type: 6,
        },
    ],
    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        
        const
            user = interaction.options.getUser("user"),
            warn = db.get(`warn_${user.id}`) || [];

        let list = warn.length > 0 ? warn.map((warning, index) => `> **${index + 1}**. Modérateur: <@${warning.moderator}>\n> Raison: **${warning.reason}**\n> Date du warn: <t:${Math.floor(warning.timestamp / 1000)}:R>`) : [];

        const embed = client.embed();
        embed.setTitle(`Profil de ${user.username}`)
        embed.setDescription(`${list.length > 0 ? '**Avertissement :**\n' + list.join('\n\n') : 'Aucun Avertissement'}`);
        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}