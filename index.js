const { Client, Modal, version, Intents, Permissions, MessageButton, TextInputComponent, DiscordAPIError, MessageSelectMenu, MessageAttachment, MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
const { resolveImage, Canvas} = require("canvas-constructor/cairo");
const Keyv = require('keyv');
const { inviteTracker } = require("discord-inviter");
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { TextDecoder, TextEncoder, ReadableStream } = require("node:util")

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
})

const { Blob, File } = require("node:buffer")
const { fetch, Headers, FormData, Request, Response } = require("undici")

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const moment = require('moment-timezone');
require('moment-hijri');
require("moment-duration-format");
const db = new Keyv('sqlite://./storage/database.sqlite');
const express = require('express');
const app = express();
const path = require("path");

//تعريفات ملف interactions
const { handleAddMemKikMem } = require('./interactions/handleAddMemKikMem');
const { handleMsgSendControl } = require('./interactions/handleMsgSendControl');
const { handleMsgControl } = require('./interactions/handleMsgControl');
const { handleSendMemberId } = require('./interactions/handleSendMemberId');
const { handleSendMsgEmbed } = require('./interactions/handleSendMsgEmbed');
const { handleSendMsgPost } = require('./interactions/handleSendMsgPost');
const { handleMsgDeleted } = require('./interactions/handleMsgDeleted');
const { handleAddNote } = require('./interactions/handleAddNote');
const { handleSendOwnTick } = require('./interactions/handleSendOwnTick');
const { handleClaimTicket } = require('./interactions/handleClaimTicket');
const { handleTranscript } = require('./interactions/handleTranscript');
const { handleSendMsgDisabled } = require('./interactions/handleSendMsgDisabled');
const rules = require('./rules.json');
// قائمة الملفات والدوال المستوردة


// فحص حالة كل ملف
//تعريف ملف config.json
const {
    token,
    prefix,
    categoryIDs,
    welcomeRoomId,
    welcomeLogChannelId,
    claimPermissionRoleId,
    TicketReportChannelId,
    suggestionschannel,
    ServerReportChannelId,
    rulesbackground,
    rankbanner,
    timemessageID,
    timechannelID,
    timeguildID,
    levelUpChannelId,
    TicketSaveChannelId,
    logChannelId,
    selectMenuOptions,
} = require('./config.json');
//منع ظهور الاخطاء البسيطه في console log
process.on("uncaughtException" , err => {
return;
})
 
process.on("unhandledRejection" , err => {
return;
})
 
process.on("rejectionHandled", error => {
  return;
});
// يمكنك استخدام mergedConfig في الشيفرة الخاصة بك الآن
let canvax = require('canvas')
canvax.registerFont("./storage/Uni Sans Heavy.otf", { family: 'Discord' })
canvax.registerFont("./storage/DejaVuSansCondensed-Bold.ttf", { family: 'Discordx' })
const client = new Client({
intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.MESSAGE_CONTENT,
  Intents.FLAGS.GUILD_PRESENCES 
],
}); // Declare client to be a new Discord Client (bot)
require('http').createServer((req, res) => res.end(`
</> Dveloper Bot : Ahmed Clipper
</> Discord User : ahm.clipper
</> Server Support : https://dsc.gg/clipper-tv
</> Servers : ${client.guilds.cache.size}
</> Users : ${client.users.cache.size}
</> channels : ${client.channels.cache.size}
</> Name : ${client.user.username}
`)).listen(3000) //Dont remove this 


const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 30; // أو أي قيمة تعتقد أنها مناسبة
require("events").EventEmitter.defaultMaxListeners = 30;

client.on('ready', () => {
  console.log(``);
  console.log(`</> Logged in as : ${client.user.tag}!`);
  console.log(`</> Servers : ${client.guilds.cache.size}`);
  console.log(`</> Users : ${client.users.cache.size}`);
  console.log(`</> channels : ${client.channels.cache.size}`);
  console.log(`</> Name : ${client.user.username}`);
  client.user.setStatus('idle');///dnd/online/idle
  client.user.setActivity(`/help | ${prefix}help`, { type: 'WATCHING' });
});

// استيراد جميع الملفات في مجلد handlers
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    const handler = require(path.join(handlersDir, file));
    handler(client);
  }
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// قراءة الملفات داخل المجلد "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    if (command.aliases) {
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command.name);
        });
    }
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('هناك خطأ ما أثناء تنفيذ الأمر.');
    }
});

// قراءة الملفات داخل المجلد "slashcommand"
const slashCommandFiles = fs.readdirSync('./slashcommand').filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of slashCommandFiles) {
    const command = require(`./slashcommand/${file}`);
    slashCommands.push(command);
}

