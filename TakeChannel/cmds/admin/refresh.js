module.exports = {
    name: 'refresh',
    description: 'Réinitialise les points de tous les utilisateurs.',
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        if (interaction.channelId !== config.salon) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.salon}>.`, ephemeral: true }); }

        try {
            const members = client.guilds.cache.get(config.guildId).roles.cache.get(config.staffRole.moderateur).members;

            for (const [memberId, member] of members) {
                const key = `points_${memberId}`;
                await db.set(key, 0);
            }

            return interaction.reply({ content: `Les points de tout les utilisateurs ont été réinitialisés avec succès.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "`❌` Une erreur est survenue lors de la réinitialisation des points.", ephemeral: true });
        }
    }
};