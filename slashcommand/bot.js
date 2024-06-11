const { MessageEmbed } = require('discord.js');
const moment = require('moment'); // Import the moment module

module.exports = {
    name: 'bot',
    description: 'Display information about the bot.',
    async execute(interaction) {
        const duration = moment.duration(interaction.client.uptime).format(" D[d], H[h], m[m]");

        const embed = new MessageEmbed()
            .setTitle(`Stats from \`${interaction.client.user.username}\``)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: ':ping_pong: Ping', value: `┕\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true },
                { name: ':file_cabinet: Memory', value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``, inline: true },
                { name: ':homes: Servers', value: `┕\`2\``, inline: true },
                { name: ':busts_in_silhouette: Users', value: `┕\`${interaction.client.users.cache.size}\``, inline: true },
                { name: ':robot: Version', value: `┕\`v${require("discord.js").version}\``, inline: true }, // Access version directly from discord.js module
                { name: ':blue_book: Discord.js', value: `┕\`v${require("discord.js").version}\``, inline: true }, // Access version directly from discord.js module
                { name: ':green_book: Node', value: `┕\`${process.version}\``, inline: true },
                { name: ':clock1: Uptime', value: `┕\`${duration}\``, inline: true },
                { name: ':control_knobs: API Latency', value: `┕\`${(interaction.client.ws.ping)}ms\``, inline: true }
            );
        interaction.reply({ embeds: [embed] });
    },
};