client.once('ready', async () => {
    try {
        await client.application?.commands.set(slashCommands);
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = slashCommands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    try {
        command.execute(message, args, client, prefix, Discord); // تمرير client و prefix و Discord إلى ملف الأمر
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing this command!');
    }
});

let nextAzkarIndex = 0;

let background2 = ''; // Initialize background2 variable

client.on('messageCreate', async message => {
  if (message.content === `${prefix}rules-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('List of Laws')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
        .setTitle("<a:ejgif1036:1250132334502739979> Server Rules Community <a:ejgif1006:1241743608617504788>")
        .setDescription(`<a:ejgif1001:1241743492032757852> to read the laws, choose from the list below \n<a:ejgif1001:1241743492032757852> please do not violate server rules`)
        .setImage(rulesbackground);

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

let updatingEmbed = false; // متغير لتتبع حالة التحديث

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guild = await client.guilds.fetch(timeguildID);
    const channel = await guild.channels.resolve(timechannelID);
    const message = await channel.messages.fetch(timemessageID);

    startUpdatingEmbed(message);
});



/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === `${prefix}time-system`) {
      
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
      
        console.log('Received +time command');
        try {
            const embedMessage = await sendTimeEmbed(message.channel);
            console.log('Embed message sent successfully');
            startUpdatingEmbed(embedMessage);
        } catch (sendError) {
            console.error('Error sending embed message:', sendError);
        }
    }
});

async function sendTimeEmbed(channel) {
    const now = moment().tz('Africa/Cairo');
    const startOfYear = moment().tz('Africa/Cairo').startOf('year');
    const daysElapsed = now.diff(startOfYear, 'days') + 1;
    const weeksElapsed = Math.ceil(daysElapsed / 7);
    const monthsElapsed = now.month() + 1;
    const hoursRemainingToday = 24 - now.hours();
    const hoursElapsedThisYear = now.diff(startOfYear, 'hours');
    let buffer_attach = await generareCanvas4(channel);
    const attachment = new MessageAttachment(buffer_attach, 'image/timeback.png');

    const embed = new MessageEmbed()
        .setTitle('> <a:ejgif1004:1241743499678973952> Data And Time Date __`CAIRO`__ Time <a:ejgif1005:1241743503403253860>')
        .setFooter({ 
                text: '! The Time Is Automatically Updated Every Minute.', 
                iconURL: client.user.displayAvatarURL() // هذه هي صورة البوت
            })
        .setColor("2c2c34")
        .setImage('attachment://timeback.png')
        .addFields(
            { name: 'The Time', value: `\`\`\`${getCairoTime()}\`\`\``, inline: true },
            { name: 'The Date', value: `\`\`\`${getCairoGregorianDate()}\`\`\``, inline: true },
            { name: 'Week Day', value: `\`\`\`${getCairoDayOfWeek()}\`\`\``, inline: true },
            { name: 'Season', value: `\`\`\`${getCurrentSeason()}\`\`\``, inline: true },
            { name: 'Weather', value: `\`\`\`${getCurrentWeather()}\`\`\``, inline: true },
            { name: 'Temperature', value: `\`\`\`${getCurrentTemperature()}°C\`\`\``, inline: true },
            { name: 'Humidity', value: `\`\`\`${getCurrentHumidity()}%\`\`\``, inline: true },
            { name: 'Hours Remaining Today', value: `\`\`\`${hoursRemainingToday}\`\`\``, inline: true },
            { name: 'Elapsed Year Days', value: `\`\`\`${daysElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Weeks', value: `\`\`\`${weeksElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Months', value: `\`\`\`${monthsElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Hours', value: `\`\`\`${hoursElapsedThisYear}\`\`\``, inline: true }
        );

    const sentMessage = await channel.send({ embeds: [embed], files: [attachment] });
    return sentMessage;
}

async function updateTimeEmbed(message) {
    const now = moment().tz('Africa/Cairo');
    const startOfYear = moment().tz('Africa/Cairo').startOf('year');
    const daysElapsed = now.diff(startOfYear, 'days') + 1;
    const weeksElapsed = Math.ceil(daysElapsed / 7);
    const monthsElapsed = now.month() + 1;
    const hoursRemainingToday = 24 - now.hours();
    const hoursElapsedThisYear = now.diff(startOfYear, 'hours');
    let buffer_attach = await generareCanvas4(message);
    const attachment = new MessageAttachment(buffer_attach, 'image/timeback.png');

    const updatedEmbed = new MessageEmbed()
        .setTitle('> <a:ejgif1004:1241743499678973952> Data And Time Date __`CAIRO`__ Time <a:ejgif1005:1241743503403253860>')
        .setFooter({ 
                text: '! The Time Is Automatically Updated Every Minute.', 
                iconURL: client.user.displayAvatarURL() // هذه هي صورة البوت
            })
        .setImage('attachment://timeback.png')
        .setColor("2c2c34")
        .addFields(
            { name: 'The Time', value: `\`\`\`${getCairoTime()}\`\`\``, inline: true },
            { name: 'The Date', value: `\`\`\`${getCairoGregorianDate()}\`\`\``, inline: true },
            { name: 'Week Day', value: `\`\`\`${getCairoDayOfWeek()}\`\`\``, inline: true },
            { name: 'Season', value: `\`\`\`${getCurrentSeason()}\`\`\``, inline: true },
            { name: 'Weather', value: `\`\`\`${getCurrentWeather()}\`\`\``, inline: true },
            { name: 'Temperature', value: `\`\`\`${getCurrentTemperature()}°C\`\`\``, inline: true },
            { name: 'Humidity', value: `\`\`\`${getCurrentHumidity()}%\`\`\``, inline: true },
            { name: 'Hours Remaining Today', value: `\`\`\`${hoursRemainingToday}\`\`\``, inline: true },
            { name: 'Elapsed Year Days', value: `\`\`\`${daysElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Weeks', value: `\`\`\`${weeksElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Months', value: `\`\`\`${monthsElapsed}\`\`\``, inline: true },
            { name: 'Elapsed Year Hours', value: `\`\`\`${hoursElapsedThisYear}\`\`\``, inline: true }
        );

    await message.edit({ embeds: [updatedEmbed], files: [attachment] });
}

async function generareCanvas4(member) {
    const background = await resolveImage("image/timeback.png"); // استخدام اسم الملف المحلي مباشرة هنا
    const { weirdToNormalChars } = require('weird-to-normal-chars');
    let canvas = new Canvas(850, 425)
        .printImage(background, 0, 0, 850, 425)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('18px Discord')
        .printText(`Season`, 690, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentSeason()}`, 690, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('18px Discord')
        .printText(`Time and Data`, 425, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCairoTime()}・${getCairoGregorianDate()}`, 425, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('18px Discord')
        .printText(`Week Day`, 160, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCairoDayOfWeek()}`, 160, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('18px Discord')
        .printText(`Humidity`, 160, 90)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentHumidity()}%`, 160, 145)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('18px Discord')
        .printText(`Temperature`, 690, 90)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentTemperature()}°C`, 690, 145);
    
    const discordjoin = await resolveImage(__dirname + "/image/discordjoin.png");
    canvas.printImage(discordjoin, 365, 85, 120, 120);

    return canvas.toBufferAsync();
}

function startUpdatingEmbed(embedMessage) {
    if (!updatingEmbed) {
        updatingEmbed = true;
        setInterval(async () => {
            try {
                await updateTimeEmbed(embedMessage);
                console.log('Embed message updated successfully');
            } catch (updateError) {
                console.error('Error updating embed message:', updateError);
            }
        }, 60000); // 10000 ميلي ثانية = 10 ثواني (للاختبار)
    } else {
        console.log('Embed message update already in progress');
    }
}

function getCurrentTemperature() {
    return Math.floor(Math.random() * 30) + 15;
}

function getCurrentHumidity() {
    return Math.floor(Math.random() * 60) + 40;
}

function getCurrentSeason() {
    const month = moment().tz('Africa/Cairo').month();
    if (month >= 3 && month <= 5) {
        return 'Spring';
    } else if (month >= 6 && month <= 8) {
        return 'Summer';
    } else if (month >= 9 && month <= 11) {
        return 'Autumn';
    } else {
        return 'Winter';
    }
}

function getCurrentWeather() {
    const isSunny = Math.random() < 0.5;
    return isSunny ? 'Sunny' : 'Cloudy';
}

function getCairoDayOfWeek() {
    return moment().tz('Africa/Cairo').format('dddd');
}

function getCairoTime() {
    return moment().tz('Africa/Cairo').format('hh:mm A');
}

function getCairoGregorianDate() {
    return moment().tz('Africa/Cairo').format('YYYY/MM/DD');
}
/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM




/////////////////////////////////////////////////////////////////////////////////////////////////// Broadcast SYSTEM
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}broadcast-system`) {
    
  // Check if the user has the Administrator permission
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply("You do not have permission to use this command.");
  }
    
    const firstRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('send-to-all')
          .setStyle('SUCCESS')
          .setLabel('📢 Send To All'),
        new MessageButton()
          .setCustomId('send-to-online')
          .setStyle('PRIMARY')
          .setLabel('🟢 Send To Online'),
        new MessageButton()
          .setCustomId('send-to-offline')
          .setStyle('SECONDARY')
          .setLabel('⚪ Send To Offline')
      );

    const secondRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('send-to-person')
          .setStyle('PRIMARY')
          .setLabel('👤 Send To Person'),
        new MessageButton()
          .setCustomId('send-to-role')
          .setStyle('DANGER')
          .setLabel('🎭 Send To Role'),
      );

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setAuthor({ name: `Welcome TO BOT ${message.client.user.username}`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
      .setImage("https://cdn.discordapp.com/attachments/1144347868220620950/1249448633640943677/standard.gif?ex=66675737&is=666605b7&hm=b044f15730161fff580dc05b95cfc4a92abeb437fb32bfdfdc1b3ec3a758ce1a&")
      .setDescription('> **Broadcast Rules**\n1. Users must adhere to the community guidelines.\n2. Spamming is strictly prohibited.')
      .setTimestamp()
      .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor('#2c2c34');

    await message.channel.send({
      embeds: [embed],
      components: [firstRow, secondRow]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // Ensure the user has the ADMINISTRATOR permission
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        return;
      }
      if (interaction.customId === 'send-to-online') {
        const modal = new Modal()
          .setCustomId('send-to-online')
          .setTitle('🟢 Send To Online')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('message-txt-send')
                .setLabel('Type your message here')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter your message here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-to-online') {
        const messageContent = interaction.fields.getTextInputValue('message-txt-send');
        
        // Fetch all guild members to get the most up-to-date list
        await interaction.guild.members.fetch();
        
        const guild = interaction.guild;
        
        // Filter out offline members and bots
        const nonOfflineNonBotMembers = guild.members.cache.filter(member => member.presence && member.presence.status !== 'offline' && !member.user.bot);
        const nonBotMembersCount = nonOfflineNonBotMembers.size;
        
        // Get the user who clicked the button
        const currentDate = new Date();
        const timeZone = 'Africa/Cairo';
        const senddate = currentDate.toLocaleDateString('en-US', { timeZone });
        currentDate.setHours(currentDate.getHours() + 1); // Add one hour to adjust for the timezone difference
        const sendtime = currentDate.toLocaleTimeString('en-EG', { timeZone, hour12: true, hour: 'numeric', minute: 'numeric' });

        const embedEphemeral = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Report Sent : \`Send To Onlline\`')
          .addFields(
              { name: 'Recipients count', value: `\`\`\`${nonBotMembersCount}\`\`\``, inline: true },
              { name: 'Sending Date', value: `\`\`\`${sendtime}\`\`\``, inline: true },
              { name: 'Sending Time', value: `\`\`\`${senddate}\`\`\``, inline: true }
           )
          .setDescription(`**The Message Sent**\n\`\`\`${messageContent}\`\`\``);

        // Send the message to online non-bot members via DM
        nonOfflineNonBotMembers.forEach(member => {
          member.send(messageContent)
            .then(() => console.log(`Message sent to ${member.user.tag}`))
            .catch(error => console.error(`Failed to send message to ${member.user.tag}:`, error));
        });

        // Reply with ephemeral embed
        interaction.reply({ embeds: [embedEphemeral], ephemeral: true })
          .then(() => console.log('Ephemeral embed sent'))
          .catch(error => console.error('Failed to send ephemeral embed:', error));
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // Ensure the user has the ADMINISTRATOR permission
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        return;
      }
      if (interaction.customId === 'send-to-offline') {
        const modal = new Modal()
          .setCustomId('send-to-offline')
          .setTitle('⚪ Send To Offline')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('message-txt-send2')
                .setLabel('Type your message here')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter your message here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-to-offline') {
        const messageContent = interaction.fields.getTextInputValue('message-txt-send2');
        
        // Fetch all guild members to get the most up-to-date list
        await interaction.guild.members.fetch();
        
        const guild = interaction.guild;
        
        // Filter out offline members and bots
        const offlineNonBotMembers = guild.members.cache.filter(member => 
          member.presence && 
          member.presence.status === 'offline' && 
          !member.user.bot
        );
        const offlineNonBotMembersCount = offlineNonBotMembers.size;
        
        // Get the user who clicked the button
        const currentDate = new Date();
        const timeZone = 'Africa/Cairo';
        const senddate = currentDate.toLocaleDateString('en-US', { timeZone });
        currentDate.setHours(currentDate.getHours() + 1); // Add one hour to adjust for the timezone difference
        const sendtime = currentDate.toLocaleTimeString('en-EG', { timeZone, hour12: true, hour: 'numeric', minute: 'numeric' });

        const embedEphemeral = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Report Sent : \`Send To Offline\`')
          .addFields(
              { name: 'Recipients count', value: `\`\`\`${offlineNonBotMembersCount}\`\`\``, inline: true },
              { name: 'Sending Date', value: `\`\`\`${sendtime}\`\`\``, inline: true },
              { name: 'Sending Time', value: `\`\`\`${senddate}\`\`\``, inline: true }
           )
          .setDescription(`**The Message Sent**\n\`\`\`${messageContent}\`\`\``);

        // Send the message to offline non-bot members via DM
        offlineNonBotMembers.forEach(member => {
          member.send(messageContent)
            .then(() => console.log(`Message sent to ${member.user.tag}`))
            .catch(error => console.error(`Failed to send message to ${member.user.tag}:`, error));
        });

        // Reply with ephemeral embed
        interaction.reply({ embeds: [embedEphemeral], ephemeral: true })
          .then(() => console.log('Ephemeral embed sent'))
          .catch(error => console.error('Failed to send ephemeral embed:', error));
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // Ensure the user has the ADMINISTRATOR permission
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        return;
      }
      if (interaction.customId === 'send-to-all') {
        const modal = new Modal()
          .setCustomId('send-to-all')
          .setTitle('📢 Send To All')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('message-txt-send3')
                .setLabel('Type your message here')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter your message here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-to-all') {
        const messageContent = interaction.fields.getTextInputValue('message-txt-send3');
        
        // Fetch all guild members to get the most up-to-date list
        await interaction.guild.members.fetch();
        
        const guild = interaction.guild;
        
        // Filter out offline members and bots
        const nonBotMembers = guild.members.cache.filter(member => !member.user.bot);
        const nonBotMembersCount = nonBotMembers.size;
        
        // Get the user who clicked the button
        const currentDate = new Date();
        const timeZone = 'Africa/Cairo';
        const senddate = currentDate.toLocaleDateString('en-US', { timeZone });
        currentDate.setHours(currentDate.getHours() + 1); // Add one hour to adjust for the timezone difference
        const sendtime = currentDate.toLocaleTimeString('en-EG', { timeZone, hour12: true, hour: 'numeric', minute: 'numeric' });

        const embedEphemeral = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Report Sent : \`Send To All\`')
          .addFields(
              { name: 'Recipients count', value: `\`\`\`${nonBotMembersCount}\`\`\``, inline: true },
              { name: 'Sending Date', value: `\`\`\`${sendtime}\`\`\``, inline: true },
              { name: 'Sending Time', value: `\`\`\`${senddate}\`\`\``, inline: true }
           )
          .setDescription(`**The Message Sent**\n\`\`\`${messageContent}\`\`\``);

        // Send the message to offline non-bot members via DM
        nonBotMembers.forEach(member => {
          member.send(messageContent)
            .then(() => console.log(`Message sent to ${member.user.tag}`))
            .catch(error => console.error(`Failed to send message to ${member.user.tag}:`, error));
        });

        // Reply with ephemeral embed
        interaction.reply({ embeds: [embedEphemeral], ephemeral: true })
          .then(() => console.log('Ephemeral embed sent'))
          .catch(error => console.error('Failed to send ephemeral embed:', error));
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // Ensure the user has the ADMINISTRATOR permission
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        return;
      }
      if (interaction.customId === 'send-to-person') {
        const modal = new Modal()
          .setCustomId('send-to-person')
          .setTitle('👤 Send To Person')
          .addComponents([
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('recipient-id')
                    .setLabel('Type the person ID here')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setPlaceholder('Enter the person ID here')
                    .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('messgae-txt-send4')
                .setLabel('Type your message here')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter your message here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-to-person') {
        const messageContent = interaction.fields.getTextInputValue('messgae-txt-send4');
        const recipientId = interaction.fields.getTextInputValue('recipient-id');

        // Find the member with the given ID
        const recipientMember = interaction.guild.members.cache.get(recipientId);

        if (!recipientMember) {
          interaction.reply({ content: 'Member not found.', ephemeral: true });
          return;
        }

        // Check if the recipient is a bot
        if (recipientMember.user.bot) {
          interaction.reply({ content: 'You cannot send messages to bots.', ephemeral: true });
          return;
        }
        
        // Get the user who clicked the button
        const currentDate = new Date();
        const timeZone = 'Africa/Cairo';
        const senddate = currentDate.toLocaleDateString('en-US', { timeZone });
        currentDate.setHours(currentDate.getHours() + 1); // Add one hour to adjust for the timezone difference
        const sendtime = currentDate.toLocaleTimeString('en-EG', { timeZone, hour12: true, hour: 'numeric', minute: 'numeric' });

        // Send the message to the recipient
        recipientMember.send(messageContent)
          .then(() => {
            const embedEphemeral = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle('> Report Sent : \`Send To Person\`')
              .addFields(
                { name: `Recipient`, value: `\`\`\`${recipientMember.user.tag}\`\`\``, inline: true },
                { name: 'Sending Date', value: `\`\`\`${senddate}\`\`\``, inline: true },
                { name: 'Sending Time', value: `\`\`\`${sendtime}\`\`\``, inline: true }
              )
              .setDescription(`**The Message Sent : <@${recipientId}>**\n\`\`\`${messageContent}\`\`\``);

            interaction.reply({ embeds: [embedEphemeral], ephemeral: true })
              .then(() => console.log('Ephemeral embed sent'))
              .catch(error => console.error('Failed to send ephemeral embed:', error));
          })
          .catch(error => {
            console.error(`Failed to send message to ${recipientMember.user.tag}:`, error);
            interaction.reply({ content: `Failed to send message to ${recipientMember.user.tag}.`, ephemeral: true });
          });
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // Ensure the user has the ADMINISTRATOR permission
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        return;
      }
      if (interaction.customId === 'send-to-role') {
        const modal = new Modal()
          .setCustomId('send-to-role')
          .setTitle('🎭 Send To Role')
          .addComponents([
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('recipient-role-id')
                    .setLabel('Type the role ID here')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setPlaceholder('Enter the role ID here')
                    .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('message-txt-send')
                .setLabel('Type your message here')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter your message here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-to-role') {
        const messageContent = interaction.fields.getTextInputValue('message-txt-send');
        const roleId = interaction.fields.getTextInputValue('recipient-role-id');

        // Find the role with the given ID
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
          interaction.reply({ content: 'Role not found.', ephemeral: true });
          return;
        }

        // Get all members who have the specified role
        const membersWithRole = role.members;

        // Initialize a variable to count the number of recipients
        let recipientsCount = 0;

        // Get the current date and time
        const currentDate = new Date();
        const timeZone = 'Africa/Cairo';
        const sendDate = currentDate.toLocaleDateString('en-US', { timeZone });
        currentDate.setHours(currentDate.getHours() + 1); // Adjusting for the timezone difference
        const sendTime = currentDate.toLocaleTimeString('en-EG', { timeZone, hour12: true, hour: 'numeric', minute: 'numeric' });

        // Send the message to each member with the specified role
        membersWithRole.forEach(member => {
          // Check if the member is a bot
          if (!member.user.bot) {
            member.send(messageContent)
              .then(() => {
                recipientsCount++; // Increment the recipients count
              })
              .catch(error => {
                console.error(`Failed to send message to ${member.user.tag}:`, error);
              });
          }
        });

        // Create an ephemeral embed to confirm the message was sent
        const embedEphemeral = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Report Sent : `Send To Role`')
          .addFields(
            { name: 'Role ID', value: `\`\`\`${roleId}\`\`\``, inline: true },
            { name: 'Sending Date', value: `\`\`\`${sendDate}\`\`\``, inline: true },
            { name: 'Sending Time', value: `\`\`\`${sendTime}\`\`\``, inline: true }
          )
          .setDescription(`**The Message Sent : <@&${roleId}>**\n\`\`\`${messageContent}\`\`\``);

        // Reply with the ephemeral embed
        interaction.reply({ embeds: [embedEphemeral], ephemeral: true })
          .then(() => console.log('Ephemeral embed sent'))
          .catch(error => console.error('Failed to send ephemeral embed:', error));
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////// Broadcast SYSTEM




/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM
module.exports = {
    getUserData
    // قم بتصدير الدوال الأخرى إذا لزم الأمر
};
const xpPerMessage = 89;
const xpPerLevel = 1111;
const levelUpFilePath = './levelup.json';

function getUserData(userId) {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        return userData[userId];
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

function generateLeaderboardEmbed() {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        console.log("userData from file:", userData); // Add this log to check userData from file
        const sortedUsers = Object.entries(userData).sort((a, b) => b[1] - a[1]);
        let leaderboardDescription = '\n'; // Start with a code block

        sortedUsers.forEach(([userId, xp], index) => {
            const { level } = getUserLevelAndXP(xp);
            console.log("userId:", userId, "xp:", xp); // Add this log to check userId and xp
            const user = client.users.cache.get(userId);
            console.log("user:", user); // Add this log to check user
            let positionEmoji = '';
            if (index === 0) {
                positionEmoji = '🥇';
            } else if (index === 1) {
                positionEmoji = '🥈';
            } else if (index === 2) {
                positionEmoji = '🥉';
            }
            if (user) {
                leaderboardDescription += `${positionEmoji} #${index + 1} | <@${user.id}> : Level ${level} | Total XP: ${xp}\n`;
            }
        });

        leaderboardDescription += ''; // End code block
        const leaderboardEmbed = new MessageEmbed()
            .setColor('#302c34')
            .setTitle('> Leaderboard 🏆')
            .setDescription(leaderboardDescription);

        return leaderboardEmbed;
    } catch (err) {
        console.error('Error generating leaderboard:', err);
        return null;
    }
}

function getUserLevelAndXP(userData) {
    const level = Math.floor(userData / xpPerLevel);
    const xp = userData % xpPerLevel;
    return { level, xp };
}

function getLeaderboardPosition(userId) {
    const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    const userXP = userData[userId] || 0;
    let position = 1;

    for (const id in userData) {
        if (userData[id] > userXP) {
            position++;
        }
    }

    return position;
}

async function generareCanvas5(member, levelUps, leaderboardPosition, oldLevel) {
    try {
        console.log("Generating canvas for member:", member.user.username); // تحقق من بناء الكانفاس لعضو معين
        const background = await resolveImage("image/levelback.png");
        const { weirdToNormalChars } = require('weird-to-normal-chars');
        const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
        const name = weirdToNormalChars(member.user.username);

        let canvas = new Canvas(852, 324)
            .printImage(background, 0, 0, 852, 324)
            .printCircularImage(avatar, 150, 160, 85)
            .setColor("#FFFFFF")
            .setTextAlign('center')
            .setTextFont('18px Discord')
            .printText(`Your Level`, 710, 110)
            .setColor("#FFFFFF")
            .setTextAlign('center')
            .setTextFont('18px Discord')
            .printText(`Your Name`, 435, 110)
            .setTextAlign("center")
            .setColor("#FFFFFF")
            .setTextFont('20px Discordx')
            .printText(`${name}`, 440, 170)
            .setTextAlign("center")
            .setColor("#FFFFFF")
            .setTextFont('15px Discordx')
            .printText(`${oldLevel} > ${levelUps}・#${leaderboardPosition}`, 710, 170);

        return await canvas.toBufferAsync();
    } catch (error) {
        console.log('Error generating canvas:', error);
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    // Handle add-xp command
    if (command === `${prefix}add-xp`) {
        // Check if the author has ADMINISTRATOR permission
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.');
            return;
        }

        const userId = args[0]?.replace(/\D/g, ''); // Extract user ID from mention or input
        const xpAmount = parseInt(args[1]);

        if (!userId || !xpAmount || isNaN(xpAmount)) {
            message.reply('Invalid command usage. Correct usage: !add-xp [@mention or id] [xp amount]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = (userData[userId] || 0) + xpAmount;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Added ${xpAmount} XP to user with ID ${userId}.`);
        return; // Return to avoid giving XP for this command
    }
  
// Handle add-level command
if (command === `${prefix}add-level`) {
    // Check if the author has ADMINISTRATOR permission
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        message.reply('You do not have permission to use this command.');
        return;
    }

    const userId = args[0]?.replace(/\D/g, ''); // Extract user ID from mention or input
    const levelAmount = parseInt(args[1]);

    if (!userId || !levelAmount || isNaN(levelAmount)) {
        message.reply('Invalid command usage. Correct usage: !add-level [@mention or id] [level amount]');
        return;
    }

    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        console.error('Error reading file:', err);
    }

    userData[userId] = (userData[userId] || 0) + levelAmount * xpPerLevel;

    fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

    message.reply(`Added ${levelAmount} level(s) to user with ID ${userId}.`);
    return; // Return to avoid giving XP for this command
}

// Handle reset-leveling command
if (command === `${prefix}reset-level-member`) {
    // Check if the author has ADMINISTRATOR permission
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        message.reply('You do not have permission to use this command.');
        return;
    }

    const userId = args[0]?.replace(/\D/g, ''); // Extract user ID from mention or input

    if (!userId) {
        message.reply('Invalid command usage. Correct usage: !reset-leveling [@mention or id]');
        return;
    }

    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        console.error('Error reading file:', err);
    }

    // Reset user's level and XP to zero
    userData[userId] = 0;

    fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

    message.reply(`Reset leveling for user with ID ${userId}.`);
    return; // Return to avoid giving XP for this command
}
  
    // Handle rank command
    if (command === `${prefix}xp`) {
        const authorId = message.author.id;
        const userData = getUserData(authorId);

        if (!userData) {
            message.channel.send('You have not gained any XP yet.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(authorId);
        const userAvatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 });

        const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Rank Information')
            .setThumbnail(userAvatarURL)
            .addFields(
                { name: 'Your level', value: `\`\`\`${level}\`\`\``, inline: true },
                { name: 'Your XP', value: `\`\`\`${xp}/1011\`\`\``, inline: true },
                { name: 'Total XP', value: `\`\`\`${level * xpPerLevel + xp}\`\`\``, inline: true },
                { name: 'Your leaderboard position', value: `\`\`\`#${leaderboardPosition}\`\`\`` }
            );

        message.channel.send({ embeds: [embed] });
        return; // Return to avoid giving XP for this command
    }

    // Handle leaderboard command
    if (command === `${prefix}top`) {
        const leaderboardEmbed = generateLeaderboardEmbed();
        message.reply({ embeds: [leaderboardEmbed] });
        return; // Return to avoid giving XP for this command
    }

    // Give XP for other messages
    const authorId = message.author.id;
    const levelUpChannel = message.guild.channels.cache.get(levelUpChannelId);

    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Level up file does not exist, creating new file.');
            fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
        } else {
            console.error('Error reading file:', err);
        }
    }

    userData[authorId] = (userData[authorId] || 0) + xpPerMessage;

    // Check if user has accumulated enough XP for level up
    const remainingXP = userData[authorId] % xpPerLevel;
    const levelUps = Math.floor(userData[authorId] / xpPerLevel);

    // Check if the user leveled up
    if (levelUps > (userData[`${authorId}_level`] || 0)) {
        const oldLevel = userData[`${authorId}_level`] || 0;
        const leaderboardPosition = getLeaderboardPosition(authorId);
        userData[`${authorId}_level`] = oldLevel + 1;
        userData[`${authorId}_level`] = levelUps;
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        const member = message.guild.members.cache.get(authorId);
        if (member) {
            try {
                let buffer_attach = await generareCanvas5(member, levelUps, leaderboardPosition, oldLevel);
                const attachment = new MessageAttachment(buffer_attach, 'image/levelback.png');

                levelUpChannel.send({content: `<a:ejgif1015:1241777034531831808> Congratulations <a:ejgif1016:1241777039564996640> ${member} <a:ejgif1035:1246168092438954076> You Have Now Leveled Up To <a:ejgif1034:1246101314224521248> **LEVEL ${levelUps}** <a:ejgif1034:1246101314224521248>`, files: [attachment] });
            } catch (error) {
                console.error('Error generating level up canvas:', error);
            }
        } else {
            console.error('Member not found in the guild.');
        }
    } else {
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM

/////////////////////////////////////////////////////////////////////////////////////////////////// RENAME MEMBER SYSTEM
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}rename-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('rename-member-button')
          .setStyle('SUCCESS')
          .setLabel('🌀 Change Your Name'),
        new MessageButton()
          .setCustomId('reset-name')
          .setStyle('PRIMARY')
          .setLabel('🔄 Reset Name'),
        new MessageButton()
          .setCustomId('log-name')
          .setStyle('SECONDARY')
          .setLabel('📝 Names Log')
      );

    const embed = new MessageEmbed()
      .setTitle('> <a:ejgif1036:1250132334502739979> Change Names <a:ejgif1006:1241743608617504788>')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn.discordapp.com/attachments/1144347868220620950/1246245561544216598/standard.gif?ex=665bb01f&is=665a5e9f&hm=77497b4341f26c4eb9a81d2c404dcee177540ee700f16729102fee33d3041952&")
      .setDescription(' **Rules Change Name** \n 1. Usernames must follow rules precisely.\n2. No offensive or inappropriate names allowed.\n3. Keep your name respectful and clean.\n4. Avoid using special characters excessively.\n5. Changing names frequently is discouraged.\n6. Admins can request name changes anytime.\n7. Names should be easy to read.\n8. Impersonation of others is strictly prohibited.')
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});

