module.exports = {
    name: 'booster',
    dm: false,
    description: 'Affiche les avantages disponibles pour les booster du serveur.',
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction, args) => {
        const embed = client.embed()
        embed.setAuthor({ name: 'Origin - Booster' })
        embed.setDescription(`
        Le grade <@&${config.roles.booster}> est accessible en appliquant un **Boost** sur le Discord Origin. 
        
        La liaison est effectuée **instantanément**, vous permettant de débloquer **plusieurs avantages**.
        
         **\`\`\`OBTENTION\`\`\`**
         Pour obtenir le grade <@&${config.roles.booster}>, il suffit d'acheter un boost.
         Dès que le boost est retiré, vous **perdrez les avantages associés**.

         Lien pour souscrire à un abonnement Nitro : **https://discord.com/**

         **\`\`\`AVANTAGES\`\`\`**
         \`◾\` Obtenez l'arme Mini SMG

         \`◾\` Obtenez l'arme Machine Pistol

         \`◾\` Obtenez l'arme Pistol .50

         \`◾\` Obtenez l'arme Revolver

         \`◾\` Obtenez l'arme Knuckle

         \`◾\` Obtenez l'arme Machete

         \`◾\` Obtenez l'arme Bat
          `)
        embed.setImage('https://cdn.discordapp.com/attachments/1013078858553118733/1245408089025413263/3.png?ex=66a1cf6a&is=66a07dea&hm=5c3436e03069fd56882b6d2e2f2c04fb2cdc8ee0f59b0e1b3227a4d3cc374f29&')
        interaction.reply({ embeds: [embed] })
    }
}   