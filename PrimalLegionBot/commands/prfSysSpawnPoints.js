const Discord = require('discord.js');
const botconfig = require('../botconfig.json');



module.exports.run = async (bot, message, args) => {
    
    message.delete();
    if(message.author && !message.member.roles.find("id", botconfig.roleTrusted))
    {
        if(message.author && !message.member.roles.find("id", "557942376182579200"))
        {
            return;
        }
    }
    
    if(message.mentions.users.first() != null)
    {
        if(args[1] != null)
        {
            if(isNaN(args[1]) || args[1] <= 0)
            {
                message.member.send("The award amount must be a number greater then 0, correct usage: " + botconfig.prefix + "award @user <number> ***note*** please make sure there is only one space between the mention and the number \n your message: " + message);
            }
            else
            {
                try{
                    let user = message.mentions.users.first();
                    let data = await global.PrefSys.LoadFile(user);
                    let startpoints = data.points;
                    data.points = Number(data.points) + Number(args[1]) ;
                    await global.PrefSys.UpdateFile(user, data);

                    user.send("<@" + data.id + ">" + " you have been awarded " + args[1] + " Wildcoins!\n you now have " + data.points + "  Wildcoins");
                    message.author.send(args[1] + " Wildcoins have been added to " + user.tag + "'s account");

                    
                    let logContent = "\r\n-----------------------" + String(Date(Date.now()) + "-----------------------"
                             +"\r\n    Command issued by: " + message.author.tag + "  ID: " + message.author.id 
                             +"\r\n    Command file executed: prfSysSpawnPoints.js" 
                             +"\r\n    Target user: " + user.tag + "  ID: " + user.id
                             +"\r\n    Account balance before command: " + startpoints
                             +"\r\n    Amount Added:" + args[1] 
                             +"\r\n    New Account balance: " + data.points
                             +"\r\n    File updated: " + user.id + ".json"
                             +"\r\n    -----------------------" + "END OF LOG ENTRY" + "-----------------------"
                             )

                    global.PrefSys.CreateLog(logContent);

                }
                catch(e)
                {
                    console.log(e);
                    message.channel.send("error");
                }
            }
        }
        else
        {
            message.member.send("You did not enter an amount to award, correct usage: " + botconfig.prefix + "award @user <number>");
        }
    }
    else
    {
        message.member.send("You need to mention a user")
    }
    return;
    
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'adds Wildcoins to a target account, Usage: ' + botconfig.prefix + "award @user <number>";
    return helpStr;
  }
  
module.exports.meta = {
      name: "award",
      role: botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "award @user <number>\n make sure you do not have more then one space between the mention and number";

  

    return msgstr;

  }