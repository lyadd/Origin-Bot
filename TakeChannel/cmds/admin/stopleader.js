module.exports = {
    name: 'stopleader',
    description: 'Arrête la réinitialisation du classement.',
    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const reset = db.get('resetTimer');
        if (reset) {
            const timeLeft = reset - Date.now();
            clearTimeout(timeLeft);

            db.delete('resetTimer');
            interaction.reply({ content: "\`✅\` La réinitialisation du classement a été annulée.", ephemeral: true });
        } else { interaction.reply({ content: "\`❌\` Aucune réinitialisation en cours à annuler.", ephemeral: true }); }
    }
};