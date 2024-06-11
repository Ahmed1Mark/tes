const { MessageEmbed } = require('discord.js');

module.exports = {
        name: 'server-banner',
        description: 'Show server main image.',
        async execute(interaction) {
            try {
                const server = interaction.guild;
                const serverBanner = server.bannerURL({ size: 4096, dynamic: true });
                const serverBannerEmbed = new MessageEmbed()
    
                if (serverBanner) {
                    serverBannerEmbed.setImage(serverBanner);
                    serverBannerEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                } else {
                    serverBannerEmbed.setDescription('This server does not have a banner.');
                    serverBannerEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                }
                
                interaction.reply({ embeds: [serverBannerEmbed] });
            } catch (error) {
                console.error('Error:', error);
                interaction.reply({ content: 'An error occurred while fetching the server banner.', ephemeral: true });
            }
        },
    };
