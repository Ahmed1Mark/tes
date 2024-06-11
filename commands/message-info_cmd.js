const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'message-info',
    aliases: ['message','m-info'],
    description: 'Display information about a specific message.',
    async execute(message, args) {
        try {
            // Get the message ID from the command arguments
            const messageId = args[0];
            if (!messageId) {
                return message.reply('Please provide a message ID.');
            }

            const channel = message.channel;

            // Fetch the message by its ID
            const fetchedMessage = await channel.messages.fetch(messageId);

            const messageEmbed = new MessageEmbed()
                .setTitle('Message Information')
                .setDescription(`**Content:**\n${fetchedMessage.content}`)
                .addFields(
                    { name: 'Message ID', value: `\`${fetchedMessage.id}\``, inline: true },
                    { name: 'Author', value: `<@${fetchedMessage.author.id}>`, inline: true },
                    { name: 'Channel', value: `<#${fetchedMessage.channel.id}>`, inline: true },
                    { name: 'Sent At', value: `<t:${Math.floor(fetchedMessage.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Edited At', value: fetchedMessage.editedTimestamp ? `<t:${Math.floor(fetchedMessage.editedTimestamp / 1000)}:F>` : 'Not edited', inline: true },
                )
                .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await message.reply({ embeds: [messageEmbed] });
        } catch (error) {
            console.error('Error displaying message info:', error);
            await message.reply('There was an error retrieving the message information.');
        }
    },
};
