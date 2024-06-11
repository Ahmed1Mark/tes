const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-avatar',
    aliases: ['s-avatar'],
    description: 'Display the avatar of a user or the server.',
    async execute(message, args) {
        try {
            // إذا كان هناك تمييز للمستخدم أو معرف للمستخدم، يعرض صورة المستخدم
            let user = message.author;
            const mention = message.mentions.users.first();
            const userID = args[0];

            if (mention) {
                user = mention;
            } else if (userID) {
                user = await message.client.users.fetch(userID);
            }

            // إذا لم يكن هناك تمييز للمستخدم أو معرف للمستخدم، يعرض صورة السيرفر
            const serverIcon = message.guild.iconURL({ dynamic: true, format: 'png', size: 4096 });

            await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("#2c2c34")
                        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`**Server Icon Link: [ [GIF](${message.guild.iconURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${message.guild.iconURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${message.guild.iconURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${message.guild.iconURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${message.guild.iconURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                        .setImage(serverIcon)
                        .setTimestamp()
                ]
            });
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
