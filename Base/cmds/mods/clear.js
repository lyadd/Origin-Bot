module.exports = {
    name: 'clear',
    dm: false,
    description: 'Permet de supprimer des message dans les salons.',
    type: "CHAT_INPUT",
    options: [
        {
            name: 'amount',
            description: 'amount',
            required: true,
            type: "INTEGER",
        },
    ],
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const amount = interaction.options.getInteger('amount')
        if (isNaN(amount)) { return interaction.reply({ content: 'Veuillez spécifier une valeur entre 1 - 100 !', ephequmeral: true }) }
        if (parseInt(amount) > 100) { return interaction.reply({ content: 'Je peux supprimé seulement 100 message!', ephemeral: true }) }
        else {
            try {
                let { size } = await interaction.channel.bulkDelete(amount)
                await interaction.reply({ content: `J'ai bien supprimé ${size} messages`, ephemeral: true })
            } catch { interaction.reply({ content: `Je ne peux pas supprimé les message qui date de plus de 14 jours.`, ephemeral: true }) }
        }
    }
}   