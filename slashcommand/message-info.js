const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'message-info',
    description: 'Display information about a specific message.',
    options: [
        {
            name: 'message_id',
            description: 'Enter the ID of the message to display its information',
            type: 'STRING',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const messageId = interaction.options.getString('message_id');
            const channel = interaction.channel;

            // Fetch the message by its ID
            const message = await channel.messages.fetch(messageId);

            const messageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Message Information')
                .setDescription(`**Content:**\n${message.content}`)
                .addFields(
                    { name: 'Message ID', value: `\`${message.id}\``, inline: true },
                    { name: 'Author', value: `<@${message.author.id}>`, inline: true },
                    { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
                    { name: 'Sent At', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Edited At', value: message.editedTimestamp ? `<t:${Math.floor(message.editedTimestamp / 1000)}:F>` : 'Not edited', inline: true },
                )
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [messageEmbed] });
        } catch (error) {
            console.error('Error displaying message info:', error);
        }
    },
};
