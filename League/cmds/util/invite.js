module.exports = {
    name: "invite",
    dm: false,
    description: "Permet d'inviter quelqu'un dans une team.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            description: "La personne visée",
            type: 6,
            required: true,
        },
    ],
    go: async (client, db, config, interaction) => {
        if (interaction.channelId !== config.cmd.teamcreate) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.cmd.teamcreate}>`, ephemeral: true }); }

        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({ content: "`❌` Aucune league en cours.", ephemeral: true });

        const { inscription, size, team } = league;
        if (!inscription) return interaction.reply({ content: "`❌` L'inscription n'a pas encore commencer.", ephemeral: true });

        const find = (team ?? []).find(({ author }) => author == interaction.user.id);
        if (!find) return interaction.reply({ content: "`❌` Vous n'avez pas de team.", ephemeral: true });
        if (find.accepted) return interaction.reply({ content: "`❌` La team à été verifier vous ne pouvez pas faire sa.", ephemeral: true });
        if (find.player.length + 1 >= size.joueur) return interaction.reply({ content: "`❌` Vous avez dépasser la limite de joueur.", ephemeral: true });

        const user = interaction.options.getUser("user");
        if (find.player.includes(user.id)) return interaction.reply({ content: "`❌` **" + user.tag + "** est déjà dans la team.", ephemeral: true });

        try {
            const auser = client.users.cache.get(find.author);
            await user.send({
                content: `<@${user.id}>, ${auser?.username ?? `<@${find.author}>`} vous invite à rejoindre sa team !`,
                components: [client.row()
                    .addComponents(client.button().setCustomId(`acceptinvite_${find.author}`).setStyle(3).setLabel("Accepter l'invitation").setEmoji("✔"))
                    .addComponents(client.button().setCustomId(`refuseinvite_${find.author}`).setStyle(4).setLabel("Refuser l'invitation").setEmoji("❌"))],
            });
            return interaction.reply({ content: `\`✅\` Le joueur <@${user.id}> a reçu votre invitation.`, ephemeral: true });
        } catch (error) { if (error.code === 50007) { return interaction.reply({ content: `\`❌\` Le joueur <@${user.id}> n'a pas reçu votre invitation. **(MP Bloqué)**`, ephemeral: true }); } }
    }
};