const ms = require("ms")

module.exports = {
    name: "mute",
    dm: false,
    description: "Permet de mute un utilisateur.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: "user",
            type: 6,
            required: true
        },
        {
            name: 'time',
            description: "time",
            type: 3,
            required: true
        },
        {
            name: 'raison',
            description: 'la raison du mute',
            type: 3,
            required: true
        }
    ],

    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        
        const
            user = interaction.options.getUser("user"),
            member = interaction.guild.members.cache.get(user.id),
            time = interaction.options.getString("time"),
            reason = interaction.options.getString('raison'),
            convert = ms(time),
            salon = config.logs.mute,
            logs = await client.channels.fetch(salon);

        if (member.roles.cache.has(config.staffRole.admin) ||
            member.roles.cache.has(config.staffRole.headstaff) ||
            member.roles.cache.has(config.staffRole.staff) ||
            member.roles.cache.has(config.staffRole.moderateur)) {
            return interaction.reply({ content: "Vous ne pouvez pas mute un membre qui possède le rôle du personnel.", ephemeral: true });
        }

        if (!convert || convert < 10000 || convert > 2419200000) { return interaction.reply({ content: 'Temps invalide ou le temps n\'est pas compris entre 10s et 27d.', ephemeral: true }); }
        const log = client.embed();
        log.setAuthor({ name: 'Mute d\'un utilisateur' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n > **Informations :**\nRaison du mute : \`${reason}\`\nTemps du mute : \`${time}\`\nDate : <t:${Date.parse(new Date) / 1000}:R>`);
        member.timeout(convert, reason).then(() => {
            const embed = client.embed()
            embed.setDescription(` ${user} a été mute ${time} ${reason === "Pas de raison donné" ? "" : `pour : \`${reason}\``}`)
            interaction.reply({ embeds: [embed] }).then(() => { logs.send({ embeds: [log] }); });
        })
    }
}