module.exports = {
    name: 'bypass',
    description: 'Permet de bypass la verif de 1 mois (Compte discord).',
    options: [
        {
            name: 'id',
            description: 'ID de l\'utilisateur.',
            required: true,
            type: 3
        }
    ],
    go: async (client, db, config, interaction, args) => {
        if (!interaction.member.roles.cache.has(config.staffRole.admin)) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const id = interaction.options.getString('id');
        let bypass = await db.get('bypass_') || [];

        if (!bypass.includes(id)) {
            bypass.push(id);
            await db.set('bypass_', bypass);
            return interaction.reply({ content: `\`✅\` L'utilisateur avec l'ID \`${id}\` a été ajouté à la liste de bypass.`, ephemeral: true });
        } else { return interaction.reply({ content: `\`⚠️\` L'utilisateur avec l'ID \`${id}\` est déjà dans la liste de bypass.`, ephemeral: true }); }
    }
};