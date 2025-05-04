const ms = require('ms');

module.exports = {
    name: "contrib",
    dm: false,
    description: "Permet de configurer la commande soutiens.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'utilisateur',
            description: 'utilisateur',
            required: true,
            type: 6,
        },
        {
            name: 'temps',
            description: 'temps',
            required: true,
            type: 3,
        },
        {
            name: 'raison',
            description: 'raison',
            required: true,
            type: 3,
        },
    ],

    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.staffRole.admin)) {
            return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const
            user = interaction.options.getUser('utilisateur'),
            member = interaction.guild.members.cache.get(user.id),
            time = interaction.options.getString('temps'),
            raison = interaction.options.getString('raison'),
            convert = ms(time),
            salon = config.logs.contrib,
            logs = await client.channels.fetch(salon);


        const max = (delay) => {
            return new Promise(resolve => {
                if (delay > 2147483647) {
                    setTimeout(() => { max(delay - 2147483647).then(resolve); }, 2147483647);
                } else { setTimeout(resolve, delay); }
            });
        };

        member.roles.add(config.roles.contributeur).then(async () => {
            await max(convert);

            member.roles.remove(config.roles.contributeur).then(async () => {
                const log = client.embed();
                log.setAuthor({ name: 'Contributeur Fini' });
                log.setDescription(`> **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n> **Informations :**\nTemps : \`${time}\`\nRaison : \`${raison}\`\nDate de fin : <t:${Math.floor((Date.now() + convert) / 1000)}:R>`);
                logs.send({ embeds: [log] });
            });
        });

        const log = client.embed();
        log.setAuthor({ name: 'Contributeur Give' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${interaction.user.username}\`\nIdentifiant : \`${interaction.user.id}\`\n\n > **Cible :**\nNom d'utilisateur : \`${member.user.username}\`\nIdentifiant : \`${member.user.id}\`\n\n > **Informations :**\nTemps : \`${time}\`\nRaison : \`${raison}\`\nDate : <t:${Math.floor(Date.now() / 1000)}:R>`);
        interaction.reply({ content: `J'ai bien donné le rôle <@&${config.roles.contributeur}> à <@${member.user.id}> pendant \`${time}\``, ephemeral: true }).then(() => {
            logs.send({ embeds: [log] });
        });
    }
};