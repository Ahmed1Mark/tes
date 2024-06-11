const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'emoji-list',
    aliases: ['emoji','e-list'],
    description: 'List all emojis in the server',
    
    async execute(message, args) {
        const now = Date.now();
        if (commandCooldown.has(message.author.id)) {
            const expirationTime = commandCooldown.get(message.author.id) + cooldownDuration;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000; // الوقت المتبقي بالثواني
                await message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`);
                return;
            }
        }

        // إضافة المستخدم إلى مجموعة التبريد
        commandCooldown.set(message.author.id, now);
        setTimeout(() => commandCooldown.delete(message.author.id), cooldownDuration); // إزالة المستخدم بعد 10 ثوانٍ

        const emojis = await message.guild.emojis.fetch();

        const staticEmojis = emojis.filter(emoji => !emoji.animated).size;
        const animatedEmojis = emojis.filter(emoji => emoji.animated).size;
        const emojisCount = emojis.size;

        const emojisArray = emojis.map(emoji => `${emoji.toString()} - CODE : \`${emoji.toString()}\``);

        const emojisPerEmbed = 20; // عدد الإيموجيات لكل Embed

        const emojiChunks = chunkArray(emojisArray, emojisPerEmbed);

        let isFirstOverallEmbed = true;
        let embeds = [];

        // إنشاء الـ embeds للإيموجيات
        for (const chunk of emojiChunks) {
            const embed = new MessageEmbed()
                .setColor('#2c2c34')
                .setTitle('Emojis');

            if (isFirstOverallEmbed) {
                embed.setFooter(`Static Emojis: ${staticEmojis}, Animated Emojis: ${animatedEmojis}, Total: ${emojisCount}`)
                     .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            const description = chunk.join('\n');
            embed.setDescription(description);
            embeds.push(embed);
        }

        // إرسال الـ embeds
        for (const embed of embeds) {
            await message.channel.send({ embeds: [embed] });
        }
    }
};

// وظيفة لتقسيم مصفوفة إلى مجموعات
function chunkArray(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}
