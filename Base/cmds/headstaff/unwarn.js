module.exports = {
    name: 'unwarn',
    dm: false,
    description: "Permet de retirer un warn d'un utilisateur.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'user',
            description: 'Utilisateur',
            required: true,
            type: 6
        },
        {
            name: 'numero',
            description: 'Numéro du warn',
            required: true,
            type: 4
        }
    ],

    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }
        
        const
            user = interaction.options.getUser('user'),
            numero = interaction.options.getInteger('numero'),
            avertissements = db.get(`warn_${user.id}`) || [];

        if (avertissements.length === 0) { return interaction.reply({ content: `L'utilisateur <@${user.id}> n'a aucun avertissement.`, ephemeral: true }); }
        if (numero < 1 || numero > avertissements.length) { return interaction.reply({ content: `Veuillez fournir un chiffre valide correspondant à l'avertissement que vous souhaitez retirer.`, ephemeral: true }); }

        avertissements.splice(numero - 1, 1);
        db.set(`warn_${user.id}`, avertissements);
        interaction.reply({ content: `L'avertissement numéro ${numero} de l'utilisateur <@${user.id}> a été retiré avec succès.`, ephemeral: true });
    }
}