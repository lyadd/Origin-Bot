module.exports = {
    name: "help",
    dm: true,
    description: "Retourne toutes les commandes.",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction, args) => {
        if (!(interaction.member.roles.cache.has(config.staffRole.admin) || interaction.member.roles.cache.has(config.staffRole.headstaff) || interaction.member.roles.cache.has(config.staffRole.staff) || interaction.member.roles.cache.has(config.staffRole.moderateur))) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const
            embed = client.embed(), categories = [], fields = [], category = {
                admin: "`🔰`・Commandes | Admin",
                headstaff: "`♻️`・Commandes | Admin & Head Staff",
                mods: "`👀`・Commandes | Admin & Head Staff & Moderateur",
                all: "`🌐`・Commandes | All",
            };

        client.cmds.forEach(async (command) => { if (!categories.includes(command.class)) categories.push(command.class); });
        categories.sort().forEach((cat) => {
            const tCommands = client.cmds.filter((cmd) => cmd.class === cat);
            fields.push({ name: `${category[cat.toLowerCase()]} :`, value: tCommands.map((cmd) => "`=> /" + cmd.name + " - " + cmd.description + "`").join("\n") });
        });
        if (fields[0]) embed.addFields(fields);
        else embed.setDescription("`Aucune donnée trouvée`");
        return interaction.reply({ embeds: [embed] });
    }
}