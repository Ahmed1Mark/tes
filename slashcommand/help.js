const { MessageEmbed } = require('discord.js');
const {
    prefix,
    server_banner_id,
    channel_info_id,
    edit_message_id,
    message_info_id,
    test_welcome_id,
    user_banner_idd,
    member_list_id,
    server_info_id,
    emoji_list_id,
    role_info_id,
    role_list_id,
    user_info_id,
    avatar_id,
    clear_id,
    ping_id,
    say_id,
    tax_id,
    bot_id,
} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List commands.',
    async execute(interaction) {
      
        let zap = "\`⚡\` Lightning Response.";
        let green = "\`🟢\` Good Response.";
        let yellow = "\`🟡\` Moderate Response.";
        let red = "\`🔴\` Bad Response.";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = interaction.client.ws.ping;
        let botPing = Math.floor(Date.now() - interaction.createdTimestamp);

        if (apiPing >= 40 && apiPing < 200) {
            apiState = green;
        } else if (apiPing >= 200 && apiPing < 400) {
            apiState = yellow;
        } else if (apiPing >= 400) {
            apiState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            botState = green;
        } else if (botPing >= 200 && botPing < 400) {
            botState = yellow;
        } else if (botPing >= 400) {
            botState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            timediff = green;
        } else if (botPing >= 200 && botPing < 400) {
            timediff = yellow;
        } else if (botPing >= 400) {
            timediff = red;
        }

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTimestamp()
            .setAuthor({ name: `Welcome TO BOT ${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`> **🤖 Rules For Using Bot Commands**\n\n1. 🚫 Limit commands to appropriate channels to maintain conversation flow.\n2. ⚠️ Avoid spamming commands for bot performance and server stability.\n3. 🛠 If you encounter a problem, please talk to the developer : <@803873969168973855>\n4. 🛑 Respect server rules avoid disruptive or offensive commands.\n5. 📌 Command Status : \`🟢\` = General | \`🟠\` = Administrator.\n6. 🔗 For inquiries, join us on the **[Discord Server](https://discord.gg/AU5bWvnFsV)** \n7. 🔧 Perfix for using bot commands : \` ${prefix} \`.\n8. 🎛 BOT Status : ${botState}\n9. 📚 All Commands : \` 40 \``)
            .addFields(
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `> 💬 Commands:`, value: `\u2003`, inline: true },
                { name: `📜 Description:`, value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </server-banner:${server_banner_id}>\n\`🟠\` </test-welcome:${test_welcome_id}>\n\`🟠\` </edit-message:${edit_message_id}>\n`, value: `\u2003`, inline: true },
                { name: 'Displays the server banner image.\nSimulates a welcome message test.\nEdits an existing message content.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </message-info:${message_info_id}>\n\`🟢\` </channel-info:${channel_info_id}>\n\`🟢\` </member-list:${member_list_id}>`, value: `\u2003`, inline: true },
                { name: 'Displays information about a message.\nShows detailed channel information.\nDisplays the list of server members.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </user-banner:${user_banner_idd}>\n\`🟢\` </user-avatar:${avatar_id}>\n\`🟢\` </server-info:${server_info_id}>`, value: `\u2003`, inline: true },
                { name: 'Fetches the banner of a user.\nRetrieves the avatar of a user.\nProvides detailed server information.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </emoji-list:${emoji_list_id}>\n\`🟢\` </user-info:${user_info_id}>\n\`🟢\` </role-info:${role_info_id}>`, value: `\u2003`, inline: true },
                { name: 'Lists all available emojis on the server.\nRetrieves detailed user information summary.\nProvides information about a specific role.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </role-list:${role_list_id}>\n\`🟠\` </clear:${clear_id}>\n\`🟢\` </ping:${ping_id}>`, value: `\u2003`, inline: true },
                { name: 'Provides detailed information about a role.\nClears messages from a chat.\nCheck the bot and API latency.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟠\` </say:${say_id}>\n\`🟢\` </tax:${tax_id}>\n\`🟢\` </bot:${bot_id}>`, value: `\u2003`, inline: true },
                { name: 'Repeats your text.\nCalculate ProBot credit tax\nDisplay information about the bot.', value: `\u2003`, inline: true },
            );

        interaction.reply({ embeds: [embed] });
    },
};
