const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("ready", () => {
  client.user.setGame(prefix + "yardım | bu yazıyı bot.js degiştir |") 
  console.log("Bağlandım!")   
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'sa') {
    await msg.react('🇦');
    msg.react('🇸');
    msg.reply('Aleyküm Selam Hoşgeldin Biz de seni Bekliyorduk!')
  }
  });

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let arole = otorole[member.guild.id].sayi
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('Otorol Sistemi')
    .setDescription(`:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `)
.setColor("GREEN")
    .setFooter("Gnarge", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:loudspeaker: :white_check_mark: Hoşgeldin **${member.user.tag}** Rolün Başarıyla Verildi.`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

});

client.on("guildMemberAdd", async (member) => {
      let autorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let role = autorole[member.guild.id].sayi

      member.addRole(role)

});
client.on('message', async message => {
  const ms = require('ms');
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "yetkiliodakur") {
  if (message.guild.channels.find(channel => channel.name === "Bot Kullanımı")) return message.channel.send(" Bot Paneli Zaten Ayarlanmış.")
  message.channel.send(`Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`)
      if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir.");
      message.channel.awaitMessages(response => response.content === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
    .then((collected) => {
   message.guild.createChannel('|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|', 'category', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])



        
    message.guild.createChannel(`「👑」Kurucu Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "「👑」Kurucu");
      let role3 = message.guild.roles.find("name", "「👑」Yönetici");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
     });
})

    message.guild.createChannel(`「🎩」Admin Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "「👑」Kurucu");
      let role3 = message.guild.roles.find("name", "「👑」Yönetici");
	  let role4 = message.guild.roles.find("name", "「🎩」Admin");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
     });
	  c.overwritePermissions(role4, {
          CONNECT: true,
     });
})

    message.guild.createChannel(`「⭐」Yetkili Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "「👑」Kurucu");
      let role3 = message.guild.roles.find("name", "「👑」Yönetici");
	  let role4 = message.guild.roles.find("name", "「🎩」Admin");
	  let role5 = message.guild.roles.find("name", "「⭐」Yetkili");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
     });
	  c.overwritePermissions(role4, {
          CONNECT: true,
     });

	  c.overwritePermissions(role5, {
          CONNECT: true,
     });
})
    message.guild.createChannel(`「🔥」Modaratör Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "「👑」Kurucu");
      let role3 = message.guild.roles.find("name", "「👑」Yönetici");
	  let role4 = message.guild.roles.find("name", "「🎩」Admin");
	  let role5 = message.guild.roles.find("name", "「⭐」Yetkili");
	  let role6 = message.guild.roles.find("name", "「🔥」Moderatör");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
     });
	  c.overwritePermissions(role4, {
          CONNECT: true,
     });

	  c.overwritePermissions(role5, {
          CONNECT: true,
     });
	  c.overwritePermissions(role6, {
          CONNECT: true,
     });
})
     
    message.guild.createChannel(`「💼」Toplanti Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ YETKILI ODALAR|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "「👑」Kurucu");
      let role3 = message.guild.roles.find("name", "「👑」Yönetici");
	  let role4 = message.guild.roles.find("name", "「🎩」Admin");
	  let role5 = message.guild.roles.find("name", "「⭐」Yetkili");
	  let role6 = message.guild.roles.find("name", "「🔥」Moderatör");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
     });
	  c.overwritePermissions(role4, {
          CONNECT: true,
     });

	  c.overwritePermissions(role5, {
          CONNECT: true,
     });
})
     
      message.guild.createRole({
        name: '「👑」Kurucu',
        color: 'b90303',
        permissions: [
            "ADMINISTRATOR",
    ]
      })

      
      message.guild.createRole({
        name: '「👑」Yönetici',
        color: '1e08ac',
        permissions: [
            "ADMINISTRATOR",
    ]
      })
	  
	        message.guild.createRole({
        name: '「🎩」Admin',
        color: '050b46',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
			"ADMINISTRATOR",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
      })
	  
	  	    message.guild.createRole({
        name: '「⭐」Yetkili',
        color: '050b46',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
      }) 
	 

      message.guild.createRole({
        name: '「🔥」Moderatör',
        color: 'GREEN',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
      })

      message.guild.createRole({
        name: '「🍹」VIP',
        color: '00ffff',
      })

      message.guild.createRole({
        name: 'Üye',
        color: '5de434',
      })

      message.guild.createRole({
        name: '「👻」Bot',
        color: '0f0f0f',
      })

       message.channel.send("Gerekli Odalar Kuruldu!")
     
            })   
    
}
});
client.on('message', msg => {  
  if (msg.content.toLowerCase() === prefix + 'izmirmarşı') {
	msg.channel.sendMessage('-------------------------------------');
    msg.channel.sendMessage('İzmirin dağlarında çiçekler açar. ');
	msg.channel.sendMessage('Altın güneş orda sırmalar saçar. ');
	    msg.channel.sendMessage('Bozulmuş düşmanlar yel gibi kaçar. ');
		    msg.channel.sendMessage('Yaşa Mustafa Kemal Paşa,yaşa ');
			    msg.channel.sendMessage('Adın yazılacak mücevher taşa. ');
				    msg.channel.sendMessage('-------------------------------------');
					    msg.channel.sendMessage('İzmir dağlarına bomba koydular ');
						    msg.channel.sendMessage('Türkün sancağını öne koydular ');
							    msg.channel.sendMessage('Şanlı zaferlerle düşmanı boğdular. ');
								    msg.channel.sendMessage('Kader böyle imiş ey garip ana ');
									    msg.channel.sendMessage('Kanım feda olsun güzel vatana. ');
										    msg.channel.sendMessage('-------------------------------------');
											    msg.channel.sendMessage('İzmirin dağlarında oturdum kaldım ');
												    msg.channel.sendMessage('Şehit olanları deftere yazdim. ');
													    msg.channel.sendMessage('Öksüz yavruları bağrıma bastım ');
														    msg.channel.sendMessage('Kader böyle imiş ey garip ana ');
															    msg.channel.sendMessage('Kanim feda olsun güzel vatana ');
																    msg.channel.sendMessage('-------------------------------------');
																	    msg.channel.sendMessage('Türk oğluyum ben ölmek isterim. ');
																		    msg.channel.sendMessage('Toprak diken olsa yatağım yerim ');
																			    msg.channel.sendMessage('Allahından utansın dönenler geri ');
																				    msg.channel.sendMessage('Yaşa Mustafa Kemal Paşa,yaşa ');
																					    msg.channel.sendMessage('Adın yazılacak mücevher taşa.');
																						    msg.channel.sendMessage('-------------------------------------');						
																							}
   
 

	if (msg.content.toLowerCase() === prefix + 'istiklalmarşı') {
	msg.channel.sendMessage('-------------------------------------');
    msg.channel.sendMessage('Korkma, sönmez bu şafaklarda yüzen al sancak;');
	msg.channel.sendMessage('Sönmeden yurdumun üstünde tüten en son ocak.');
	    msg.channel.sendMessage('O benim milletimin yıldızıdır, parlayacak;');
		    msg.channel.sendMessage('O benimdir, o benim milletimindir ancak.');
				    msg.channel.sendMessage('-------------------------------------');
					    msg.channel.sendMessage('Çatma, kurban olayım, çehrene ey nazlı hilal!');
						    msg.channel.sendMessage('Kahraman ırkıma bir gül... Ne bu şiddet, bu celal?');
							    msg.channel.sendMessage('Sana olmaz dökülen kanlarımız sonra helal;');
								    msg.channel.sendMessage('Hakkıdır, Hakka tapan, milletimin istiklal.');
										    msg.channel.sendMessage('-------------------------------------');
                           }
  
 });
 const invites = {};
