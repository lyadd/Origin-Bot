const ms = require('ms');

module.exports = {
    name: 'resetleader',
    description: 'Réinitialise le classement après un temps défini.',
    options: [
        {
            name: 'temps',
            type: 3,
            description: 'Durée avant réinitialisation (ex: 1d, 2d, 5d pour jours uniquement)',
            required: true,
        }
    ],
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission.", ephemeral: true }); }

        const time = args[0];
        if (!/^\d+d$/.test(time)) { return interaction.reply({ content: "\`❌\` Format du temps invalide. Utilisez uniquement des jours (ex: `1d`).", ephemeral: true }); }

        const deja = await db.get('resetTimer');
        if (deja) {
            const timeer = ms(deja - Date.now(), { long: true });
            return interaction.reply({ content: `\`❌\` Le timer est deja configurer pour : ${timeer}.`, ephemeral: true });
        }

        const duration = ms(time);
        if (!duration) { return interaction.reply({ content: "\`❌\` Format du temps invalide.", ephemeral: true }); }

        interaction.reply({ content: `\`✅\` Réinitialisation dans ${time}.`, ephemeral: false });
        db.set('resetTimer', Date.now() + duration);

        const slm = async () => {
            try {
                const members = client.guilds.cache.get(config.guildId).roles.cache.get(config.staffRole.moderateur).members;
                for (const [memberId] of members) { await db.set(`points_${memberId}`, 0) }

                const list = await db.get('users_list') || [];
                for (const userId of list) { await db.set(`points_${userId}`, 0); }
                db.set('resetTimer', Date.now() + duration);
                setTimeout(slm, duration);
            } catch (error) {
                console.error(error);
            }
        };
        setTimeout(slm, duration);
    }
};