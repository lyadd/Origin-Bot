const { AuditLogEvent } = require('discord.js');

module.exports = async (client, db, config, oldMember, newMember) => {
    const
        salon = config.logs.contrib,
        logs = await client.channels.fetch(salon),
        add = newMember.roles.cache.has(config.roles.contributeur) && !oldMember.roles.cache.has(config.roles.contributeur),
        remove = !newMember.roles.cache.has(config.roles.contributeur) && oldMember.roles.cache.has(config.roles.contributeur);
    if (oldMember.id === client.user.id || newMember.id === client.user.id) return;

    if (add || remove) {
        const
            fetch = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate }),
            log = fetch.entries.first();
        if (!log) return;
        const { executor } = log;

        if (executor.id === client.user.id) return;

        if (add) {
            const embed = client.embed();
            embed.setAuthor({ name: 'Alert Give' });
            embed.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${executor.username}\`\nIdentifiant : \`${executor.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${newMember.user.username}\`\nIdentifiant : \`${newMember.user.id}\`\n\n > **Informations :**\nRôle ajouté : <@&${config.roles.contributeur}>\nDate : <t:${Math.floor(Date.now() / 1000)}:R>`);
            logs.send({ content: `<@${config.utilisateur.drakee1337}>`, embeds: [embed] });
        }

        if (remove) {
            const embed = client.embed();
            embed.setAuthor({ name: 'Alert Remove' });
            embed.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${executor.username}\`\nIdentifiant : \`${executor.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${newMember.user.username}\`\nIdentifiant : \`${newMember.user.id}\`\n\n > **Informations :**\nRôle retiré : <@&${config.roles.contributeur}>\nDate : <t:${Math.floor(Date.now() / 1000)}:R>`);
            logs.send({ content: `<@${config.utilisateur.drakee1337}>`, embeds: [embed] });
        }
    }
}