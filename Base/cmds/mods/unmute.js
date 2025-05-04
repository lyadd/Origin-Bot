module.exports = {
    name: "unmute",
    dm: false,
    description: "Permet de unmute un utilisateur.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: "user",
            type: 6,
            required: true
        }
    ],

    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            user = interaction.options.getUser("user"),
            member = interaction.guild.members.cache.get(user.id),
            salon = config.logs.unmute,
            logs = await client.channels.fetch(salon),
            log = client.embed();
        log.setAuthor({ name: 'Unmute d\'un utilisateur' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n > **Informations :**\nDate : <t:${Date.parse(new Date) / 1000}:R>`);
        member.timeout(null).then(() => {
            const embed = client.embed()
            embed.setDescription(`${user} a bien été unmute !`)
            interaction.reply({ embeds: [embed] }).then(() => { logs.send({ embeds: [log] }); });
        })
    }
}