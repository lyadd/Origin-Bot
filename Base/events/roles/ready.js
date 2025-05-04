module.exports = async (client, db, config) => {
    client.guilds.cache.forEach(async g => {
        const edit_salon = g.channels.cache.get(config.salon.roles);
        if (edit_salon) await edit(g, edit_salon);
    });

    async function edit(guild, channel) {
        const row = client.row().addComponents(
            client.button().setCustomId('freeroam').setStyle(2).setLabel('🏆・Freeroam'),
            client.button().setCustomId('event').setStyle(2).setLabel('🎉・Notif Events'),
            client.button().setCustomId('annoucement').setStyle(2).setLabel('🏆・Notif Annonces'),
        )
        const embed = client.embed();
        embed.setDescription(`
    🇫🇷 **(FR)** ・ Bienvenue sur **Origin** ! Nous sommes heureux de vous accueillir. 
    Pour commencer, vous pouvez choisir un rôle en cliquant sur le bouton correspondant au mode de jeu de votre choix où vous retrouverez des informations sur celui-ci. 
    Si vous avez besoin d’aide, n’hésitez pas à nous envoyer un message au bot support de Origin <@1245131323660566608>.

    🇬🇧 **(ENG)** ・ Welcome to **Origin** ! We are happy to welcome you. 
    To start, you can choose a role by clicking on the button corresponding to the game mode of your choice where you will find information about it.
    if you need help, feel free to send us a message to Origin support bot <@1245131323660566608>.
`);
        const
            messages = await channel.messages.fetch({ limit: 10 }),
            msg = messages.find(msg => msg.author.id === client.user.id);

        if (msg) { await msg.edit({ embeds: [embed], components: [row] }); }
        else { await channel.send({ embeds: [embed], components: [row] }); }
    }
};