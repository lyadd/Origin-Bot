module.exports = async (client, db, config, interaction) => {
    if (!interaction.isButton()) return;

    const
        all = { freeroam: config.roles.freeroam, event: config.roles.event, annoucement: config.roles.annoucement },
        role = all[interaction.customId];
    if (role) {
        if (interaction.member.roles.cache.has(role)) {
            await interaction.member.roles.remove(role).catch(() => { })
            await interaction.reply({ content: `Le rôle <@&${role}> a été retiré.`, ephemeral: true }).catch(() => { })
        } else {
            await interaction.member.roles.add(role).catch(() => { })
            await interaction.reply({ content: `Le rôle <@&${role}> a été ajouté.`, ephemeral: true }).catch(() => { })
        }
    }
};