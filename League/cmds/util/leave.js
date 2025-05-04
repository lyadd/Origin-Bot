module.exports = {
    name: "leave",
    dm: false,
    description: "Permet de quitter une team.",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction) => {
        if (interaction.channelId !== config.cmd.teamcreate) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.cmd.teamcreate}>`, ephemeral: true }); }

        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({ content: "`❌` Aucune league en cours.", ephemeral: true });
        const { inscription, size, team } = league;
        if (!inscription) return interaction.reply({ content: "`❌` L'inscription n'a pas encore commencer.", ephemeral: true });

        const find = (team ?? []).find(({ author, player }) => (author == interaction.user.id || player.includes(interaction.user.id)));

        if (!find) return interaction.reply({ content: "`❌` Vous n'êtes pas dans une team.", ephemeral: true });
        if (find.accepted) return interaction.reply({ content: "`❌` La team à été verifier vous ne pouvez pas faire sa.", ephemeral: true });
        await interaction.reply({ content: 'Chargement...', ephemeral: true })

        if (find.author == interaction.user.id) {
            await db.set('leagueDetails', {
                ...await db.get('leagueDetails'),
                team: (team ?? []).filter(t => t.author !== find.author)
            });
            if (find.mId) {
                const channels = client.channels.cache.filter(channel => channel.isTextBased());
                for (const [channelId, channel] of channels) {
                    try {
                        await (await channel.messages.fetch(find.mId)).delete();
                    } catch (error) { console.error('Erreur :', error); }
                }
            }

            interaction.editReply({ content: `✅ Vous avez supprimer votre team.`, ephemeral: true });
        } else {
            const index = find.player.indexOf(interaction.user.id);
            if (index !== -1) { find.player.splice(index, 1) }
            await db.set('leagueDetails', {
                ...await db.get('leagueDetails'),
                team: (team ?? []).map(t => t.author === find.author ? find : t)
            });
            if (find.mId) {
                const channels = client.channels.cache.filter(channel => channel.isTextBased());
                for (const [channelId, channel] of channels) {
                    try {
                        await (await channel.messages.fetch(find.mId)).edit({
                            components: [client.row()
                                .addComponents(client.button().setCustomId(`accept_${find.author}`).setStyle(3).setLabel("Accepter la team").setEmoji("✔"))
                                .addComponents(client.button().setCustomId(`refuse_${find.author}`).setStyle(4).setLabel("Refuser la team").setEmoji("❌"))],
                            content: null,
                            embeds: [client.embed()
                                .setDescription(
                                    `# Team Crée 🕐

**Crée par <@${find.author}>**

**Nombre de joueur** : \`${find.player.length + 1 ?? 0}/${size.joueur}\`
**Joueur(s)** : <@${find.author}>, ${find.player.map(e => `<@${e}>`).join(', ')}

            `).setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
                        });
                    } catch (error) { console.error('Erreur :', error); }
                }
            }
            interaction.editReply({ content: `✅ Vous avez quitter votre team.`, ephemeral: true });
        }
    }
};