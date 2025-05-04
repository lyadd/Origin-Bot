let nop = null;

module.exports = {
    name: "mme",
    dm: false,
    description: "Permet d'organiser un MME.",
    type: "CHAT_INPUT",
    options: [
        {
            name: 'objectif',
            description: 'Objectif de points',
            required: true,
            type: 3
        },
        {
            name: '10-kill',
            description: '10 kill',
            required: true,
            type: 3,
        },
        {
            name: '20-kill',
            description: '20 kill',
            required: true,
            type: 3,
        },
        {
            name: '30-kill',
            description: '30 kill',
            required: true,
            type: 3,
        },
        {
            name: '40-kill',
            description: '40 kill',
            required: true,
            type: 3,
        },
        {
            name: 'joueurs',
            description: 'Vocal Joueurs',
            required: true,
            type: 3
        },
        {
            name: 'contributeur',
            description: 'Vocal Contributeur',
            required: true,
            type: 3
        },
        {
            name: 'booster',
            description: 'Vocal Booster',
            required: true,
            type: 3
        },
        {
            name: 'vocal',
            description: 'Salon vocal',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'Event',
                    value: 'Event'
                },
            ],
        },
        {
            name: 'co-org',
            description: 'Co-Organisateur',
            required: false,
            type: 6
        },
    ],
    go: async (client, db, config, interaction) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            objectif = interaction.options.getString('objectif'),
            dix = interaction.options.getString('10-kill'),
            vingt = interaction.options.getString('20-kill'),
            trente = interaction.options.getString('30-kill'),
            quarante = interaction.options.getString('40-kill'),
            vocal = interaction.options.getString('vocal'),
            joueurs = interaction.options.getString('joueurs'),
            contributeur = interaction.options.getString('contributeur'),
            booster = interaction.options.getString('booster'),
            org = interaction.options.getUser('co-org');

        if (isNaN(objectif) || objectif < 500 || objectif > 1000) { return interaction.reply({ content: "\`❌\` Veuillez mettre un objectif entre 500 et 1000.", ephemeral: true }); }

        const embed = client.embed();
        embed.setDescription(`# Mode de jeu : MME\n\n**Organiser par <@${interaction.user.id}>**${org ? `\n**Co-Organisateur : ${org}**` : ''}\n\nObjectif de points : **${objectif}**\nSalon Vocal : **${vocal}**\n\n- **Rewards :**\n - 10 Kill : **${dix}**\n - 20 Kill : **${vingt}**\n - 30 Kill : **${trente}**\n - 30 Kill : **GUS**\n - 40 Kill : **${quarante}, Radar ennemi**`);
        embed.addFields(
            { name: 'Joueurs', value: `**${joueurs}**`, inline: true },
            { name: 'Contributeur', value: `**${contributeur}**`, inline: true },
            { name: 'Booster & Soutien', value: `**${booster}**`, inline: true },
        );
        embed.setImage('https://cdn.discordapp.com/attachments/1171543359400190038/1336682948791111691/MMe-Origin2.png?ex=67a4b281&is=67a36101&hm=ad594119c6992f39bca026339dfbe7024c2d39bb0cf8ceb4c3fc85c79400b4dd&');
        embed.setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1278407388289958020/96X96.png?ex=66d0b129&is=66cf5fa9&hm=f71b3e3a7f863b69566493e97e38975115170754654c9a9c42bf6885a015d864&');
        embed.setFooter({ text: `Réagis pour participer : ✅` });
        interaction.deferReply();
        interaction.deleteReply();
        if (nop) {
            nop.stop();
            nop = null;
        }
        const message = await interaction.channel.send({ content: `@Notif Events`, embeds: [embed] });
        await message.react('✅');
        const react = message.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === '✅' && !user.bot, dispose: true });

        react.on('collect', async (reaction, user) => {
            const member = await reaction.message.guild.members.fetch(user.id);
            if (member) {
                const role = reaction.message.guild.roles.cache.get(config.roles.mme);
                if (role) { await member.roles.add(role); }
            }
        });
        nop = react;
    }
};