const wait = require('util').promisify(setTimeout);

client.on('ready', () => {
  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.get(invite.inviter.id);
    const logChannel = member.guild.channels.find(channel => channel.name === "davet-takip");
    logChannel.send(`**${member.user.tag}** Sunucuya katıldı davet eden **${inviter.tag}** daveti kullanan kisi sayısı **${invite.uses}**`);
  });
});
const sWlc = {}
client.on("guildMemberAdd", (member, params) => {
      if(!sWlc[member.guild.id]) sWlc[member.guild.id] = {
    channel: "giriş-çıkış"
  }
  const channel = sWlc[member.guild.id].channel
    const sChannel = sWlc[member.guild.id].channel
    let welcomer = member.guild.channels.find('name', sChannel);
    let memberavatar = member.user.avatarURL
      if (!welcomer) return;
      if(welcomer){
         moment.locale('ar-ly');
         var h = member.user;
         var s = member.user.ID;
        let heroo = new Discord.RichEmbed()
        .setColor('GREEN')
        .setThumbnail(h.avatarURL)
        .setAuthor(h.username,h.avatarURL)
        .setDescription(`Sunucuya Katıldı ` + `**${h.username}**`)
         .setFooter(`${h.tag}`,"https://i.postimg.cc/B6B8HpRp/Adobe-Id-icon.png")
     welcomer.send({embed:heroo});          
         
      var Canvas = require('canvas')
      var jimp = require('jimp')
      
      const w = ['hoşgeldin.png'];
      
              let Image = Canvas.Image,
                  canvas = new Canvas(557, 241),
                  ctx = canvas.getContext('2d');
  
              fs.readFile(`${w[Math.floor(Math.random() * w.length)]}`, function (err, Background) {
                  if (err) return console.log(err)
                  let BG = Canvas.Image;
                  let ground = new Image;
                  ground.src = Background;
                  ctx.drawImage(ground, 0, 0, 557, 241);
      
      })
      
                      let url = member.user.displayAvatarURL.endsWith(".webp") ? member.user.displayAvatarURL.slice(5, -20) + ".gif" : member.user.displayAvatarURL;
                      jimp.read(url, (err, ava) => {
                          if (err) return console.log(err);
                          ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
                              if (err) return console.log(err);
      
                                    ctx.font = '30px Arial Bold';
                              ctx.fontSize = '30px';
                              ctx.fillStyle = "#0C9410";
                                ctx.fillText(member.user.username, 248, 150);
                              
                              //NAMEً
                              ctx.font = '20px Arial';
                              ctx.fontSize = '15px';
                              ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${member.guild.name} Sunucumuza Hoşgeldin ▲`, 245, 80);
      
                              //AVATARً
                              let Avatar = Canvas.Image;
                              let ava = new Avatar;
                              ava.src = buf;
                              ctx.beginPath();
                 ctx.arc(120.8, 120.5, 112.3, 0, Math.PI*2, true);
                   ctx.closePath();
                   
                                 ctx.clip();

                        ctx.drawImage(ava, 7, 8, 227, 225);
                              ctx.closePath();

                            
    welcomer.sendFile(canvas.toBuffer())
      
      
      
      })
      })
      
      }
      });
//XiR
client.on("guildMemberRemove", (member, params) => {
      if(!sWlc[member.guild.id]) sWlc[member.guild.id] = {
    channel: "giriş-çıkış"
  }
  const channel = sWlc[member.guild.id].channel
    const sChannel = sWlc[member.guild.id].channel
    let welcomer = member.guild.channels.find('name', sChannel);
    let memberavatar = member.user.avatarURL
      if (!welcomer) return;
      if(welcomer){
         moment.locale('ar-ly');
         var h = member.user;
         var s = member.user.ID;
        let heroo = new Discord.RichEmbed()
        .setColor('GREEN')
        .setThumbnail(h.avatarURL)
        .setAuthor(h.username,h.avatarURL)
        .setDescription(`Sunucumuzdan çıkış yaptı :confused: ` + `**${h.username}**`)
         .setFooter(`${h.tag}`,"https://i.postimg.cc/B6B8HpRp/Adobe-Id-icon.png")
     welcomer.send({embed:heroo});          
         
      var Canvas = require('canvas')
      var jimp = require('jimp')
      
      const w = ['ayrıldı.png'];
      
              let Image = Canvas.Image,
                  canvas = new Canvas(557, 241),
                  ctx = canvas.getContext('2d');
  
              fs.readFile(`${w[Math.floor(Math.random() * w.length)]}`, function (err, Background) {
                  if (err) return console.log(err)
                  let BG = Canvas.Image;
                  let ground = new Image;
                  ground.src = Background;
                  ctx.drawImage(ground, 0, 0, 557, 241);
      
      })
      
                      let url = member.user.displayAvatarURL.endsWith(".webp") ? member.user.displayAvatarURL.slice(5, -20) + ".gif" : member.user.displayAvatarURL;
                      jimp.read(url, (err, ava) => {
                          if (err) return console.log(err);
                          ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
                              if (err) return console.log(err);
      
                                    ctx.font = '30px Arial Bold';
                              ctx.fontSize = '30px';
                              ctx.fillStyle = "#AF0A0A";
                                ctx.fillText(member.user.username, 248, 150);
                              
                              //NAMEً
                              ctx.font = '20px Arial';
                              ctx.fontSize = '15px';
                              ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${member.guild.name} Sunucumuzdan Ayrıldı ▼`, 245, 80);
      
                              //AVATARً
                              let Avatar = Canvas.Image;
                              let ava = new Avatar;
                              ava.src = buf;
                              ctx.beginPath();
                 ctx.arc(120.8, 120.5, 112.3, 0, Math.PI*2, true);
                   ctx.closePath();
                   
                                 ctx.clip();

                        ctx.drawImage(ava, 7, 8, 227, 225);
                              ctx.closePath();

                            
    welcomer.sendFile(canvas.toBuffer())
      
      
      
      })
      })
      
      }
      });
