const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'user-avatar',
    aliases: ['avatar', 'a'],
    description: 'Display the avatar of a user or the server.',
    async execute(message, args) {
        try {
            let user = message.author;
            const mention = message.mentions.users.first();
            const userID = args[0];

            if (mention) {
                user = mention;
            } else if (userID) {
                user = await message.client.users.fetch(userID);
            }

            await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("#2c2c34")
                        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`**Avatar Link: [ [GIF](${user.displayAvatarURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${user.displayAvatarURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${user.displayAvatarURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                        .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
                        .setTimestamp()
                ]
            });
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
