module.exports = {
    name: 'boutique',
    dm: false,
    description: 'Affiche les avantages disponibles pour les contributeurs du serveur.',
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction, args) => {
        const row = client.row().addComponents(client.button().setURL(`https://origin.tebex.io/package/5654849`).setStyle(5).setLabel("Tebex"));
        const embed = client.embed()
        embed.setAuthor({ name: 'Origin - Boutique' })
        embed.setDescription(`
        Le grade <@&${config.roles.contributeur}> est disponible à l'achat sur la plateforme Tebex. 
        
        Il offre de **nombreux avantages** et les fonds récoltés sont **réinvestis dans le développement et les infrastructures d'Origin**.

         **\`\`\`OBTENTION\`\`\`**
         Pour obtenir le grade <@&${config.roles.contributeur}>, il faut l'acheter au prix de 
         **6,96€**. Il est également possible de le renouveler chaque mois.
         **Lien :** [**origin.tebex.io**](https://origin.tebex.io/package/5654849)

         **\`\`\`AVANTAGES\`\`\`**
         \`◾\` Obtenez un **grade spécial** sur Discord

         \`◾\` Accédez en **avant-première** au développement du serveur

         \`◾\` Accédez en priorité aux différentes events privées **(10 minutes)**

         \`◾\` Accédez au **Noclip** sur le serveur en appuyant sur la touche F6

         \`◾\` Obtenez toute les armes de type **Fusil d'assaut**

         \`◾\` Obtenez toute les armes de type **SMG**

         \`◾\` Obtenez toute les armes de type **Pistolet**
                  
         \`◾\` Obtenez toute les armes de **Mêlée**
          `)
        embed.setImage('https://cdn.discordapp.com/attachments/1013078858553118733/1245408069274439721/1.png?ex=66a1cf66&is=66a07de6&hm=96b5dd4c73009b0714644c3d3dc94f0305dced2b804247ea277cff56e8589243&')
        interaction.reply({ embeds: [embed], components: [row] })
    }
}   