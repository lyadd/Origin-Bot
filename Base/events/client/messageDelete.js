module.exports = async (client, db, config, message) => {
    const
        salon = config.logs.ghostping,
        logs = await client.channels.fetch(salon);

    if (message.mentions.users.has(config.utilisateur.drakee1337) || message.mentions.users.has(config.utilisateur.ach)) {
        if (message.author.id === client.user.id) return;
        const log = client.embed();
        log.setAuthor({ name: 'Ghost Ping Détecter' });
        log.setDescription(`> **Exécuteur :**\nNom d'utilisateur : \`${message.author.username}\`\nIdentifiant : \`${message.author.id}\`\n\n > **Informations :**\nContenu du message : **${message.content}**\nDate : <t:${Date.parse(new Date) / 1000}:R>`);
        logs.send({ embeds: [log] });
    }
};