const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'member-list',
    aliases: ['member','m-list'],
    description: 'List all members in the server',
    
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

        const members = await message.guild.members.fetch();

        // تقسيم الأعضاء إلى بوتات وأعضاء حقيقيين
        const bots = members.filter(member => member.user.bot);
        const humans = members.filter(member => !member.user.bot);

        const botsCount = bots.size;
        const humansCount = humans.size;
        const totalMembersCount = botsCount + humansCount;

        const membersPerEmbed = 20; // عدد الأعضاء لكل Embed

        const botChunks = chunkArray(Array.from(bots.values()), membersPerEmbed);
        const humanChunks = chunkArray(Array.from(humans.values()), membersPerEmbed);

        let isFirstOverallEmbed = true;
        let embeds = [];

        // إنشاء الـ embeds للبوتات
        for (const chunk of botChunks) {
            const embed = new MessageEmbed()
                .setColor('#2c2c34')
                .setTitle('Bots');

            if (isFirstOverallEmbed) {
                embed.setFooter({ text: `Humans: ${humansCount}, Bots: ${botsCount}, Total: ${totalMembersCount}` })
                     .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(member => {
                description += `\`${member.user.tag}\` - ID: \`${member.id}\`\n`;
            });

            embed.setDescription(description);
            embeds.push(embed);
        }

        // إنشاء الـ embeds للأعضاء الحقيقيين
        for (const chunk of humanChunks) {
            const embed = new MessageEmbed()
                .setTitle('Members');

            if (isFirstOverallEmbed) {
                embed.setFooter({ text: `Humans: ${humansCount}, Bots: ${botsCount}, Total: ${totalMembersCount}` })
                     .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(member => {
                description += `\`${member.user.tag}\` - ID: \`${member.id}\`\n`;
            });

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