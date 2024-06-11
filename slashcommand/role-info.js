const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role-info',
    description: 'Display information about a specific role.',
    options: [
        {
            name: 'role',
            description: 'Select the role to display its information',
            type: 'ROLE',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');

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
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            if (role.color) {
                roleEmbed.setColor(role.color);
            }

            await interaction.reply({ embeds: [roleEmbed] });
        } catch (error) {
            console.error('Error displaying role info:', error);
        }
    },
};
