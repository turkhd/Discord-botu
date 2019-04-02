const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

exports.run = (client, message, params) => {
    const embedyardim = new Discord.RichEmbed()
        .setTitle("HektarBot Discord Botumuzun Genel Komutlarý!**")
        .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFzFQwDYdhyceg4suNEiVoUwz0pNcsx9b9j6g5Sf-AKt1sZDg')
        .setDescription( `Ping: ${Date.now() - message.createdTimestamp} ms`)
        .setColor("#FF8C00")
        .setAuthor(`${message.author.username} tarafÄ±ndan istendi.`, message.author.avatarURL)
        .addField(ayarlar.prefix + "ban", "Ban atar!")
        .addField(ayarlar.prefix + "davet",  "Bulunduðunuz sunucunun davet linkini oluþturur.")
        .addField(ayarlar.prefix + "Yardým",  "Yardým Sayfasýný açar!")
        .addField(ayarlar.prefix + "özelduyuru",  "belirlediðiniz kiþiye mesaj atar")
        .addField(ayarlar.prefix + "otorolayarla",  "Sunucuya Girenlere Verilecek Olan Otorolü Ayarlar!")
        .addField(ayarlar.prefix + "otorolsýfýrla", "Otorol Baþarýyla Sýfýrlar!")
		.addField(ayarlar.prefix + "otorolmesajkapat",  "Otorol Mesajlarý Baþarýyla Kapatýr!")
		.addField(ayarlar.prefix + "durum",  "Kullanýcý Durumlarýný gösterir!")
		.addField(ayarlar.prefix + "ping",  "Botun Pingini Gösterir")
		.addField(ayarlar.prefix + "sil",  "Belirlenen miktarda mesajý siler")
		.addField(ayarlar.prefix + "mute",  "Ýstediðiniz kiþiyi  susturur")
		.addField(ayarlar.prefix + "mcbody",  "Belirtilen oyuncunun kostümünü gösterir")
		.addField(ayarlar.prefix + "kilit",  "Kanalý istediðiniz kadar süreyle kitler")
		.addField(ayarlar.prefix + "duyuru",  "Güzel Bir Duyuru Görünümü Saðlar")
		.addField(ayarlar.prefix + "giriþ-çýkýþ-ayarla",  "Giriþ çýkýþ kanalýný ayarlar")
		.addField(ayarlar.prefix + "giriþ-mesaj-ayarla",  "Giriþ mesajýný deðiþtirmenizi saðlar.")
    
        message.react("??")
    if (!params[0]) {
        const commandNames = Array.from(client.commands.keys());
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        message.channel.send(embedyardim);
    } else {
        let command = params[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            message.author.send('', `= ${command.help.name} = \n${command.help.description}\nDoðru kullaným: ` + prefix + `${command.help.usage}`);
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp', 'help', 'y',"y1"],
    permLevel: 0
};

exports.help = {
    name: 'yardým',
    description: 'Tüm komutlarý gösterir.',
    usage: 'yardým [komut]'
};