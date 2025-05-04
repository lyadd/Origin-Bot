module.exports = async (client, db, config, channel) => {
    const
        guild = channel.guild,
        data = db.get(`tempchannels_${guild.id}`),
        getChannel = (corg, id) => corg?.channels?.cache.get(id);
    if (!data || data && !getChannel(guild, data.category) || !getChannel(guild, data.salon)) return;
}