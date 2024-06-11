const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tax',
    description: 'Calculate ProBot credit tax',
    options: [
        {
            name: 'amount',
            type: 'STRING',
            description: 'Enter the amount to calculate the tax on, [ 1K or 1M or 1B or 1T or 1Q]',
            required: true,
        },
    ],
    async execute(interaction) {
        const amountString = interaction.options.getString('amount');
        const amount = parseInt(amountString.replace(/[^0-9]/g, ''), 10);

        const args2 = amountString.toLowerCase().replace(/k/g, "000").replace(/m/g, "000000").replace(/b/g, "000000000").replace(/t/g, "000000000000").replace(/q/g, "000000000000000");
        const tax = Math.floor(args2 * (20 / 19) + 1);
        const tax2 = Math.floor(tax - args2);
        const tax3 = Math.floor(tax2 * (20 / 19) + 1);
        const tax4 = Math.floor(tax2 + tax3 + args2);

        if (!amount || isNaN(amount) || amount < 1) {
            const errorEmbed = new MessageEmbed()
                .setTitle(`> **❌ An error occurred**`)
                .setDescription(`\`\`\`Please enter a valid amount\`\`\``);
            return interaction.reply({ embeds: [errorEmbed] });
        }

        const taxEmbed = new MessageEmbed()
            .setTitle(`> **✅ Comprehensive financial analysis of credits** 💰`)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
        { name: "\n\n1. Requested amount", value: `\`\`\`${args2}\`\`\``, inline: true },
        { name: "2. Amount tax only", value: `\`\`\`${tax2}\`\`\``, inline: true },
        { name: "3. Total amount with tax", value: `\`\`\`${tax}\`\`\``, inline: false }
            );
        return interaction.reply({ embeds: [taxEmbed] });
    },
};