let lastRenamedTime = new Map(); // يتم تخزين آخر وقت استخدام لكل زر لكل مستخدم في هذه الخريطة

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      const currentTime = Date.now();
      const userId = interaction.user.id;
      const buttonId = interaction.customId;

      if (!lastRenamedTime.has(userId)) {
        lastRenamedTime.set(userId, new Map());
      }

      const userButtons = lastRenamedTime.get(userId);
      const lastTime = userButtons.get(buttonId);

      if (lastTime && currentTime - lastTime < 10000) {
        const remainingTime = Math.ceil((10000 - (currentTime - lastTime)) / 1000);
        interaction.reply({ content: `Please wait ${remainingTime} seconds to perform this action`, ephemeral: true });
        return;
      }

      userButtons.set(buttonId, currentTime);

      if (buttonId === 'rename-member-button') {
        await interaction.message.edit({ components: interaction.message.components });

        const modal = new Modal()
          .setCustomId('rename-member-modal')
          .setTitle('Change Your Name')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('rename-member-input')
                .setLabel('Enter Your New Name')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(32)
                .setPlaceholder('Enter The Name Here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      } else if (buttonId === 'reset-name') {
        const originalName = interaction.member.user.displayName;

        if (interaction.member.nickname === originalName) {
          interaction.reply({ content: `You are already using your original name.`, ephemeral: true });
        } else {
          const oldName = interaction.member.displayName;
          await interaction.member.setNickname(originalName);

          const newName = originalName;
          const currentTime = new Date();
          currentTime.setHours(currentTime.getHours() + 1);

          const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
          const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

          const logChannel = await client.channels.fetch(logChannelId);

          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> Reset Name Successfully')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addFields(
              { name: 'Old Name', value: `\`\`\`diff\n- ${oldName}\`\`\``, inline: true },
              { name: 'New Name', value: `\`\`\`diff\n+ ${newName}\`\`\``, inline: true },
              { name: '\u2003', value: `\u2003`, inline: false },
              { name: 'User ID', value: `\`\`\`${interaction.user.id}\`\`\``, inline: true },
              { name: 'Change Count', value: `\`\`\`${getNameChangeCount(interaction.user.id)}\`\`\``, inline: true },
              { name: '\u2003', value: `\u2003`, inline: false },
              { name: 'Time And Data', value: `\`\`\`${egyptianDate2}・${egyptianDate}\`\`\``, inline: true }
            );

          if (logChannel && logChannel.isText()) {
            logChannel.send({ embeds: [embed] });
          }

          interaction.reply({ content: `Your name has been reset to: ${originalName}`, ephemeral: true });
        }
      } else if (buttonId === 'log-name') {
        const logs = fs.existsSync('nameslog.json') ? JSON.parse(fs.readFileSync('nameslog.json')) : [];
        const userLogs = logs.filter(log => log.userId === interaction.user.id);

        if (userLogs.length === 0) {
          await interaction.reply({ content: "You have not performed any name change operations before.", ephemeral: true });
        } else {
          const chunkedLogs = chunkArray(userLogs, 10);

          for (let i = 0; i < chunkedLogs.length; i++) {
            const embed = new MessageEmbed()
              .setTitle(`Name Change Log (Page ${i + 1}/${chunkedLogs.length})`)
              .setColor('#2c2c34');

            chunkedLogs[i].forEach((log, index) => {
              embed.addField(`Change ${index + 1}`, `1. Old Name: ${log.oldName}\n2. New Name: ${log.newName}\n3. Time: ${log.timestamp}`);
            });

            await interaction.user.send({ embeds: [embed] });
          }

          await interaction.reply({ content: "I've sent you the name change log in DMs.", ephemeral: true });
        }
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-member-modal') {
        const oldName = interaction.member.displayName;
        const newName = interaction.fields.getTextInputValue('rename-member-input');

        if (newName.toLowerCase() === oldName.toLowerCase()) {
          interaction.reply({ content: `Your current name is already ${oldName}. Please enter a different name.`, ephemeral: true });
          return;
        }

        await interaction.member.setNickname(newName);
        logNameChange(interaction.member.id, oldName, newName);

        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);

        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        const logChannel = await client.channels.fetch(logChannelId);

        const embed = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Name Changed Successfully')
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
          .addFields(
            { name: 'Old Name', value: `\`\`\`diff\n- ${oldName}\`\`\``, inline: true },
            { name: 'New Name', value: `\`\`\`diff\n+ ${newName}\`\`\``, inline: true },
            { name: '\u2003', value: `\u2003`, inline: false },
            { name: 'User ID', value: `\`\`\`${interaction.user.id}\`\`\``, inline: true },
            { name: 'Change Count', value: `\`\`\`${getNameChangeCount(interaction.user.id)}\`\`\``, inline: true },
            { name: '\u2003', value: `\u2003`, inline: false },
            { name: 'Time And Data', value: `\`\`\`${egyptianDate2}・${egyptianDate}\`\`\``, inline: true }
          );

        if (logChannel && logChannel.isText()) {
          logChannel.send({ embeds: [embed] });
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request. Please try again later.\nNote: If you have higher permissions on the server than me, in this case, I will not have the ability to change your name.', ephemeral: true });
  }
});