client.on('message', message => {
     if(!message.channel.guild) return;
                if(message.content.startsWith(prefix + 'bots')) {
    if (message.author.bot) return;
    let i = 1;
        const botssize = message.guild.members.filter(m=>m.user.bot).map(m=>`${i++} - <@${m.id}>`);
          const embed = new Discord.RichEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setDescription(`**Sunucudaki Botlar ${message.guild.members.filter(m=>m.user.bot).size} **
${botssize.join('\n')}`)
.setFooter(client.user.username, client.user.avatarURL)
.setTimestamp();
message.channel.send(embed)

}
});
client.on("message", async message => {
    let sayac = JSON.parse(fs.readFileSync("./Jsonlar/sayac.json", "utf8"));
    if(sayac[message.guild.id]) {
        if(sayac[message.guild.id].sayi <= message.guild.members.size) {
            const embed = new Discord.RichEmbed()
                .setDescription(`Tebrikler ${message.guild.name}! Başarıyla ${sayac[message.guild.id].sayi} kullanıcıya ulaştık! Sayaç sıfırlandı!`)
                .setColor("RANDOM")
                .setTimestamp()
            message.channel.send({embed})
            delete sayac[message.guild.id].sayi;
            delete sayac[message.guild.id];
            fs.writeFile("./Jsonlar/sayac.json", JSON.stringify(sayac), (err) => {
                console.log(err)
            })
        }
    }
})

