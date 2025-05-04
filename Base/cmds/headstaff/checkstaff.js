
module.exports = {
    name: 'checkstaff',
    dm: false,
    description: "Affiche la liste du personnel du serveur.",
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            admin = interaction.guild.roles.cache.get(config.staffRole.admin),
            head = interaction.guild.roles.cache.get(config.staffRole.headstaff),
            staff = interaction.guild.roles.cache.get(config.staffRole.staff),
            mods = interaction.guild.roles.cache.get(config.staffRole.moderateur);

        if (!admin || !head || !staff || !mods) { return interaction.reply({ content: "\`❌\` Un ou plusieurs rôles spécifiés sont introuvables.", ephemeral: true }); }

        const
            adminM = admin.members.map(member => `<@${member.user.id}>`).join('\n') || 'Aucun',
            headM = head.members.map(member => `<@${member.user.id}>`).join('\n') || 'Aucun',
            staffM = staff.members.map(member => `<@${member.user.id}>`).join('\n') || 'Aucun',
            modM = mods.members.map(member => `<@${member.user.id}>`).join('\n') || 'Aucun',
            embed = client.embed()
        embed.setTitle("Liste du Personnel")
        embed.addFields(
            { name: 'Owner', value: `${adminM}` },
            { name: 'Head Staff', value: `${headM}` },
            { name: 'Staff', value: `${staffM}` },
            { name: 'Modérateurs', value: `${modM}` },
        )
        await interaction.reply({ embeds: [embed] });
    }
}