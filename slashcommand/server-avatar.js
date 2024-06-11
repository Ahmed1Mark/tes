const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-image',
    description: 'Show server image.',
    async execute(interaction) {
        try {
            const server = interaction.guild;
            const serverImage = server.iconURL({ size: 4096, dynamic: true });
            const serverImageEmbed = new MessageEmbed()
            .setTimestamp()
            
            if (serverImage) {
                serverImageEmbed.setImage(serverImage);
                serverImageEmbed.setDescription(`**Image Link: [ [GIF](${server.iconURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${server.iconURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${server.iconURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${server.iconURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${server.iconURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                serverImageEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            } else {
                serverImageEmbed.setDescription('This server does not have an image.');
                serverImageEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            }
            
            interaction.reply({ embeds: [serverImageEmbed] });
        } catch (error) {
            console.error('Error:', error);
            interaction.reply({ content: 'An error occurred while fetching the server image.', ephemeral: true });
        }
    },
};