function getNameChangeCount(userId) {
  let logs = [];
  if (fs.existsSync('nameslog.json')) {
    logs = JSON.parse(fs.readFileSync('nameslog.json'));
  }
  return logs.filter(log => log.userId === userId).length;
}
// Logging name changes to JSON file
function logNameChange(userId, oldName, newName) {
  const logEntry = {
    userId: userId,
    oldName: oldName,
    newName: newName,
    timestamp: new Date().toISOString()
  };

  let logs = [];
  if (fs.existsSync('nameslog.json')) {
    logs = JSON.parse(fs.readFileSync('nameslog.json'));
  }

  logs.push(logEntry);

  fs.writeFileSync('nameslog.json', JSON.stringify(logs, null, 2));
}

function chunkArray(array, chunkSize) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
}
/////////////////////////////////////////////////////////////////////////////////////////////////// RENAME MEMBER SYSTEM


// زيادة الحد الأقصى لعدد مستمعي الأحداث لعميل Discord
client.setMaxListeners(30); // تعيين العدد الذي ترغب فيه للحد الأقصى


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}report-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('report-server-modal')
          .setStyle('PRIMARY')
          .setLabel('📝 Send Report')
      );

    const embed = new MessageEmbed()
      .setTitle('> <a:ejgif1036:1250132334502739979> Submit A Report <a:ejgif1006:1241743608617504788>')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn.discordapp.com/attachments/1232668066069086248/1237501284551229511/E77wRD1KOLAfsd4tp6_standard.gif?ex=663be061&is=663a8ee1&hm=91a04116ef47ac24d61a2a8dea69fe3f2fa3c56d770a5122efe27ba470b3075a&")
      .setDescription(' **Rules Send Report** \n 1. Clearly state the violation observed. \n2. Provide relevant evidence, such as screenshots. \n3. Specify the time and location of the incident. \n4. Avoid using inflammatory language. \n5. Respect confidentiality and privacy concerns. \n6. Follow the server reporting guidelines. \n7. Await moderation team response patiently. \n8. Refrain from submitting false accusations.')
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'accept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '✅ Accepted';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    if (interaction.customId === 'unaccept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '❌ Reject';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

    // Check if the button is part of the voting system
    if (interaction.customId === 'report-server-modal') {
      const modal = new Modal()
        .setCustomId('report-server-modal')
        .setTitle('Send Report Message')
        .addComponents([
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('report-server-input')
              .setLabel('Report Title')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Report Title Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('2report-server-input')
              .setLabel('what Is The Report')
              .setStyle('PARAGRAPH')
              .setMinLength(1)
              .setMaxLength(4000)
              .setPlaceholder('Enter Report Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('3report-server-input')
              .setLabel('Image Link / Not Mandatory')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Image Link Here')
              .setRequired(false),
          ),
        ]);

      await interaction.showModal(modal);
    }
  }

