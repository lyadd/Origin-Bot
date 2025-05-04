module.exports = async (client, db, config, interaction) => {
    const id = interaction.customId?.split('_')?.[1];
    if (id) {
        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({
            content: "`❌` Aucune league en cours.",
            ephemeral: true
        });
        const { author, heure, inscription, size, team, time, mId } = league, teamAccepted = (team ?? []).filter(e => e.accepted);
        if (!inscription) return interaction.reply({ content: "`❌` L'inscription n'a pas encore commencer.", ephemeral: true });
        if (interaction.customId.startsWith("accept_")) {
            if (!interaction.member.roles.cache.has(config.roleStaff)) return interaction.reply({ content: "`❌` Vous n'avez pas la permission de cliquer sur ce button.", ephemeral: true });

            const find = (team ?? []).find(({ author }) => author == id);
            if (!find) return interaction.reply({ content: "`❌` Une erreur est survenue.", ephemeral: true });

            if ((teamAccepted.length ?? 1) >= size.team) return interaction.reply({ content: "`❌` Limite de team atteint.", ephemeral: true });
            if (find.player.length + 1 !== size.joueur) return interaction.reply({ content: "`❌` Team pas rempli.", ephemeral: true });

            const key = (Object.keys(config.team)).filter(key => !((team ?? []).map(item => item.type?.name)).includes(key));
            if (key.length > 0) {
                interaction.deferReply();
                interaction.deleteReply();
                const
                    name = key[Math.floor(Math.random() * key.length)],
                    type = { name, role: config.team[name] },
                    add = async (id) => {
                        try {
                            const
                                user = await interaction.guild.members.fetch(id),
                                role = interaction.guild.roles.cache.get(type.role);
                            if (!user) return;
                            if (!role) { console.log(`${type.name} role id invalide`); return; }
                            if (user.roles.cache.has(type.role)) return;
                            await user.roles.add(role)
                        } catch (error) { console.error('Erreur lors de l\'ajout du rôle:', error); }
                    };
                find.type = type;
                find.accepted = true;
                await add(find.author);
                await Promise.all(find.player.map(add));
                await db.set('leagueDetails', {
                    ...await db.get('leagueDetails'),
                    team: (team ?? []).map(t => t.author === interaction.user.id ? find : t)
                });
                if (find.mId) {
                    const channels = client.channels.cache.filter(channel => channel.isTextBased());
                    for (const [channelId, channel] of channels) {
                        try {
                            await (await channel.messages.fetch(find.mId)).edit({
                                components: [],
                                content: null,
                                embeds: [client.embed()
                                    .setDescription(
                                        `# ${type.name} ✅
    
**Crée par <@${id}>**
    
**Nombre de joueur** : \`${find.player.length + 1 ?? 0}/${size.joueur}\`
**Joueur(s)** : <@${id}>, ${find.player.map(e => `<@${e}>`).join(', ')}
    
                `)
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
                            });
                        } catch (error) {
                            if (error.code === 10008) {
                                continue;
                            }
                        }
                    }
                }
                if (mId) {
                    const channels = client.channels.cache.filter(channel => channel.isTextBased());
                    for (const [channelId, channel] of channels) {
                        try {
                            await (await channel.messages.fetch(mId)).edit({
                                content: `@everyone`,
                                embeds: [client.embed()
                                    .setDescription(
                                        `# League Lancée
                                    
**Organisé par <@${author}>**
                    
**Nombre d'équipe:** ${teamAccepted.length ? teamAccepted.length + 1 : 1}/${size.team}
**Nombre de joueurs par équipe:** ${size.joueur}
**Heure d'ouverture:** ${heure}`)
                                    .addFields(
                                        { name: 'Player', value: `**${time.player}**`, inline: true },
                                        { name: 'Booster', value: `**${time.booster}**`, inline: true },
                                        { name: 'Contributeur', value: `**${time.contributeur}**`, inline: true }
                                    )
                                    .setImage('https://media.discordapp.net/attachments/1139551654857945292/1145322065092681758/Origin1.png?width=1193&height=671&ex=6687dbcb&is=66868a4b&hm=7aa2684d7a2a879222acd10a1cdaf27060a7ca9deade81b7abd2f4c82b114547&')
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
                            });
                        } catch (error) {
                            if (error.code === 10008) {
                                continue;
                            }
                        }
                    }
                }
            } else return interaction.reply({ content: "`❌` Une erreur est survenue.", ephemeral: true })
        }
        if (interaction.customId.startsWith("refuse_")) {
            if (!interaction.member.roles.cache.has(config.roleStaff)) return interaction.reply({ content: "`❌` Vous n'avez pas la permission de cliquer sur ce button.", ephemeral: true });

            const find = (team ?? []).find(({ author }) => author == id);
            if (!find) return interaction.reply({ content: "`❌` Une erreur est survenue.", ephemeral: true });

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
        }
        if (interaction.customId.startsWith("acceptinvite_")) {
            const find = (team ?? []).find(({ author }) => author == id);
            if (!find) return interaction.reply({ content: "`❌` Une erreur est survenue.", ephemeral: true });
            if (find.player.length + 1 >= size.joueur) return interaction.reply({ content: "`❌` La team a dépasser la limite de joueur.", ephemeral: true });
            if (find.player.includes(interaction.user.id)) return interaction.reply({ content: "`❌` Vous êtes déjà dans la team.", ephemeral: true });
            find.player.push(interaction.user.id);

            await db.set('leagueDetails', {
                ...await db.get('leagueDetails'),
                team: (team ?? []).map(t => t.author === interaction.user.id ? find : t)
            });

            try {
                const auser = client.users.cache.get(id);
                auser.send({ content: `✔ **${interaction.user.username}**, a accepter de rejoindre votre team !` });

            } catch (error) { console.error('Erreur :', error); }

            interaction.deferReply();
            interaction.deleteReply();
            interaction.message.delete()

            if (find.mId) {
                const channels = client.channels.cache.filter(channel => channel.isTextBased());
                for (const [channelId, channel] of channels) {
                    try {
                        await (await channel.messages.fetch(find.mId)).edit({
                            components: [client.row()
                                .addComponents(client.button().setCustomId(`accept_${id}`).setStyle(3).setLabel("Accepter la team").setEmoji("✔"))
                                .addComponents(client.button().setCustomId(`refuse_${id}`).setStyle(4).setLabel("Refuser la team").setEmoji("❌"))],
                            content: null,
                            embeds: [client.embed()
                                .setDescription(
                                    `# Team Crée 🕐

**Crée par <@${id}>**

**Nombre de joueur** : \`${find.player.length + 1 ?? 0}/${size.joueur}\`
**Joueur(s)** : <@${id}>, ${find.player.map(e => `<@${e}>`).join(', ')}

            `).setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
                        });
                    } catch (error) { console.error('Erreur :', error); }
                }
            }
        }

        if (interaction.customId.startsWith("refuseinvite_")) {
            try {
                const auser = client.users.cache.get(id);
                auser.send({ content: `❌ **${interaction.user.username}**, a refuser de rejoindre votre team !` });
                
            } catch (error) { console.error('Erreur :', error); }

            interaction.deferReply();
            interaction.deleteReply();
            interaction.message.delete()
        }
    }
};