client.on("guildMemberAdd", async (member) => {
      let autorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let role = autorole[member.guild.id].sayi

      member.addRole(role)

});

client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./Jsonlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./Jsonlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("RED")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:inbox_tray: **${member.user.tag}** Adlı Kullanıcı Katıldı. \`${sayac[member.guild.id].sayi}\` Kişi Olmamıza \`${sayac[member.guild.id].sayi - member.guild.memberCount}\` Kişi Kaldı \`${member.guild.memberCount}\` Kişiyiz!`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }
});

client.on("guildMemberRemove", async member => {
        let sayac = JSON.parse(fs.readFileSync("./Jsonlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./Jsonlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("RED")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:outbox_tray: **${member.user.tag}** Adlı Kullanıcı Ayrıldı. \`${sayac[member.guild.id].sayi}\` Kişi Olmamıza \`${sayac[member.guild.id].sayi - member.guild.memberCount}\` Kişi Kaldı \`${member.guild.memberCount}\` Kişiyiz! `)
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

});
client.on('guildBanAdd', async (guild, member) => {
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
   const embed = new Discord.RichEmbed()
			.setTitle('Üye yasaklandı.')
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
			.setThumbnail(member.user.avatarURL)
			.setFooter(`LeadFed Mod-Log Sistemi | ID: ${member.user.id}`)
			.setTimestamp();
			hgK.send({embed});

		
	})
	
	.on('guildBanRemove', async (guild, member) => {
		    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
			var embed = new Discord.RichEmbed()
			.setTitle('Üyenin yasaklaması kaldırıldı.')
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
			.setThumbnail(member.user.avatarURL)
			.setFooter(`LeadFed Mod-Log Sistemi | ID: ${member.user.id}`)
			.setTimestamp();
			hgK.send({embed});
		
	})


	.on('messageDelete', async msg => {
		if (!msg.guild) return;
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = msg.guild.channels.get(gc[msg.guild.id].gkanal)
    if (!hgK) return;
			var embed = new Discord.RichEmbed()
			.setAuthor(msg.author.tag, msg.author.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${msg.author.id}> tarafından <#${msg.channel.id}> kanalına gönderilen "${msg.content}" mesajı silindi.`)
		.setFooter(`LeadFed Mod-Log Sistemi | ID: ${msg.id}`)
			hgK.send({embed});
		
	})

	.on('channelCreate', async channel => {
		if (!channel.guild) return;
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal)
    if (!hgK) return;		
			if (channel.type === "text") {
				var embed = new Discord.RichEmbed()
				.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`<#${channel.id}> kanalı oluşturuldu. _(metin kanalı)_`)
				.setFooter(`LeadFed Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			};
			if (channel.type === "voice") {
				var embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı oluşturuldu. _(sesli kanal)_`)
			.setFooter(`LeadFed Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	})
		
	.on('channelDelete', async channel => {
		    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal)
    if (!hgK) return;
			if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(metin kanalı)_`)
				.setFooter(`LeadFed Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(sesli kanal)_`)
			.setFooter(`LeadFed Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	})

.on('roleDelete', async role => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = role.guild.channels.get(gc[role.guild.id].gkanal)
    if (!hgK) return;
  let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Rol Silindi!`)
        .setThumbnail(role.guild.iconURL)
        .setDescription(`'${role.name}' adlı rol silindi.`, true)
  .setFooter(`LeadFed Mod-Log Sistemi | ID: ${role.id}`)
    hgK.send({embed})
})

.on('emojiCreate', async emoji => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal)
    if (!hgK) return;
  let embedds9 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Emoji Oluşturuldu!`)
        .setThumbnail(emoji.guild.iconURL)
        .setDescription(`<:${emoji.name}:${emoji.id}> - ${emoji.name} adlı emoji oluşturuldu!`, true)
  .setFooter(`LeadFed Mod-Log Sistemi | ID: ${emoji.id}`)
    hgK.send({embedds9})
})

.on('emojiDelete', async emoji => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal)
    if (!hgK) return;
  let embedds0 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Emoji Silindi!`)
        .setThumbnail(emoji.guild.iconURL)
        .setDescription(`':${emoji.name}:' adlı emoji silindi!`, true)
  	.setFooter(`LeadFed Mod-Log Sistemi | ID: ${emoji.id}`)
   hgK.send(embedds0)
})

