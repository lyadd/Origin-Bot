module.exports = async (client, db, config, member) => {
    const
        join = member.user.createdAt,
        date = new Date(),
        time = date.getTime() - join.getTime(),
        diff = time / (1000 * 3600 * 24),
        bypass = await db.get('bypass_') || [];

    if (diff < 30 && !bypass.includes(member.user.id)) {
        const embed = client.embed();
        embed.setTitle('Compte récent');
        embed.setDescription(`Votre compte a été créé il y a moins de **1 mois**, donc vous avez été exclu du serveur.`);

        try {
            await member.send({ embeds: [embed] });
        } catch (error) {  }
        member.kick('Compte créé il y a moins de 1 mois');
    }
};