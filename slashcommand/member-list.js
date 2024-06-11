const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'member-list',
    description: 'List all members in the server',
    options: [], // Add options if needed

    execute: async (interaction) => {
        const now = Date.now();
        if (commandCooldown.has(interaction.user.id)) {
            const expirationTime = commandCooldown.get(interaction.user.id) + cooldownDuration;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000; // الوقت المتبقي بالثواني
                await interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`, ephemeral: true });
                return;
            }
        }

        // إضافة المستخدم إلى مجموعة التبريد
        commandCooldown.set(interaction.user.id, now);
        setTimeout(() => commandCooldown.delete(interaction.user.id), cooldownDuration); // إزالة المستخدم بعد 10 ثوانٍ

        const members = interaction.guild.members.cache;

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
                     .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
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
                     .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(member => {
                description += `\`${member.user.tag}\` - ID: \`${member.id}\`\n`;
            });

            embed.setDescription(description);
            embeds.push(embed);
        }

        // إرسال الـ embeds كـ ephemeral
        await interaction.reply({ embeds: embeds, ephemeral: true });
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
