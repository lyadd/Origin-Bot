const { PermissionFlagsBits, ChannelType } = require('discord.js');
module.exports = {
    name: "lyad",
    dm: false,
    description: "Panel admin pour gérer les tempchannels",
    type: "CHAT_INPUT",
    go: async (client, db, config, interaction, args) => {
        if (!interaction.member.roles.cache.has(config.staffRole.admin)) { return interaction.reply({ content: "\`❌\` Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true }); }

        const guild = interaction.guild
        const embed = client.embed().setDescription("`Chargement...`");
        await interaction.reply({ embeds: [embed], ephemeral: true });

        let data = db.get(`tempchannels_${interaction.guild.id}`);
        embed.setTitle(`🕙 Modification des salons temporaires de ${interaction.guild.name}`);
        const row = client.row()
            .addComponents(client.button().setCustomId(`create_${interaction.id}`).setEmoji('🔰').setStyle(1))
            .addComponents(client.button().setCustomId(`editm_${interaction.id}`).setEmoji('✏️').setStyle(3))
            .addComponents(client.button().setCustomId(`deletetm_${interaction.id}`).setEmoji('✖️').setStyle(4));
        embed.setDescription("`🔰` Crée une configuration automatique\n`✏️` Modifier les salons temporaires\n`❌` Supprimer les salons temporaires");
        const
            getChannel = (corg, id) => corg?.channels?.cache.get(id),
            editEmbed = async () => {
                embed.setFields(
                    { name: "`📖` Catégorie", value: data?.category && getChannel(guild, data?.category) ? `\`${getChannel(guild, data?.category)?.name} (${data?.category})\`` : "`❌`", inline: true },
                    { name: "`🏷️` Salon", value: data?.salon && getChannel(guild, data?.salon) ? `${getChannel(guild, data?.salon)} \`(${data?.salon})\`` : "`❌`", inline: true },
                    { name: "`🎗️` Nom des Salons", value: data?.salonnom ? `\`${data?.salonnom}\`` : "`Salon de {username}`", inline: true },
                );
                await interaction.editReply({ embeds: [embed], components: [row] });
            };
        editEmbed();
        client.on("interactionCreate", async (inter) => {
            if (inter.customId === `create_${interaction.id}`) {
                await inter.deferUpdate({ ephemeral: true });
                if (db.get(`tempchannels_${interaction.guild.id}`)) return;
                embed.setDescription(`\`🔰\` Création de la catégorie des salons personnalisé en cours..`);
                await interaction.editReply({ embeds: [embed], components: [] });

                let RoleMember = interaction.guild.roles.cache.get(config.roles.freeroam);

                const c = await interaction.guild.channels.create({
                    name: 'Salon temporaire',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        { id: RoleMember, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
                        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
                    ]
                });
                const s = await c.guild.channels.create({
                    name: '➕ Crée ton salon',
                    type: ChannelType.GuildVoice,
                    parent: c.id,
                    permissionOverwrites: [
                        { id: RoleMember, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
                        { id: c.guild.id, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
                    ]
                });
                const obj = {
                    category: c.id,
                    salon: s.id,
                    salonnom: `Salon de {username}`
                };
                data = obj;
                db.set(`tempchannels_${interaction.guild.id}`, obj);
                editEmbed();
            };
            if (inter.customId === `editm_${interaction.id}`) {
                const
                    modal = client.modal()
                        .setCustomId(`modal_${interaction.id}`)
                        .setTitle(`✏️ Modifier les salons temporaires`),
                    category = client.textInput()
                        .setCustomId(`mcatagory_${interaction.id}`)
                        .setLabel(`📖 Catégorie ID`)
                        .setPlaceholder(`Example: 1077412335427268628`)
                        .setStyle(1)
                        .setMinLength(5)
                        .setRequired(true),
                    salon = client.textInput()
                        .setCustomId(`msalon_${interaction.id}`)
                        .setLabel(`🏷️ Salon ID`)
                        .setPlaceholder(`Example: 1077412335427268628`)
                        .setStyle(1)
                        .setMinLength(5)
                        .setRequired(true),
                    salonnom = client.textInput()
                        .setCustomId(`mnsalon_${interaction.id}`)
                        .setLabel(`🎗️ Nom des Salons`)
                        .setPlaceholder(`{username}: Pseudo | {usertag}: Pseudo + tag | {userid}: ID`)
                        .setStyle(1)
                        .setMinLength(2)
                        .setRequired(true);
                if (data?.category) category.setValue(data?.category);
                if (data?.salon) salon.setValue(data?.salon);
                if (data?.salonnom) salonnom.setValue(data?.salonnom);
                modal.addComponents(client.row().addComponents(category));
                modal.addComponents(client.row().addComponents(salon));
                modal.addComponents(client.row().addComponents(salonnom));
                inter.showModal(modal);
            };
            if (inter.customId === `modal_${interaction.id}`) {
                await inter.deferUpdate({ ephemeral: true });
                const
                    mcatagory = inter.fields.getTextInputValue("mcatagory_" + interaction.id),
                    msalon = inter.fields.getTextInputValue("msalon_" + interaction.id),
                    mnsalon = inter.fields.getTextInputValue("mnsalon_" + interaction.id);
                if (!getChannel(guild, mcatagory)) return inter.reply({ content: "`❌` Catégorie ID invalide (`" + mcatagory + ")`", embeds: [], components: [], ephemeral: true });
                if (!getChannel(guild, msalon)) return inter.reply({ content: "`❌` Salon ID invalide (`" + msalon + ")`", embeds: [], components: [], ephemeral: true });
                if (mnsalon.length > 150) return inter.reply({ content: "`❌` Le nom des salons est trop grand (`" + mnsalon + ")`", embeds: [], components: [], ephemeral: true });
                const obj = { category: mcatagory, salon: msalon, salonnom: mnsalon };
                data = obj;
                db.set(`tempchannels_${interaction.guild.id}`, data);
                editEmbed()
            };
            if (inter.customId === `deletetm_${interaction.id}`) {
                db.delete(`tempchannels_${interaction.guild.id}`);
                interaction.editReply({ content: "`✔` Supprimé de la db avec succès!", embeds: [], components: [], ephemeral: true })
            }
        })
    }
}