if (interaction.isModalSubmit()) {
  if (interaction.customId === 'report-server-modal') {
    const response = interaction.fields.getTextInputValue('report-server-input');
    const response2 = interaction.fields.getTextInputValue('2report-server-input');
    const response3 = interaction.fields.getTextInputValue('3report-server-input');
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const userId = interaction.user.id;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    
    const embed2 = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> 📝 New Report')
      .setImage(`${response3}`)
      .setDescription(`**Report Title** \`\`\`${response}\`\`\` \n**Report Description** \`\`\`${response2}\`\`\``)
      .addFields(
          { name: 'Status', value: `⏳ Pending Review`, inline: true },
          { name: 'Report Since', value: `┕<t:${startTimestamp}:R>`, inline: true },
          { name: 'Report By', value: `<@${userId}>`, inline: true },
          { name: 'Report Data', value: `\`\`\`${egyptianDate2},${egyptianDate}\`\`\``, inline: true }
      );
    
    const accept_sug = new MessageButton()
        .setCustomId('accept_sug')
        .setLabel('Aceept')
        .setStyle('SUCCESS')

    const unaccept_sug = new MessageButton()
        .setCustomId('unaccept_sug')
        .setLabel('Reject')
        .setStyle('DANGER');
    
    const row1 = new MessageActionRow()
    .addComponents(accept_sug, unaccept_sug);

    // إرسال رسالة بصيغة Embed
    const embed = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> Your notification has been successfully sent to the administrators \n> Your report is being reviewed')

    interaction.reply({ embeds: [embed], ephemeral: true })
      .then(() => {
        // إرسال رسالة إلى القناة المحددة بصيغة Embed
        const channel = interaction.client.channels.cache.get(ServerReportChannelId);
        if (channel && channel.isText()) {
          channel.send({ embeds: [embed2], components: [row1] });
        } else {
          console.error('لا يمكن العثور على القناة أو القناة غير صالحة.');
        }
      })
      .catch(error => console.error('حدث خطأ في الرد:', error));
  }
}
});

client.on('messageCreate', async message => {
    // تأكد من أن الرسالة ليست من البوت
    if (message.author.bot) return;

    // تحقق مما إذا كان اسم البوت تم ذكره بشكل صحيح
    const botMentioned = message.mentions.users.has(client.user.id);

    if (botMentioned) {
        // إضافة السطر التالي لبدء الرمز "الكتابة"
        await message.channel.sendTyping();

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle(`My commands : \`${prefix}help\` or </help:1239056012434997341>`)

        // إرسال الـ embed إلى الشخص الذي قام بمنشن البوت
        message.reply({ embeds: [embed] });
    }
});




//testing code modal
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}suggestions-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('suggestions-modal')
          .setStyle('PRIMARY')
          .setLabel('🤝 Send Suggestions')
      );

    const embed = new MessageEmbed()
      .setTitle('> <a:ejgif1025:1241780888245633147> Write Suggestions <a:ejgif1032:1242349755728789504>')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn.discordapp.com/attachments/1144347868220620950/1242780401446158366/standard.gif?ex=664f14f1&is=664dc371&hm=e2d3bf4612c90170f8327601c1487510b79c1e4741aea0ba73c6f26211216402&")
      .setDescription("**Rules Send Suggestion**\n 1. Respect others: Be polite and considerate.\n2. Ensure safety: Avoid harm or risk.\n3. Follow laws: Respect legal requirements.\n4. Add value: Provide meaningful contributions.\n5. Be transparent: Clearly state sources if available.\n6. Embrace diversity: Foster diverse perspectives.\n7. Stay organized: Present ideas clearly.\n8. Respond politely: Recognize every idea. \n\n<a:ejgif1033:1242349759298015334> **Developer BOT** <@803873969168973855> <a:ejgif1020:1241777050377781249>")
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});

const votedMembersPerMessage = new Map();
const votedMembers = new Set();
const reportedMembersPerMessage = new Map();
const reportedMembers = new Set();
let votedEmbedIds = new Set();
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'accept_sug22') {
            // Check if the user has the required role or admin permissions
            const requiredRoles = ['1221886968019812443'];
            const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
            const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!isAdmin && !hasRequiredRole) {
                return interaction.reply({ content: 'You do not have permission to perform this action.', ephemeral: true });
            }

            // Modify the Embed
            const embed = interaction.message.embeds[0];
            embed.fields.find(field => field.name === 'Status').value = '✅ Accepted';

            // Disable the button after clicking it
            interaction.component.setDisabled(true);

            // Resend the message with the modifications and update the button
            await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

            // Send a message to the log channel
            const suggestionChannel = interaction.guild.channels.cache.get(logChannelId);
            if (suggestionChannel) {
                const suggestedBy = interaction.user;
                const sourceMessage = interaction.message;
                let currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 1);
                const startTimestamp = Math.floor(Date.now() / 1000) - 32;
                const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
                const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
                const acceptEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00') // Green color
                    .setTitle(`> This suggestion has been accepted`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'Suggestion accepted by', value: `┕${suggestedBy}`, inline: true },
                        { name: 'Date of suggestion acceptance', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'Elapsed time since', value: `┕<t:${startTimestamp}:R>`, inline: true },
                        { name: 'Accepted suggestion', value: `[Suggestion Link](${sourceMessage.url})┕`, inline: true },
                    );

                suggestionChannel.send({ embeds: [acceptEmbed] });
            }
        }
    if (interaction.customId === 'unaccept_sug22') {
    // Checking if the user has the required role
    const requiredRoles = ['1221886968019812443'];
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

    if (!isAdmin && !hasRequiredRole) {
        return interaction.reply({ content: "Sorry, you don't have permission to perform this action.", ephemeral: true });
    }

    // Modifying the Embed
    const embed = interaction.message.embeds[0];
    embed.fields.find(field => field.name === 'Status').value = '❌ Rejected';

    // Disabling the button after it's been clicked
    interaction.component.setDisabled(true);

    // Resending the message with the modifications and updating the button
    await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

    // Sending a message to the log channel
    const suggestionChannel = interaction.guild.channels.cache.get(logChannelId);
    if (suggestionChannel) {
        const suggestedBy = interaction.user;
        const sourceMessage = interaction.message;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
        const unacceptEmbed = new Discord.MessageEmbed()
             .setColor('#FF0000') // Red color
             .setTitle(`> This suggestion has been rejected`)
             .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
             .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
             .addFields(
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'Suggestion rejected by', value: `┕${suggestedBy}`, inline: true },
                 { name: 'Date of suggestion rejection', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'Time elapsed since the operation', value: `┕<t:${startTimestamp}:R>`, inline: true },
                 { name: 'Rejected suggestion', value: `[Suggestion Link](${sourceMessage.url})┕`, inline: true },
             );


        suggestionChannel.send({ embeds: [unacceptEmbed] });
    }
}


      
      

      // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

      // Check if the button is part of the voting system    
if (interaction.customId === 'like_sug' || interaction.customId === 'dis_sug') {
        // تحقق مما إذا كانت الرسالة موجودة في الخريطة
        if (!votedMembersPerMessage.has(interaction.message.id)) {
          // إذا لم تكن موجودة، قم بإضافة مفتاح الرسالة مع مجموعة جديدة لتتبع الأعضاء الذين قاموا بالتصويت
          votedMembersPerMessage.set(interaction.message.id, new Set());
        }

        // استخدم مجموعة الأعضاء المحددة للرسالة الحالية
        const votedMembers = votedMembersPerMessage.get(interaction.message.id);

        // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا
        if (votedMembers.has(interaction.user.id)) {
          return interaction.reply({ content: 'You have already voted.', ephemeral: true });
        } else {
          // إذا لم يكن قد قام بالتصويت، قم بإضافة معرف العضو إلى مجموعة الأعضاء المصوتين
          votedMembers.add(interaction.user.id);
        }
      }
