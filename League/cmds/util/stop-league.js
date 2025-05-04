module.exports = {
    name: "stop-league",
    dm: false,
    description: "Arreter la League.",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.roleStaff)) return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });

        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({ content: "`❌` Aucune league en cours.", ephemeral: true });
        await interaction.reply({ content: 'Chargement...', ephemeral: true })

        const { team } = league;
        await Promise.all(team.map(async ({ author, player, mId, type }) => {
            const remove = async (id) => {
                try {
                    const
                        user = await interaction.guild.members.fetch(id),
                        role = interaction.guild.roles.cache.get(type?.role);
                    if (!user) return;
                    if (!role) { console.log(`${type?.name} Role ID invalide`); return; }
                    if (!user.roles.cache.has(type.role)) return;
                    await user.roles.remove(role)
                } catch (error) { console.error('Erreur :', error); }
            };
            await remove(author);
            await Promise.all(player.map(remove));
            if (mId) {
                const channels = client.channels.cache.filter(channel => channel.isTextBased());
                for (const [channelId, channel] of channels) {
                    try {
                        await (await channel.messages.fetch(mId)).delete();
                    } catch (error) { console.error('Erreur :', error); }
                }
            }
        }));

        if (league.inscription) {
            const channels = client.channels.cache.filter(channel => channel.isTextBased());
            for (const [channelId, channel] of channels) {
                try {
                    await (await channel.messages.fetch(league.inscription)).delete();
                } catch (error) {
                    if (error.code === 10008) {
                        continue;
                    }
                }
            }
        }
        await db.delete('leagueDetails');
        interaction.editReply({ content: "`✔` League stopper.", ephemeral: true });
    }
};