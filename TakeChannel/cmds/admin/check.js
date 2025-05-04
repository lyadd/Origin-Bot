module.exports = {
    name: 'check',
    description: 'Affiche le nombre de salons pris par un utilisateur.',
    options: [
        {
            name: 'user',
            description: 'Utilisateur dont vous souhaitez vérifier le nombre de salons pris.',
            required: true,
            type: 6
        }
    ],
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        if (interaction.channelId !== config.salon) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.salon}>.`, ephemeral: true }); }

        const user = interaction.options.getUser('user');

        let points = await db.get(`points_${user.id}`) || 0;

        const embed = client.embed()
        embed.setTitle('Nombre de salons pris')
        embed.setDescription(`${user.username} a pris \`${points}\` salon(s).`)
        embed.setThumbnail(user.displayAvatarURL({ dynamic: true }))

        return interaction.reply({ embeds: [embed] });
    }
};