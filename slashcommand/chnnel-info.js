const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channel-info',
    description: 'Display information about the current channel.',
    options: [
        {
            name: 'channel',
            description: 'Select the channel to display its information',
            type: 'CHANNEL',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');
            const author = channel.owner;

            const channelEmbed = new MessageEmbed()
                .setTitle('Channel Information')
                .addFields(
                    { name: 'Channel ID', value: `\`${channel.id}\``, inline: true },
                    { name: 'Channel Type', value: channel.type, inline: true },
                    { name: `\u2003`, value: `\u2003`, inline: false },
                    { name: 'Channel Name', value: channel.name, inline: true },
                    { name: 'Created At', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`, inline: true },
                )
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [channelEmbed] });
        } catch (error) {
            console.error('Error displaying channel info:', error);
        }
    },
};
