const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role-info',
    aliases: ['r-info'],
    description: 'Display information about a specific role.',
    async execute(message, args) {
        try {
            let role;
            const roleId = args[0] ? args[0].replace(/[\\<>@&]/g, '') : null; // إزالة الأحرف الزائدة من الـ Mention للرتبة

            // التحقق ما إذا كان المدخل هو Mention للرتبة أو ID للرتبة
            if (message.mentions.roles.size > 0) {
                role = message.mentions.roles.first();
            } else if (roleId) {
                role = message.guild.roles.cache.get(roleId);
            } else {
                return await message.reply('Please specify the role to display its information.');
            }

            if (!role) {
                return await message.reply('Could not find that role!');
            }

            const roleEmbed = new MessageEmbed()
                .setTitle('Role Information')
                .addFields(
                    { name: 'Role ID', value: `\`${role.id}\``, inline: true },
                    { name: 'Role Name', value: role.name, inline: true },
                    { name: 'Role Color', value: role.color ? `#${role.color.toString(16).toUpperCase()}` : 'None', inline: true },
                    { name: 'Role Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
                    { name: 'Role Managed', value: role.managed ? 'Yes' : 'No', inline: true },
                    { name: 'Role Created At', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: true },
                )
                .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }) // Updated setFooter call
                .setTimestamp();

            if (role.color) {
                roleEmbed.setColor(role.color);
            }

            await message.reply({ embeds: [roleEmbed] });
        } catch (error) {
            console.error('Error displaying role info:', error);
        }
    },
};
