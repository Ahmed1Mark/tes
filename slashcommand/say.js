const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Repeats your text.',
    options: [
        {
            name: 'text',
            description: 'The text you want the bot to say.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'format',
            description: 'Optional: Select the format of the message.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Embed', value: 'embed' },
                { name: 'Text', value: 'text' },
            ],
        },
        {
            name: 'channel',
            description: 'Optional: Select a channel to send the message to.',
            type: 'CHANNEL',
            required: false,
        },
    ],
    async execute(interaction) {
        // Check if the user has ADMINISTRATOR permission
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        const text = interaction.options.getString('text');
        const channelOption = interaction.options.getChannel('channel');
        const format = interaction.options.getString('format');

        if (channelOption && channelOption.isText()) {
            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(text)
                channelOption.send({ embeds: [embed] });
                interaction.reply({ content: `Message sent to ${channelOption} as an embed.`, ephemeral: true });
            } else {
                channelOption.send(text);
                interaction.reply({ content: `Message sent to ${channelOption} as a regular message.`, ephemeral: true });
            }
        } else {
            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(text)
                interaction.channel.send({ embeds: [embed] });
                interaction.reply({ content: 'Message sent in this channel as an embed.', ephemeral: true });
            } else {
                interaction.channel.send(text);
                interaction.reply({ content: 'Message sent in this channel as a regular message.', ephemeral: true });
            }
        }
    },
};
