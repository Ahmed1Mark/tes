const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-banner',
    aliases: ['s-banner'],
    description: 'Display the server banner if available.',
    async execute(message, args) {
        try {
            const serverBanner = message.guild.bannerURL({ dynamic: true, format: 'png', size: 4096 });

            if (serverBanner) {
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#2c2c34")
                            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`**Server Banner Link: [ [GIF](${message.guild.bannerURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${message.guild.bannerURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${message.guild.bannerURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${message.guild.bannerURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${message.guild.bannerURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                            .setImage(serverBanner)
                            .setTimestamp()
                    ]
                });
            } else {
                await message.reply("This server does not have a banner.");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    },
};
