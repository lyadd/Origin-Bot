module.exports = {
    name: "start-inscription",
    dm: false,
    description: "Information inscription",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.roleStaff)) return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });

        const league = await db.get('leagueDetails');
        if (!league) return interaction.reply({ content: "`❌` Aucune league en cours.", ephemeral: true });

        const { inscription, time, } = league,
            convert = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                if (isNaN(hours) || isNaN(minutes)) return NaN;
                const date = new Date();
                date.setHours(hours, minutes, 0, 0);
                return Math.floor(date.getTime() / 1000)
            },
            joueur = convert(time.player),
            boost = convert(time.booster),
            contrib = convert(time.contributeur);
        if (inscription) return interaction.reply({ content: "`❌` Inscription déjà en cours.", ephemeral: true });
        if (isNaN(joueur) || isNaN(boost) || isNaN(contrib)) return interaction.reply({ content: "`❌` Erreur dans la conversion des heures d'ouverture. Vérifiez le format des heures.", ephemeral: true });
        interaction.deferReply();
        interaction.deleteReply();

        const message = await interaction.channel.send({
            content: null,
            embeds: [client.embed()
                .setTitle("Inscriptions Ouvertes")
                .setDescription("Les inscriptions vont être ouvertes bientôt. Voici les horaires d'ouverture pour chaque groupe:")
                .addFields(
                    { name: `Player : <t:${joueur}:R>`, value: ` ` },
                    { name: `Booster : <t:${boost}:R>`, value: ` ` },
                    { name: `Contributeur : <t:${contrib}:R>`, value: ` ` }
                )
                .setThumbnail('https://cdn.discordapp.com/attachments/1052370013652267080/1144775134306127963/96X96.png?ex=6687d8ac&is=6686872c&hm=177381ff611e78ad8435d5f362405cb1a2aa64994b43f39413154c6ec2242207&')
                .setImage('https://media.discordapp.net/attachments/1139551654857945292/1145322065092681758/Origin1.png?width=1193&height=671&ex=6687dbcb&is=66868a4b&hm=7aa2684d7a2a879222acd10a1cdaf27060a7ca9deade81b7abd2f4c82b114547&')]
        });
        league.inscription = message.id;
        await db.set('leagueDetails', league)
    }
};