if (interaction.customId === 'like_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'Likes');
    const currentLikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👍 ${currentLikes + 1}\``; // Update the number of likes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.id;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
        .setColor('#00FF00') // Green color
        .setTitle(`> This Suggestion Was Reacted To`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'Interacted By', value: `┕<@${votedMember}>`, inline: true },
            { name: 'Interaction History', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: `\u2003`, value: `\`\`\`diff\n+👍 ${currentLikes + 1} current interactions\`\`\``, inline: false },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'Interaction since', value: `┕<t:${startTimestamp}:R>`, inline: true },
            { name: 'Source Of Interaction', value: `┕[Suggestion link](${sourceMessage.url})`, inline: true },
        );

    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'dis_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'Dislikes');
    const currentDislikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👎 ${currentDislikes + 1}\``; // Update the number of dislikes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.tag;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
        .setColor('#FF0000') // Red color
        .setTitle(`> This Suggestion Was Reacted To`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'Interacted By', value: `┕${votedMember}`, inline: true },
            { name: 'Interaction History', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: `\u2003`, value: `\`\`\`diff\n-👎 ${currentDislikes + 1} current interactions\`\`\``, inline: false },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'Interaction since', value: `┕<t:${startTimestamp}:R>`, inline: true },
            { name: 'Source Of Interaction', value: `┕[Suggestion link](${sourceMessage.url})`, inline: true },
        );

    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'suggestions-modal') {
    const modal = new Modal()
        .setCustomId('suggestions-modal')
        .setTitle('Send a Suggestion or Feedback?')
        .addComponents([
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('suggestions-input')
                    .setLabel('What is the title of your suggestion?')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setPlaceholder('Write the title of your suggestion here')
                    .setRequired(true),
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('2suggestions-input')
                    .setLabel('What is the idea behind the suggestion?')
                    .setStyle('PARAGRAPH')
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setPlaceholder('Write the idea of your suggestion here')
                    .setRequired(true),
            ),
        ]);

    await interaction.showModal(modal);
}
}
if (interaction.isModalSubmit()) {
    if (interaction.customId === 'suggestions-modal') {
        const response = interaction.fields.getTextInputValue('suggestions-input');
        const response2 = interaction.fields.getTextInputValue('2suggestions-input');
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const userId = interaction.user.id;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        const embed2 = new MessageEmbed()
            .setColor('#2c2c34')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('> 📝 New Suggestion')
            .setDescription(`**Suggestion Title** \`\`\`${response}\`\`\` \n**Suggestion Idea** \`\`\`${response2}\`\`\``)
            .addFields(
                { name: 'Status', value: `⏳ Under Review`, inline: true },
                { name: 'Date of Suggestion Submission', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                { name: 'Suggestion Submitted By', value: `<@${userId}>`, inline: true },
                { name: 'Suggestion Duration', value: `┕<t:${startTimestamp}:R>`, inline: true },
                { name: 'Likes', value: `┕\`👍 0\``, inline: true },
                { name: 'Dislikes', value: `┕\`👎 0\``, inline: true }
            );

        const accept_sug = new MessageButton()
            .setCustomId('accept_sug22')
            .setLabel('Accept')
            .setStyle('SUCCESS');

        const unaccept_sug = new MessageButton()
            .setCustomId('unaccept_sug22')
            .setLabel('Reject')
            .setStyle('DANGER');

        const like = new MessageButton()
            .setCustomId('like_sug')
            .setLabel('👍')
            .setStyle('PRIMARY');

        const unlike = new MessageButton()
            .setCustomId('dis_sug')
            .setLabel('👎')
            .setStyle('SECONDARY');

        const report_sug = new MessageButton()
            .setCustomId('report-modal22')
            .setLabel('Report Suggestion')
            .setStyle('DANGER');

        const row1 = new MessageActionRow()
            .addComponents(accept_sug, unaccept_sug, like, unlike, report_sug);

        // Send a message in Embed format
        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> The Proposal Has Been Sent')
            .setDescription(`Your Suggestion Has Been Sent Here <#${suggestionschannel}>`)

        interaction.reply({ embeds: [embed], ephemeral: true })
            .then(() => {
                // Send a message to the specified channel in Embed format
                const channel = interaction.client.channels.cache.get(suggestionschannel);
                if (channel && channel.isText()) {
                    channel.send({ embeds: [embed2], components: [row1] });
                } else {
                    console.error('Unable to find the channel or the channel is invalid.');
                }
            })
            .catch(error => console.error('An error occurred while replying:', error));
    }
}

});







//rename ticket
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === 'rename-ticket-button') {
        // Check claim permission
        if (!hasClaimPermission(interaction.member)) {
          await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
          return;
        }

        // Disable the button
        interaction.message.components.forEach(row => {
          row.components.forEach(comp => {
            if (comp.customId === 'rename-ticket-button') {
              comp.setDisabled(true);
            }
          });
        });
        await interaction.message.edit({ components: interaction.message.components });

        // Create and display the modal window
        const modal = new Modal()
          .setCustomId('rename-ticket-modal')
          .setTitle('Rename Ticket')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('rename-ticket-input')
                .setLabel('Enter the new ticket name')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(15)
                .setPlaceholder('Enter the name here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const response = interaction.fields.getTextInputValue('rename-ticket-input');

        if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
          // Get the previous ticket name
          const oldTicketName = interaction.channel.name;
          
          // Change the channel name
          await interaction.channel.setName(response);
          
          // Create and send an Embed privately
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> Ticket name changed successfully')
            .addFields(
              { name: 'Old Ticket Name', value: `\`\`\`diff\n- ${oldTicketName}\`\`\``, inline: true },
              { name: 'New Ticket Name', value: `\`\`\`diff\n+ ${response}\`\`\``, inline: true }
            );
          
          interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          interaction.reply({ content: "I don't have permission to rename channels!", ephemeral: true });
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
  }
});




let ticketOpenerId;
client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticketpanel') {
        const ticketOpenerId = message.author.id;   
        const selectMenuOptions = [
            {
                label: 'Buy Robux',
                value: 'ticket_1',
                description: 'Buy Robux In Roblox Game.',
                emoji: '<:G7:1151244037517488159>'
            },
            {
                label: 'Buy UC For PUBG MOBILE',
                value: 'ticket_2',
                description: 'Buy UC in PUBG Mobile Game.',
                emoji: '<:pubgmobile:1102769748518916146>'
            },
            {
                label: 'Buy Project Bot Discord',
                value: 'ticket_3',
                description: 'Purchase Bot Projects Or Code.',
                emoji: '<:921703781027184660:1089615608154431579>'
            },
            {
                label: 'Photoshop Designer',
                value: 'ticket_4',
                description: 'Creating Designs Or Backgrounds',
                emoji: '🖼'
            },
            {
                label: 'Editing Discord Server',
                value: 'ticket_5',
                description: 'Modifying Organizing Discord Servers.',
                emoji: '📈'
            },
            {
                label: 'Support Team',
                value: 'ticket_6',
                description: 'Talk To The Management Staff',
                emoji: '<:911751899324239902:1089615602471141416>'
            },
        ];
        const selectMenu = new MessageSelectMenu()
            .setCustomId('ticket_panel')
            .setPlaceholder('🎫 Please Choose The Specialty You Desire')
            .addOptions(selectMenuOptions);

        const row = new MessageActionRow().addComponents(selectMenu);

        const embed = new MessageEmbed()
            .setColor("#2c2c34")
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
            .setImage("https://cdn.discordapp.com/attachments/1232668066069086248/1237039352215896165/4zxP.gif?ex=663a322c&is=6638e0ac&hm=eea5de860d3c7af67053d5f9c0874daf0db49c60c2efc41b0df58396581b469d&")
            .setTitle(`<a:ejgif1004:1241743499678973952> Welcome To Server __${message.guild.name}__ <a:ejgif1032:1242349755728789504>`)
            .setDescription(`<a:ejgif1001:1241743492032757852> Please Choose The Section You Want \n<a:ejgif1001:1241743492032757852> You Will Be Answered As Quickly As Possible \n\n <a:ejgif1033:1242349759298015334> **Developer BOT** <@803873969168973855> <a:ejgif1018:1241777044296171650>`);

        message.channel.send({ embeds: [embed], components: [row] });
    }
});





// Counter for ticket numbers
let ticketCounter = 1;
const userTickets = new Map();

// Define a set to store roles with permission to claim
const claimPermissions = new Set();

// Function to check if a member has permission to claim
function hasClaimPermission(member) {
    return member.roles.cache.some(role => claimPermissions.has(role.id));
}

// Add roles with permission to claim
claimPermissions.add(claimPermissionRoleId);
// Add more roles as needed



// Map to store user ticket count
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu() && !interaction.isButton()) return;

    const { member, guild } = interaction;

   // استدعاء الدالة المناسبة بناءً على customId
    switch (interaction.customId) {
        case 'msg_control':
            await handleMsgControl(interaction, hasClaimPermission);
            break;
        case 'addmem_kikmem':
            await handleAddMemKikMem(interaction, hasClaimPermission);
            break;
        case 'msg_sendcontrol':
            await handleMsgSendControl(interaction, hasClaimPermission);
            break;
        case 'sendmemberid':
            await handleSendMemberId(interaction, hasClaimPermission);
            break;
        case 'sendmsgembed':
            await handleSendMsgEmbed(interaction, hasClaimPermission);
            break;
        case 'sendmsgdisabled':
            await handleSendMsgDisabled(interaction, hasClaimPermission);
            break;
        case 'sendmsgpost':
            await handleSendMsgPost(interaction, hasClaimPermission); // استدعاء دالة لإرسال رسالة عادية
            break;
        case 'msgdeleted':
            await handleMsgDeleted(interaction, hasClaimPermission);
            break;
        case 'add_note':
            await handleAddNote(interaction, hasClaimPermission); // تأكد من تمرير دالة التحقق من الصلاحية هنا
            break;
        case 'sendowntick':
            await handleSendOwnTick(interaction, hasClaimPermission); // Call the function for handling sendowntick interaction
            break;
        case 'claim_ticket':
            await handleClaimTicket(interaction, hasClaimPermission);
            break;
        case 'transscript':
            await handleTranscript(interaction, guild); // قم بتمرير ال guild الخاص بك هنا
            break;
    }
  


// دالة لإرسال رسالة بـ Embed
async function sendEmbedMessage(interaction, content) {
    // إنشاء الـ Embed بناءً على النص المستلم
    const embed = {
        description: content,
        color: "#2c2c34", // يمكنك تعيين اللون كما تشاء
    };
    await interaction.channel.send({ embeds: [embed] });
}

// دالة لإرسال رسالة عادية
async function sendMessage(interaction, content) {
    await interaction.followUp({ content: content, ephemeral: true });
}


// التحقق من الضغط على زر "cancel_close"
if (interaction.customId === 'cancel_close') {
    // حذف الرسالة
    await interaction.deleteReply();
    // لاحظ أنه بعد حذف الرسالة، لن يكون هناك شيء للرد عليه
    return;
}

