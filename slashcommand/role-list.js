const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'role-list',
    description: 'List all roles in the server',
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

        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role);

        const rolesPerEmbed = 20; // عدد الرتب لكل Embed

        const roleChunks = chunkArray(roles, rolesPerEmbed);

        let isFirstOverallEmbed = true;
        let embeds = [];

        // إنشاء الـ embeds للرتب
        for (const chunk of roleChunks) {
            const embed = new MessageEmbed()
                .setTitle('Server Roles');

            if (isFirstOverallEmbed) {
                embed.setFooter({ text: `Total Roles: ${roles.length}` })
                     .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(role => {
                description += `${role.toString()} - ID: \`${role.id}\`\n`;
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
