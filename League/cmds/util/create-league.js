module.exports = {
    name: "create-league",
    dm: false,
    description: "Permet d'organiser une League.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'equipe',
            description: 'Nombre d\'équipe',
            required: true,
            type: 4
        },
        {
            name: 'joueurs',
            description: 'Nombre joueur par équipe',
            required: true,
            type: 4
        },
        {
            name: 'heure',
            description: 'Heure d\'ouverture (HH:MM)',
            required: true,
            type: 3
        },
        {
            name: 'player',
            description: 'Heure d\'ouverture player (HH:MM)',
            required: true,
            type: 3
        },
        {
            name: 'booster',
            description: 'Heure d\'ouverture booster (HH:MM)',
            required: true,
            type: 3
        },
        {
            name: 'contributeur',
            description: 'Heure d\'ouverture contributeur (HH:MM)',
            required: true,
            type: 3
        },
    ],
    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.roleStaff)) return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        if (await db.get('leagueDetails')) return interaction.reply({ content: "`❌` Une league est déjà crée.", ephemeral: true });
        const
            team = interaction.options.getInteger('equipe'),
            joueurs = interaction.options.getInteger('joueurs'),
            time = { player: interaction.options.getString('player'), booster: interaction.options.getString('booster'), contributeur: interaction.options.getString('contributeur') },
            author = interaction.user.id,
            heure = interaction.options.getString('heure');

        interaction.deferReply();
        interaction.deleteReply();

        const message = await interaction.channel.send({
            content: `@everyone`,
            embeds: [client.embed()
                .setDescription(
                    `# League Lancée
                
**Organisé par <@${author}>**

**Nombre d'équipe :** 0/${team}
**Nombre de joueurs par équipe :** ${joueurs}
**Heure d'ouverture :** ${heure}`)
                .addFields(
                    { name: 'Player', value: `**${time.player}**`, inline: true },
                    { name: 'Booster', value: `**${time.booster}**`, inline: true },
                    { name: 'Contributeur', value: `**${time.contributeur}**`, inline: true }
                )
                .setImage('https://media.discordapp.net/attachments/1139551654857945292/1145322065092681758/Origin1.png?width=1193&height=671&ex=6687dbcb&is=66868a4b&hm=7aa2684d7a2a879222acd10a1cdaf27060a7ca9deade81b7abd2f4c82b114547&')
                .setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')]
        });
        message.react('✅');
        await db.set('leagueDetails', { author, heure, time, size: { joueur: joueurs, team }, team: [], inscription: false, mId: message.id })
    }
};