// إذا كان الضغط على زر "close_id_note" ولم يكن "cancel_close"
if (interaction.customId === 'close_id_note') {
    // Send a message to confirm closure
    const message = await interaction.reply({
        content: 'Are you sure you want to close this ticket?',
        ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('confirm_close').setLabel('Close').setStyle('DANGER'),
                new MessageButton().setCustomId('cancel_close').setLabel('Cancel').setStyle('SECONDARY')
            )
        ]
    });

    // Respond to the button to cancel
    const filter = i => i.customId === 'cancel_close';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        await i.deferUpdate(); // You can use this if you're using older buttons.
        await interaction.deleteReply(); // Delete the message
    });

    collector.on('end', async () => {
        if (!message.deleted) await message.delete().catch(console.error); // Make sure to delete the message in case the button press event doesn't occur
    });
} else if (interaction.customId === 'confirm_close') {
    try {
        // Defer the interaction to avoid timeout
        await interaction.deferUpdate();

        // Send a loading message
        const loadingMessage = await interaction.followUp({ embeds: [new MessageEmbed().setDescription('**Loading... Please wait**').setColor('#2c2c34')] });

        // Delay the display of the embed for 3 seconds
        setTimeout(async () => {
            // Delete the loading message
            await loadingMessage.delete();

            // Remove permissions and send the embed
            const channel = interaction.channel;
            const permissionOverwrites = channel.permissionOverwrites.cache.filter(overwrite => overwrite.type === 'member');
            const mentionList = [];

            for (const overwrite of permissionOverwrites.values()) {
                const member = await channel.guild.members.fetch(overwrite.id);
                if (!member.permissions.has('ADMINISTRATOR')) {
                    await overwrite.delete();
                    mentionList.push(`<@${member.id}>`);
                }
            }

            const mentionListFormatted = mentionList.map((mention, index) => `${index + 1}. ${mention}`);
            const mentionListString = mentionListFormatted.join('\n');
            const closedEmbed = new MessageEmbed()
                .setColor('#2c2c34')
                .setTitle('> 🔒 This ticket is closed')
                .setDescription(`This ticket has been closed by: ${interaction.member}\n The person who opened the ticket closed it. Do you want to delete it?\n\nTicket hidden from:\n${mentionListString}`);

            const deleteButton = new MessageButton()
                .setCustomId('delete_ticket')
                .setLabel('⛔ Delete Ticket')
                .setStyle('DANGER');

            const row = new MessageActionRow().addComponents(deleteButton);

            await channel.send({ embeds: [closedEmbed], components: [row] });

            // Append "-closed" to the channel name if not already present
            if (!channel.name.includes('-closed')) {
                await channel.setName(`${channel.name}-closed`);
            }

            // Get all messages in the channel
            const messages = await channel.messages.fetch({ limit: 100 });
            const ticketMessages = messages.map(message => `Author: ${message.author.tag} | Content: ${message.content}`).join('\n');

            // Add mention and ticket name before writing ticket messages to a text file
            const ticketName = channel.name.replace('-closed', '');
            const mention = `<@${interaction.member.id}>`;
            const finalContent = `${ticketMessages}`;

            // Write ticket messages to a text file
            fs.writeFileSync('ticket_messages.txt', finalContent);

            // Send the text file in the specified room
            const fileBuffer = fs.readFileSync('ticket_messages.txt');
            const attachment = new MessageAttachment(fileBuffer, 'ticket_messages.txt');
            const destinationChannel = interaction.guild.channels.cache.get(TicketSaveChannelId);
            await destinationChannel.send({ content: `Ticket closed by: ${mention}\nTicket Name: \`${ticketName}\``, files: [attachment] });

            // Delete the text file
            fs.unlinkSync('ticket_messages.txt');
        }, 1000);

        // Reply to the interaction confirming the ticket closure
        await interaction.followUp({ content: `> **Ticket closed** \n > **${interaction.member}**: Ticket closed by`, ephemeral: true });
    } catch (error) {
        console.error('Error handling confirm_close button:', error.message);
        await interaction.followUp({ content: 'Failed to process the request.', ephemeral: true });
    }
}

  const mentionList = [];
if (interaction.customId === 'delete_ticket') {
    // حذف التذكرة إذا تم النقر على زر "delete ticket"
    const channel = interaction.channel;
    try {
        await channel.delete();
    } catch (error) {
        console.error('Error deleting ticket:', error.message);
    }
}

  
  

  
    const selectedOption = interaction.values[0]; // القيمة المحددة من القائمة

    // ابحث عن الخيار المحدد في selectMenuOptions
    const selectedDepartment = selectMenuOptions.find(option => option.value === selectedOption);

    if (!selectedDepartment) return;




  
  

const ticketType = selectedOption.split('_')[1]; // يستخرج نوع التذكرة من القيمة المحددة في القائمة المنسدلة
const categoryID = categoryIDs[selectedOption]; // يحدد معرف الفئة بناءً على القيمة المحددة في القائمة المنسدلة

/*/
if (userTickets.has(member.id) && userTickets.get(member.id) >= 3) {
    await interaction.reply({ content: 'You have already opened three tickets.', ephemeral: true });
    return;
}
/*/
const ticket_open_member = member.id;
const channel = await guild.channels.create(`${selectedDepartment.label}-${ticketCounter}`, {
    type: 'text',
    permissionOverwrites: [
        {
            id: guild.roles.everyone,
            deny: ['VIEW_CHANNEL']
        },
        {
            id: member.id, //صلحية الشخص اللي بيفتح 
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
        },
        {
            id: client.user.id, // صلحية البوت اللي هتكون في التيكت
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
        },
        {
            id: selectedDepartment.roleticketid, //صلحيات الرولات اللي هتكون في التيكت
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
        }
    ],
    parent: categoryID
  
});

// قم بتعديل الرسالة الراجعة لتحتوي على الزر
const replyMessage = `✔ Ticket Created <#${channel.id}> Ticket Number \`${ticketCounter}\``;

// قم بإنشاء صف واحد يحتوي على زر واحد
const row = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setLabel('🔗 Ticket Link')
			.setStyle('LINK') // يجعل الزر يفتح رابطًا
			.setURL(`https://discord.com/channels/${guild.id}/${channel.id}`)
	)

// قم بإنشاء صف واحد يحتوي على زر واحد

let currentTime = new Date();
currentTime.setHours(currentTime.getHours() + 1);
const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
const startTimestamp = Math.floor(Date.now() / 1000) - 42;
let count = channelCounts.get(channel.parentId) || 0;
count++;
const user = member.user;
await interaction.reply({ content: replyMessage, components: [row], ephemeral: true });
const embed = new MessageEmbed()
    .setTitle(`> Welcome to ${member.guild.name} server`)
    .setDescription(`\`\`\`diff\n! ✅ Please State Reason For Opening The Ticket ✅ !\n! ✅ Please Wait, You Will Be Respon To Shortly ✅ !\`\`\``)
    .setColor('#1c1c24')
    .addFields(
        { name: 'Ticket Creator', value: `<@${ticket_open_member}>`, inline: true },
        { name: 'Requested Support', value: `${selectedDepartment.rolesupport}`, inline: true },
        { name: 'Claimed By', value: `__Not Found__`, inline: true },
        { name: 'Department', value: `\`\`\`${selectedDepartment.label}\`\`\``, inline: true },
        { name: 'Ticket Date', value: `\`\`\`${egyptianDate}\`\`\``, inline: true },
        { name: 'Name', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
        { name: 'Ticket Since', value: `┕<t:${startTimestamp}:R>`, inline: true },
        { name: 'Discord Join Date', value: `┕<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Server Join Date', value: `┕<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
    );
  
    const closeButton = new MessageButton()
        .setCustomId('close_id_note')
        .setLabel('🔒 Close')
        .setStyle('DANGER');

    const renameButton = new MessageButton()
        .setCustomId('rename-ticket-button')
        .setLabel('🔄 Rename')
        .setStyle('PRIMARY');

    const addMemberButton = new MessageButton()
        .setCustomId('addmem_kikmem')
        .setLabel('👥 Member Control')
        .setStyle('PRIMARY');

    const transcButton = new MessageButton()
        .setCustomId('transscript')
        .setLabel('📜 Transcript')
        .setStyle('PRIMARY');

    const claimButton = new MessageButton()
        .setCustomId('claim_ticket')
        .setLabel('🔖 Claim')
        .setStyle('SUCCESS');

    const noteButton = new MessageButton()
        .setCustomId('addnote-ticket-button')
        .setLabel('📌 Add Note')
        .setStyle('PRIMARY');

    const msgcontrolButton = new MessageButton()
        .setCustomId('msg_control')
        .setLabel('🛠️ Message Control')
        .setStyle('PRIMARY');

    const tikrepButton = new MessageButton()
       .setCustomId('ticket_rep')
       .setLabel('📝 Report')
       .setStyle('PRIMARY');
  
    const row1 = new MessageActionRow()
    .addComponents(closeButton, transcButton, addMemberButton, claimButton);
    const row2 = new MessageActionRow()
    .addComponents(tikrepButton, renameButton, msgcontrolButton, noteButton);
    channel.send({ content: `**||${member} - ${selectedDepartment.rolesupport}||**`, embeds: [embed], components: [row1, row2] });

    ticketCounter++;

    if (userTickets.has(member.id)) {
        userTickets.set(member.id, userTickets.get(member.id) + 1);
    } else {
        userTickets.set(member.id, 1);
    }
});
const channelCounts = new Map();















client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor(`#2c2c34`)
      .setTitle(`> ${rule.title}`)
      .setDescription(text)
    const message = await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
    
    // Add reaction directly to the replied message
  }
});


let tracker = "10";
  tracker = new inviteTracker(client);
	// "guildMemberAdd"  event to get full invite data
tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {
  const startTimestamp = Math.floor(Date.now() / 1000) - 28;
  const memberCount = member.guild.memberCount;
  
  // return when get error
  if(error) return console.error(error);
  
  // get the channel
  let channel = member.guild.channels.cache.get(welcomeLogChannelId);
  
  let welcomeMessage = {
    color: "#2c2c34",
    title: "New Member Joined",
    description: `1. New member joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`,
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({ size: 4096 }),
    },
  };

  // change welcome message when the member is bot
  if (member.user.bot) {
    welcomeMessage.description = `1. New bot joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`;
  }

  // send welcome message
  channel.send({ embeds: [welcomeMessage] });
});

// وظيفة لتقسيم مصفوفة إلى مجموعات
function chunkArray2(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}





