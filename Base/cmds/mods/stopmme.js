module.exports = {
    name: "stopmme",
    dm: false,
    description: "Permet de stoper une MME.",
    type: "CHAT_INPUT",

    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        if (!interaction.guild.roles.cache.get(config.roles.mme)) return interaction.reply({ content: "Le rôle spécifié n'existe pas.", ephemeral: true });
        const all = interaction.guild.members.cache.filter(member => member.roles.cache.has(interaction.guild.roles.cache.get(config.roles.mme).id));
        if (all.size === 0) { return interaction.reply({ content: `\`🔍\` Aucun membre n'a le rôle <@&${config.roles.mme}>.`, ephemeral: true }); }
        interaction.reply({ content: `Retrais des rôles en cours...`, ephemeral: true });
        await Promise.all(interaction.guild.members.cache.filter(member => member.roles.cache.has(interaction.guild.roles.cache.get(config.roles.mme).id)).map(member => member.roles.remove(interaction.guild.roles.cache.get(config.roles.mme))));
        interaction.editReply({ content: `\`✅\` Le rôle <@&${interaction.guild.roles.cache.get(config.roles.mme).id}> a été retiré de tous les membres qui l'avaient.`, ephemeral: true });
    }
}