.on('roleCreate', async role => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = role.guild.channels.get(gc[role.guild.id].gkanal)
    if (!hgK) return;
  let embedds0 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Rol Oluşturuldu!`)
        .setThumbnail(role.guild.iconURL)
        .setDescription(`'${role.name}' adlı rol oluşturuldu.`, true)
  .setFooter(`LeadFed Mod-Log Sistemi | ID: ${role.id}`)
   hgK.send(embedds0)
})

.on('messageUpdate', async (oldMessage, newMessage) => {
   const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
   const hgK = oldMessage.guild.channels.get(gc[oldMessage.guild.id].gkanal)
    if (!hgK) return;
      if (oldMessage.author.bot) {
        return false;
    }

    if (!oldMessage.guild) {
        return false;
    }

    if (oldMessage.content == newMessage.content) {
        return false;
    }

    if (!oldMessage || !oldMessage.id || !oldMessage.content || !oldMessage.guild) return;
  let embedds4 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Mesaj Güncellendi!`)
        .setThumbnail(oldMessage.author.avatarURL)
        .addField("Gönderen", oldMessage.author.tag, true)
        .addField("Önceki Mesaj", oldMessage.content, true)
        .addField("Şimdiki Mesaj", newMessage.content, true)
        .addField("Kanal", newMessage.channel.name, true)
  	.setFooter(`LeadFed Mod-Log Sistemi | ID: ${oldMessage.id}`)
    hgK.send(embedds4)
})
});
client.on("message", msg => {
  db.fetch(`reklam_${msg.guild.id}`).then(i => {
    if (i == 'acik') {
        const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
        if (reklam.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                    return msg.reply('Bu Sunucuda Reklam Engelleme Filtresi Aktiftir. Reklam Yapmana İzin Veremem !').then(msg => msg.delete(3000));
    

  msg.delete(3000);                              

            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    else if (i == 'kapali') {
      
    }
    if (!i) return;
  })
    });
