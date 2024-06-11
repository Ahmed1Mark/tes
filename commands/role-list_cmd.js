const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'role-list',
    aliases: ['r-list'],
    description: 'List all roles in the server',
    
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

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role);

        const rolesPerEmbed = 20; // عدد الرتب لكل Embed

        const roleChunks = chunkArray(roles, rolesPerEmbed);

        let isFirstOverallEmbed = true;
        let embeds = [];

        // إنشاء الـ embeds للرتب
        for (const chunk of roleChunks) {
            const embed = new MessageEmbed()

            if (isFirstOverallEmbed) {
                embed.setFooter(`Total Roles: ${roles.length}`)
                embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
                embed.setTitle('> Server Roles List');
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(role => {
                description += `${role.toString()} - ID: \`${role.id}\` - Color: \`${role.hexColor}\`\n`;
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
