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
                message.member.send("The delete amount must be a number greater then 0, correct usage: " + botconfig.prefix + "deletepoints @user <number> ***note*** please make sure there is only one space between the mention and the number \n your message: " + message);
            }
            else
            {
                try{
                    let user = message.mentions.users.first();
                    let data = await global.PrefSys.LoadFile(user);
                    let startpoints = data.points;
                    if(startpoints < Number(args[1]))
                    {
                        message.member.send("The selected user does not have that many points");
                        return;
                    }

                    data.points = Number(data.points) - Number(args[1]) ;
                    await global.PrefSys.UpdateFile(user, data);

                    user.send("<@" + data.id + "> " +  args[1] + " Wildcoins have been removed from your account by  " + message.author.tag + "\n you now have " + data.points + "  Wildcoins remaining");
                    message.author.send(args[1] + " Wildcoins have been removed from " + user.tag + "'s account");


                    
                    let logContent = "\r\n-----------------------" + String(Date(Date.now()) + "-----------------------"
                             +"\r\n    Command issued by: " + message.author.tag + "  ID: " + message.author.id 
                             +"\r\n    Command file executed: prfSysDeletePoints.js" 
                             +"\r\n    Target user: " + user.tag + "  ID: " + user.id
                             +"\r\n    Account balance before command: " + startpoints
                             +"\r\n    Amount Deleted:" + args[1] 
                             +"\r\n    New Account balance: " + data.points
                             +"\r\n    File updated: " + user.id + ".json"
                             +"\r\n    -----------------------" + "END OF LOG ENTRY" + "-----------------------"
                             )

                    global.PrefSys.CreateLog(logContent);

                }
                catch(e)
                {
                    console.log(e);
                    let logContent = "\r\n--[ERROR REPORT]------" + String(Date(Date.now()) + "-----------------------"
                             +"\r\n    Command issued by: " + message.author.tag + "  ID: " + message.author.id 
                             +"\r\n    Command file executed: prfSysDeletePoints.js" 
                             +"\r\n    Target user: " + user.tag + "  ID: " + user.id
                             +"\r\n    Error:  " + e                 
                             +"\r\n    -----------------------" + "END OF LOG ENTRY" + "-----------------------"
                             )

                    global.PrefSys.CreateLog(logContent);
                }
            }
        }
        else
        {
            message.member.send("You did not enter an amount to delete, correct usage: " + botconfig.prefix + "award @user <number>");
        }
    }
    else
    {
        message.member.send("You need to mention a user")
    }
    return;
    
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'removes Wildcoins from a target account, Usage: ' + botconfig.prefix + "award @user <number>";
    return helpStr;
  }
  
module.exports.meta = {
      name: "deletepoints",
      role: botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "deletepoints @user <number>\n makes sure you do not have more then one space between the mention and number";

  

    return msgstr;

  }