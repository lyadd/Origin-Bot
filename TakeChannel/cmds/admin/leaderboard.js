const ms = require('ms');

module.exports = {
    name: 'leaderboard',
    description: 'Affiche le classement des utilisateurs par points.',
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff))) {
            return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }
        if (interaction.channelId !== config.salon) {
            return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.salon}>.`, ephemeral: true });
        }

        try {
            const members = client.guilds.cache.get(config.guildId).roles.cache.get(config.staffRole.moderateur).members;
            const leaderboard = [];

            for (const [memberId, member] of members) {
                let points = await db.get(`points_${memberId}`);
                if (points === null) {
                    points = 0;
                    await db.set(`points_${memberId}`, points);
                }
                leaderboard.push({ user: member.user, points });
            }

            leaderboard.sort((a, b) => b.points - a.points);

            const reset = db.get('resetTimer');
            let text = "Aucun timer configuré.";

            if (reset) {
                const nop = reset - Date.now();
                if (nop > 0) { text = `Réinitialisation dans ${ms(nop, { long: true })}`; }
                else { text = "Le timer de réinitialisation a expiré."; }
            }

            const size = 10;
            const total = Math.ceil(leaderboard.length / size);
            let p1 = 0;

            const slm = (page) => {
                const start = page * size;
                const end = start + size;
                const la = leaderboard.slice(start, end);

                const embed = client.embed();
                embed.setAuthor({ name: '🏆 Classement des utilisateurs' });
                embed.setDescription(la.map((entry, index) => `**${start + index + 1}. <@${entry.user.id}> : \`${entry.points}\`**`).join('\n'));
                embed.setFooter({ text: text });
                return embed;
            };

            const row = client.row()
                .addComponents(
                    client.button().setCustomId('previous').setLabel('◀').setStyle(2).setDisabled(p1 === 0),
                    client.button().setCustomId('next').setLabel('▶').setStyle(2).setDisabled(p1 === total - 1));

            const embed = slm(p1);

            const msg = await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 120000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'previous' && p1 > 0) { p1--; }
                else if (i.customId === 'next' && p1 < total - 1) { p1++; }

                const newEmbed = slm(p1);
                row.components[0].setDisabled(p1 === 0);
                row.components[1].setDisabled(p1 === total - 1);
                await i.update({ embeds: [newEmbed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach((button) => button.setDisabled(true));
                msg.edit({ components: [row] });
            });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "`❌` Une erreur est survenue lors de la récupération du classement.", ephemeral: true });
        }
    }
};