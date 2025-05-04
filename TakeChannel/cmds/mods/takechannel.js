module.exports = {
    name: 'takechannel',
    description: 'Permet de prendre un salon ticket.',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à mentionner.',
            required: false,
            type: 6
        }
    ],
    go: async (client, db, config, interaction, args) => {
        if (!interaction.member.roles.cache.has(config.staffRole.moderateur)) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        if (!config.category.includes(interaction.channel.parentId)) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans la catégorie **<#${config.category}>**.`, ephemeral: true }); }

        const user = interaction.options.getUser('user') || interaction.user;

        if (interaction.channel.name.startsWith('take-')) {
            const owner = interaction.channel.name.replace('take-', '');
            return interaction.reply({ content: `\`❌\` Ce salon a déjà été pris par \`${owner}\`.`, ephemeral: true });
        }

        try {
            await interaction.channel.setName(`take-${user.username}`);

            let points = await db.get(`points_${user.id}`) || 0;
            await db.set(`points_${user.id}`, points + 1);

            let usersList = await db.get('users_list') || [];
            if (!usersList.includes(user.id)) {
                usersList.push(user.id);
                await db.set('users_list', usersList);
            }

            return interaction.reply({ content: `\`✅\` Le salon a été renommé en \`take-${user.username}\`.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "\`❌\` Une erreur est survenue lors du renommage du salon ou de l'ajout des points.", ephemeral: true });
        }
    }
};