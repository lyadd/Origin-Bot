const { AuditLogEvent } = require('discord.js');

module.exports = async (client, db, config, member) => {
    const
        salon = config.logs.kick,
        logs = await client.channels.fetch(salon),
        fetch = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 }),
        kick = fetch.entries.first(),
        { executor, target, reason, createdTimestamp } = kick

    if (executor.id === client.user.id) return;
    const log = client.embed();

    let count = db.get(`kick_${executor.id}`) || 0;

    const user = await member.guild.members.fetch(executor.id);

    if (count >= config.limit.kick) {
        await user.roles.set([], `Taux de kick atteint`);
        return logs.send(`\`⚠️\` <@${executor.id}> | \`${executor.id}\` a atteint la limite de \`${config.limit.kick}\` kick par heure. Tout ces rôles ont bien été retirée.`);
    }
    count++;
    db.set(`kick_${executor.id}`, count);

    log.setAuthor({ name: 'Kick d\'un utilisateur' });
    log.setDescription(
        `> **Exécuteur :**\nNom d'utilisateur : \`${executor.username}\`\nIdentifiant : \`${executor.id}\`\n` +
        `\n > **Cible :**\nNom d'utilisateur : \`${target.username}\`\nIdentifiant : \`${target.id}\`\n` +
        `\n > **Informations :**\nRaison du kick : \`${reason || 'Pas de raison donnée'}\`\n` +
        `Count : \`${count}/${config.limit.kick}\`\n` +
        `Date : <t:${Math.floor(createdTimestamp / 1000)}:R>\n`
    );
    logs.send({ embeds: [log] });
    setTimeout(() => { db.set(`kick_${executor.id}`, count - 1); }, 3600 * 1000);
};