const { AuditLogEvent } = require('discord.js');

module.exports = async (client, db, config, user) => {
    const
        salon = config.logs.ban,
        logs = await client.channels.fetch(salon),
        fetch = await user.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 }),
        ban = fetch.entries.first(),
        { executor, target, reason, createdTimestamp } = ban

    if (executor.id === client.user.id) return;
    const log = client.embed();

    let count = db.get(`bans_${executor.id}`) || 0;

    const member = await user.guild.members.fetch(executor.id);

    if (count >= config.limit.ban) {
        await member.roles.set([], `Taux de bannissement atteint`);
        return logs.send(`\`⚠️\` <@${executor.id}> | \`${executor.id}\` a atteint la limite de \`${config.limit.ban}\` bannissements par heure. Tout ces rôles ont bien été retirée.`);
    }
    count++;
    db.set(`bans_${executor.id}`, count);

    log.setAuthor({ name: 'Bannissement d\'un utilisateur' });
    log.setDescription(
        `> **Exécuteur :**\nNom d'utilisateur : \`${executor.username}\`\nIdentifiant : \`${executor.id}\`\n` +
        `\n > **Cible :**\nNom d'utilisateur : \`${target.username}\`\nIdentifiant : \`${target.id}\`\n` +
        `\n > **Informations :**\nRaison du ban : \`${reason || 'Pas de raison donnée'}\`\n` +
        `Count : \`${count}/${config.limit.ban}\`\n` +
        `Date : <t:${Math.floor(createdTimestamp / 1000)}:R>\n`
    );
    logs.send({ embeds: [log] });
    setTimeout(() => { db.set(`bans_${executor.id}`, count - 1); }, 3600 * 1000);
};