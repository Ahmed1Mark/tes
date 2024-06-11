const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'bot',
    description: 'Display information about the bot.',
    async execute(message, args) {
        const duration = moment.duration(message.client.uptime).format(" D[d], H[h], m[m]");

        const embed = new MessageEmbed()
            .setTitle(`Stats from \`${message.client.user.username}\``)
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: ':ping_pong: Ping', value: `┕\`${Math.round(message.client.ws.ping)}ms\``, inline: true },
                { name: ':file_cabinet: Memory', value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``, inline: true },
                { name: ':homes: Servers', value: `┕\`2\``, inline: true },
                { name: ':busts_in_silhouette: Users', value: `┕\`${message.client.users.cache.size}\``, inline: true },
                { name: ':robot: Version', value: `┕\`v${require("discord.js").version}\``, inline: true },
                { name: ':blue_book: Discord.js', value: `┕\`v${require("discord.js").version}\``, inline: true },
                { name: ':green_book: Node', value: `┕\`${process.version}\``, inline: true },
                { name: ':clock1: Uptime', value: `┕\`${duration}\``, inline: true },
                { name: ':control_knobs: API Latency', value: `┕\`${(message.client.ws.ping)}ms\``, inline: true }
            );
        message.reply({ embeds: [embed] });
    },
};
