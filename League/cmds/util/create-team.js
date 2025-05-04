module.exports = {
    name: "create-team",
    dm: false,
    description: "Permet de crée une team.",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction) => {
        if (interaction.channelId !== config.cmd.teamcreate) { return await interaction.reply({ content: `Vous devez exécuter cette commande dans le salon <#${config.cmd.teamcreate}>`, ephemeral: true }); }

        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({ content: "`❌` Aucune league en cours.", ephemeral: true });

        const { inscription, size, team } = league;
        if (!inscription) return interaction.reply({ content: "`❌` L'inscription n'a pas encore commencer.", ephemeral: true });
        if ((team ?? []).find(({ author, player }) => author == interaction.user.id || player.includes(interaction.user.id))) return interaction.reply({ content: "`❌` Vous êtes déjà dans une team.", ephemeral: true });

        interaction.deferReply();
        interaction.deleteReply();

        const message = await interaction.channel.send({
            components: [client.row()
                .addComponents(client.button().setCustomId(`accept_${interaction.user.id}`).setStyle(3).setLabel("Accepter la team").setEmoji("✔"))
                .addComponents(client.button().setCustomId(`refuse_${interaction.user.id}`).setStyle(4).setLabel("Refuser la team").setEmoji("❌"))],
            content: null,
            embeds: [client.embed()
                .setDescription(
                    `# Team Crée 🕐
                
**Crée par <@${interaction.user.id}>**

**Nombre de joueur** : \`1/${size.joueur}\`
**Joueur(s)** : <@${interaction.user.id}>

`).setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
        });
        const rteam = team ?? [];
        rteam.push({ author: interaction.user.id, player: [], accepted: false, mId: message.id });
        league.team = rteam;
        await db.set('leagueDetails', league)
    }
};