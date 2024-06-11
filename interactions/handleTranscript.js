const { MessageAttachment } = require('discord.js');

// دالة لمعالجة التفاعل transcript
async function handleTranscript(interaction) {
    if (interaction.customId === 'transscript') {
        const ticketChannel = interaction.channel;
        try {
            const transcript = await createTranscript(ticketChannel);
            const textBuffer = Buffer.from(transcript, 'utf-8');
            
            // إرسال الملف برسالة خاصة إلى الشخص الذي قام بالتفاعل
            const attachment = new MessageAttachment(textBuffer, 'transcript.txt');
            await interaction.user.send({ files: [attachment] });
            
            await interaction.reply({ content: 'تم إنشاء النص وإرساله إلى الخاص.', ephemeral: true });
        } catch (error) {
            console.error('Error creating or sending transcript:', error.message);
            await interaction.reply({ content: 'Failed to create or send transcript.', ephemeral: true });
        }
    }
}

// دالة لإنشاء سجل المحادثة
async function createTranscript(channel) {
    try {
        let transcript = '';

        // جمع المحادثة من الرسائل في التذكرة
        const messages = await channel.messages.fetch({ limit: 100 }); // يمكن تعديل الحد الأقصى لعدد الرسائل هنا
        messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        messages.forEach(message => {
            const timestamp = new Date(message.createdTimestamp).toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
            transcript += `[${timestamp}] ${message.author.tag}: ${message.content}\n`;
        });

        return transcript;
    } catch (error) {
        console.error('Error creating ticket transcript:', error.message);
        throw error;
    }
}

// تصدير الدالة لمعالجة التفاعل transcript
module.exports = {
    handleTranscript
};