client.on('guildMemberAdd', async member => {
  
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let buffer_attach =  await generareCanvas(member)
    const attachment = new MessageAttachment(buffer_attach, 'welcome.png')

  
    const fourSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel(" RA'AD Server ")
        .setURL('https://dsc.gg/kn-server'); // رابط موقع الـ 4 SEASON
  
    const botSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel("ㅤMy BOTㅤ")
        .setURL('https://pro-tax.netlify.app'); // رابط موقع الـ 4 SEASON

    const instaButton = new MessageButton()
        .setStyle('LINK')
        .setLabel('ㅤInstagramㅤ')
        .setURL('https://www.instagram.com/ahm.depression'); // رابط موقع الـ 4 SEASON


    const buttonRow = new MessageActionRow()
        .addComponents([instaButton, fourSeasonButton, botSeasonButton]);

    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle(`> <:ejpic1008:1241773699544252447> Welcome To __${member.guild.name}__ Server <:ejpic1001:1241773680556507267>`)
        .setDescription(`**<:ejpic1015:1241773719123267645> Happy to have you with us here.\n<:ejpic1015:1241773719123267645> We wish you a happy day \n\n**`)
        .addFields(
            { name: '**1. Rules Server**', value: `<#1144343379505860741>`, inline: true },
            { name: '**1. Reaction Roles**', value: `<#1144343379505860741>`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true },
            { name: '**3. Joined Discord**', value: `**<t:${startTimestamp}:R>**`, inline: true },
            { name: '**2. Joined Server**', value: `**\`\`${egyptianDate}\`\`**`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true }
          )    
        .setImage("attachment://welcome.png")
        .setThumbnail("https://cdn.discordapp.com/attachments/1241270976021528637/1242353887332007967/image.png?ex=664d87b8&is=664c3638&hm=580b0f727d1fea2955bf58ffee33256937a68194fc4dcecd5e32d463f416ca23&");

        member.send({ embeds: [embed], files: [attachment],  components: [buttonRow] })
        .catch(console.error);
});
tracker = new inviteTracker(client);
// "guildMemberAdd"  event to get full invite data
tracker.on('guildMemberAdd', async (member, inviter, invite, error) => {
  if(error) return console.error(error);
  let buffer_attach =  await generareCanvas(member)
  const attachment = new MessageAttachment(buffer_attach, 'image/welcomeback.png')
  const startTimestamp = Math.floor(Date.now() / 1000) - 42;
  const memberCount = member.guild.memberCount;

  let embed = new MessageEmbed()
    .setTitle(`> <:ejpic1008:1241773699544252447> Welcome To __${member.guild.name}__ Server <:ejpic1001:1241773680556507267>`)
    .addFields(
      { name: '<:ejpic1011:1241773707542659224> Welcome', value: `${member.user}`, inline: true },
      { name: '<:ejpic1014:1241773715801509909> Invited By', value: `<@!${inviter.id}>`, inline: true },
      { name: '<:ejpic1005:1241773691591987410> Rules', value: `<#1144343379505860741>`, inline: true },
      { name: '<:ejpic1010:1241773705189658746> User ID', value: `\`\`${member.user.id}\`\``, inline: true },
      { name: '<:ejpic1003:1241773685891666051> Member Count', value: `\`\`${memberCount}\`\``, inline: true },
      { name: '<:ejpic1002:1241773683249254523> Invite Number', value: `\`\`${invite.count}\`\``, inline: true },
      { name: '<:ejpic1009:1241773702471880785> Joined Server', value: `<t:${startTimestamp}:R>`, inline: true },
      { name: '<:ejpic1015:1241773719123267645> Joined Discord', value: `<t:${Math.floor(member.user.createdAt / 1000)}:R>`, inline: true },
      { name: '<:ejpic1006:1241773694477668473> Member User', value: `\`\`${member.user.username}\`\``, inline: true },
      { name: '<:ejpic1007:1241773697036193902> Server Support', value: `[Click Here](https://dsc.gg/clipper-tv)`, inline: true },
      { name: '<:ejpic1012:1241773710910816256> Instagram', value: `[Click Here](https://www.instagram.com/ahm.depression/reels)`, inline: true },
      { name: '<:ejpic1012:1241773710910816256> Twitter', value: `[Click Here](https://twitter.com/ahm_depression)`, inline: true }
    )
    .setColor('#2F3136')
    .setImage('attachment://welcomeback.png');

  const welcomeChannel = member.guild.channels.cache.get(welcomeRoomId);
  if (welcomeChannel) {
    welcomeChannel.send({ content: `||${member.user}||`, embeds: [embed], files: [attachment] });
  } else {
    console.error(`Welcome channel not found with ID: ${welcomeRoomId}`);
  }
});


async function generareCanvas(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/welcomeback.png") // استخدام اسم الملف المحلي مباشرة هنا
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  let canvas = new Canvas(1400, 514)
    .printImage(background, 0, 0, 1400, 514)
    .setColor("#FFFFFF")
  /*
    .printCircle(267, 259, 149)
    */
    .printCircularImage(avatar, 266, 256, 150)
    .setTextAlign('justify')
    .setTextFont('25px Discord')
    .printText(`${member.guild.name} - SERVER COMMUNITY`, 524, 395)
    .setTextAlign("center")
    .setColor("#FFFFFF")
    .setTextFont('30px Discordx')
    .printText(`${name}`, 790, 340)
    // Adding "bot by ahmed" text above the image
  /*
    .setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> Developer BOT Ahmed Clipper', 160, 25);
    // Adding "insta" text below the line
  canvas.setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> instagram : ahm.depression', 150, 60);
    */
  return canvas.toBufferAsync()
}


client.on('messageCreate', async message => {
    if (message.content === `${prefix}profile`) {
        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **Creating Your Profile Card...**");
        await message.channel.sendTyping();

        const guild = message.guild;
        let buffer_attach = await generareCanvas2(message.member); // افترض أن generareCanvas هي الدالة التي تنشئ الصورة
        const attachment = new MessageAttachment(buffer_attach, 'image/profile.png');

        // حذف الرسالة السابقة وتحديثها بالصورة المنشأة
        await creatingCardMessage.delete();
        message.reply({ content: `> <a:ejgif1033:1242349759298015334> **ملاحظة : هذا الأمر لم يكتمل بعد، ومازال قيد التطوير** <a:ejgif1032:1242349755728789504>`, files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد
    }
});
async function generareCanvas2(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/profile.png")
  const background2 = await resolveImage("image/backprofile.png")
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  
  // تواريخ الانضمام بالإنجليزية
  const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })

  let canvas = new Canvas(378, 536)
    .printImage(background2, 0, 0, 378, 536)
    .printImage(background, 0, 0, 378, 536)
    .setColor("#232328")
    .printCircle(100, 140, 53)
    .printCircularImage(avatar, 100, 140, 45)
    .setColor("#232328")
    .printCircle(130, 170, 15)
    // MEMBER SINCE
    .setTextAlign('ltr')
    .setColor("#FFFFFF")
    .setTextFont('14px Discord')
    .printText(`MEMBER SINCE`, 65, 430)
    // تاريخ الانضمام إلى السيرفر
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceServerEnglish}`, 213, 460)
    // تاريخ الانضمام إلى ديسكورد
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceDiscordEnglish}ㅤ・ㅤ`, 95, 460)
    // اسم العضو
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('15px Discordx')
    .printText(`${name}`, 65, 230)

  const badge03 = await resolveImage(__dirname + "/image/badge03.png")
  canvas.printImage(badge03, 301, 165, 30, 30)
  
  const badge05 = await resolveImage(__dirname + "/image/badge05.png")
  canvas.printImage(badge05, 275, 165, 30, 30)
  
  const badge01 = await resolveImage(__dirname + "/image/badge01.png")
  canvas.printImage(badge01, 248, 165, 30, 30)  
  
  const badge06 = await resolveImage(__dirname + "/image/badge06.png")
  canvas.printImage(badge06, 221, 165, 30, 30)  
  
  const discordjoin = await resolveImage(__dirname + "/image/discordjoin.png")
  canvas.printImage(discordjoin, 65, 445, 25, 25)  
  
  const serverjoin = await resolveImage(__dirname + "/image/serverjoin2.png")
  canvas.printImage(serverjoin, 182, 445, 25, 25)  
  /*
  const online01 = await resolveImage(__dirname + "/image/online01.png")
  canvas.printImage(online01, 130, 170, 13, 13) 
  */
  const idle02 = await resolveImage(__dirname + "/image/dnd03.png")
  canvas.printImage(idle02, 122, 162, 17, 17) 
  

  return canvas.toBufferAsync()
}





async function generateCanvas3(member, level, xp, leaderboardPosition) {
    const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
    const background = await resolveImage(`image/${rankbanner}`);
    const { weirdToNormalChars } = require('weird-to-normal-chars');
    const name = weirdToNormalChars(member.user.username);

    // تواريخ الانضمام بالإنجليزية
    const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });

    let canvas = new Canvas(900, 650)
        .printImage(background, 0, 0, 900, 650)
        .setColor("#232328")
        .printCircularImage(avatar, 449, 325, 90  )
        .setColor("#232328")
        // اسم العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${name}`, 450, 108)
        // xp العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${xp}/1011`, 250, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`XP`, 250, 510)
        // لفل العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${level}`, 650, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`Level`, 650, 510)
        // تصنيف العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`#${leaderboardPosition}`, 450, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`Classification`, 450, 510);

    return canvas.toBufferAsync();
}


const cooldowns = new Map();
client.on('messageCreate', async message => {
    if (message.content === `${prefix}rank`) {
        const authorId = message.author.id;

        // تحقق مما إذا كان المستخدم في فترة الانتظار
        if (cooldowns.has(authorId)) {
            const cooldownTime = cooldowns.get(authorId);
            const remainingTime = (cooldownTime - Date.now()) / 1000;
            const warningMessage = await message.reply(`Please wait ${remainingTime.toFixed(1)} seconds before using this command again.`);
            
            // حذف الرسالة بعد 5 ثواني
            setTimeout(() => warningMessage.delete(), 3000);
            return;
        }

        const userData = getUserData(authorId);

        if (!userData) {
            message.reply('You have not gained any XP yet.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(authorId);

        // بدء عملية الكتابة (Typing)
        message.channel.sendTyping();

        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **Creating Your Profile Card...**");

        // إنشاء الصورة
        let buffer_attach = await generateCanvas3(message.member, level, xp, leaderboardPosition);
        const attachment = new MessageAttachment(buffer_attach, `image/${rankbanner}`);

        // تحديث الرسالة السابقة بالصورة المنشأة
        await creatingCardMessage.edit({ content: '\u2003', files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد

        // إضافة المستخدم إلى مجموعة الانتظار
        const cooldownDuration = 5000; // 5 ثواني
        cooldowns.set(authorId, Date.now() + cooldownDuration);
        setTimeout(() => cooldowns.delete(authorId), cooldownDuration);
    }
});






client.login(process.env.token);
