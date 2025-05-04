const { ComponentType } = require('discord.js');

module.exports = {
    name: "annonce",
    dm: false,
    description: "Permet de faire une annonce.",
    type: "CHAT_INPUT",

    go: async (client, db, config, interaction) => {
        if (!interaction.member.roles.cache.has(config.staffRole.admin)) { return interaction.reply({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const row = client.row().addComponents(client.menu().setCustomId("select").setPlaceholder("Modifiez l'embed")
            .addOptions([
                { label: "✏️・Titre", value: "titre" },
                { label: "💬・Description", value: "description" },
                { label: "🖼️・Image", value: "image" },
                { label: "❌・Annuler", value: "nop" },
                { label: "✅・Validé", value: "yep" }
            ])
        );

        const
            embed = client.embed().setDescription('ㅤ'),
            msgembed = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true }),
            filter = m => m.author.id === interaction.user.id,
            collector = interaction.channel.createMessageCollector({ filter }),
            componentFilter = i => i.user.id === interaction.user.id,
            componentCollector = msgembed.createMessageComponentCollector({ filter: componentFilter, componentType: ComponentType.SelectMenu });

        componentCollector.on('collect', async i => {
            const value = i.values[0];
            let prompt = '';

            if (value === 'titre') prompt = "Quel **Titre** voulez-vous attribuer à l'embed ?";
            else if (value === 'description') prompt = "Quelle **Description** voulez-vous attribuer à l'embed ?";
            else if (value === 'image') prompt = "Quelle **Image** voulez-vous attribuer à l'embed ?";
            else if (value === 'nop') prompt = "Êtes-vous sûr de vouloir annuler l'embed ? Répondez par (oui/non)";
            else if (value === 'yep') prompt = "Désormais, indiquez le channel où je vais envoyer l'embed **#channel**";

            if (prompt) {
                await i.reply({ content: prompt, ephemeral: true });

                collector.once('collect', async message => {
                    message.delete();
                    await i.deleteReply();

                    if (value === 'image') {
                        let imageUrl = '';
                        if (message.attachments.size > 0) {
                            imageUrl = message.attachments.first().url;
                        } else if (message.content.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/)) {
                            imageUrl = message.content;
                        } else {
                            await interaction.channel.send('Vous devez fournir un lien valide vers une image.');
                            return;
                        }

                        embed.setImage(imageUrl);
                    } else if (value === 'nop') {
                        if (message.content.toLowerCase() === 'oui') await msgembed.delete();
                    } else if (value === 'yep') {
                        const channel = message.mentions.channels.first();
                        if (channel) {
                            await channel.send({ embeds: [embed] });
                            await msgembed.delete();
                        } else {
                            await interaction.channel.send("Vous devez indiquer un **channel**.");
                        }
                    } else {
                        if (value === 'titre') embed.setTitle(message.content);
                        else if (value === 'description') embed.setDescription(message.content);

                        try {
                            await msgembed.edit({ embeds: [embed] });
                        } catch (error) {
                            console.error('Erreur lors de la mise à jour de l\'embed :', error);
                            await interaction.channel.send('Erreur lors de la mise à jour de l\'embed.');
                        }
                    }
                });
            }
        });

        componentCollector.on('end', collected => {
            if (collected.size === 0) msgembed.edit({ components: [] });
        });
    }
};
