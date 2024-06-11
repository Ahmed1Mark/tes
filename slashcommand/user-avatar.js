const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'user-avatar',
    description: 'Display the avatar of a user or the server.',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user whose avatar you want to display.',
            required: false,
            // Add the USER_PERMISSION here if needed
            // USER_PERMISSION: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
        },
    ],
    async execute(interaction) {
        const userOption = interaction.options.get('user');
        const user = userOption ? userOption.user : interaction.user;

        await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#2c2c34")
                            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`**Avatar Link: [ [GIF](${user.displayAvatarURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${user.displayAvatarURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${user.displayAvatarURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                            .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
                            .setTimestamp()
                    ]
        });
    },
};
