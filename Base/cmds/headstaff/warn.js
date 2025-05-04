module.exports = {
    name: 'warn',
    dm: false,
    description: "Permet de warn un utilisateur.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: 'user',
            required: true,
            type: 6
        },
        {
            name: 'raison',
            description: 'raison',
            required: true,
            type: 3
        }
    ],

    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        
        const
            user = interaction.options.getUser('user'),
            raison = interaction.options.getString('raison');

        if (user.id === interaction.user.id) return interaction.reply({ content: "\`❌\` *Vous ne pouvez pas vous warn !*", ephemeral: true })
        const avertissement = db.get(`warn_${user.id}`) || [];

        avertissement.push({ moderator: interaction.user.id, reason: raison, timestamp: Date.now() });
        db.set(`warn_${user.id}`, avertissement);

        const embed = client.embed()
        embed.setDescription(`L'utilisateur <@${user.id}> a été warn pour \`${raison}\`.`)
        interaction.reply({ embeds: [embed] })
    }
};