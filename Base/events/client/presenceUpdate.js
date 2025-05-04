module.exports = (client, db, config, oldPresence, newPresence) => {
    const
        guild = client.guilds.cache.get(config.guildID),
        member = newPresence.member,
        roleID = db.get(`role_${guild.id}`),
        role = guild.roles.cache.get(roleID),
        statut = db.get(`statut_${guild.id}`)?.trim();

    if ((!role && !statut) || (!role || !statut)) return;
    if (newPresence?.activities[0] && newPresence?.activities[0]?.state?.toLowerCase().includes(statut.toLowerCase())) {
        if (!member.roles.cache.has(role.id)) { member.roles.add(role); }
    } else { if (member.roles.cache.has(role.id)) { member.roles.remove(role); } }
}