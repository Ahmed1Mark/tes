const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'edit-message',
    description: 'Edit a message by its ID.',
    options: [
        {
            name: 'message_id',
            description: 'The ID of the message you want to edit.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'format',
            description: 'The format of the message to edit.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Embed', value: 'embed' },
                { name: 'Text', value: 'text' },
            ],
        },
        {
            name: 'new_text',
            description: 'The new text you want to set for the message.',
            type: 'STRING',
            required: true,
        },
    ],
    async execute(interaction) {
        // Check if the user has ADMINISTRATOR permission
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        const messageId = interaction.options.getString('message_id');
        const newText = interaction.options.getString('new_text');
        const format = interaction.options.getString('format');

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            if (!message) {
                return interaction.reply({ content: 'Message not found!', ephemeral: true });
            }

            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(newText)
                await message.edit({ embeds: [embed] });
                interaction.reply({ content: 'Message edited successfully!', ephemeral: true });
            } else {
                await message.edit(newText);
                interaction.reply({ content: 'Message edited successfully!', ephemeral: true });
            }
        } catch (error) {
            console.error('Error editing message:', error);
            interaction.reply({ content: 'An error occurred while editing the message.', ephemeral: true });
        }
    },
};
