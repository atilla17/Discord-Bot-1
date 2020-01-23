const Discord = require('discord.js');
const botconfig = require('../botconfig.json');



module.exports.run = async (bot, message, args) => {
    

   let data = await global.PrefSys.LoadFile(message.author);

    if(args[0] == null)
    {

        let task = "none"

        if(data.task != null && data.task != undefined)
        {
            task = data.task;
        }

        const MsgEmd = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setDescription("You have " + data.points + " Wildcoins")
        .setColor(0x00AE86)
        .addField("Current Task",task);
        
        message.channel.send({embed: MsgEmd})
    }
    else if(args[0] != null)
    {
        if(message.author && !message.member.roles.find("id", botconfig.roleTrusted)){
            
            if(message.author.id == message.mentions.users.first().id)
            {
                const MsgEmd = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setDescription("You have " + data.points + " Wildcoins")
                .setColor(0x00AE86);
                message.channel.send({embed: MsgEmd})
            }
            else
            {
                if(message.author && !message.member.roles.find("id", "557942376182579200"))
                {
                    message.channel.send("You do not have permission to check someone elses profile");
                }
                
            }
        }
        else
        {
           let data = await global.PrefSys.LoadFile(message.mentions.users.first());
           let user = await bot.fetchUser(data.id);
           const MsgEmd = new Discord.RichEmbed()
           .setAuthor(user.username, user.displayAvatarURL)
           .setDescription("Wildcoins: " + data.points)
           .setColor(0x00AE86);
           message.channel.send({embed: MsgEmd})
        }

        
    }
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'Displays your profile info';
    return helpStr;
  }
  
module.exports.meta = {
      name: "profile",
      role: "0"
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "profile";

    if(message.member.roles.find("id", botconfig.roleTrusted))
    {
        msgstr += "\n Admins can see any profile by mentioning a user:"  + botconfig.prefix + "profile @username";
    }

    return msgstr;

  }