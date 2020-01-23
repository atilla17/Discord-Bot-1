const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const taskList = require('../userTaskListing.json');

var responseGiven2 = false;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

async function save(user, userData, logContent)
{
    await global.PrefSys.UpdateFile(user, userData);
    await global.PrefSys.CreateTaskLog(logContent);
}


module.exports.run = async (bot, message, args) => {
    if(message.author && !message.member.roles.find("id", botconfig.roleTrusted))
    {
        if(message.author && !message.member.roles.find("id", "557942376182579200"))
        {
            return;
        }
    }
    

    if(message.mentions.users.first() != null)
    {
        var user = message.mentions.users.first();
        var userData = await global.PrefSys.LoadFile(user);

        const embed = new Discord.RichEmbed()
        .setTitle("Checking task")
        .setDescription("Did " + user.username + " Finish the task: " + userData.task + "?")
        .setColor("#FFFF33");

        const embed2 = new Discord.RichEmbed()
        .setTitle("Checking task")
        .setDescription("Did " + user.username + " Finish the task: " + userData.task + "?")
        .setColor("#ff650c");
       
        
        if(userData.task != null && userData.task != "none" && userData.task != undefined)
        {

            var tick = true;
            var orginalMessage = await message.channel.send({embed: embed});
            
            var refreshIntervalId = setInterval(async fname =>{
                if(tick)
                {
                    await orginalMessage.edit({embed:embed2})
                }
                else
                {
                    await orginalMessage.edit({embed:embed})
                }
                tick = !tick;
    
            }, 1000); 

            
            
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
            collector.on ('collect', message => {
               if(message.content.toLowerCase() == "yes")
               {
                   responseGiven2 = true;
                   userData.lTaskTimeStamp = Date.now();
                   collector.stop();
                   try {
                    clearInterval(refreshIntervalId);
                    //SaveData
                    var orginalAmt = userData.points;
                    var newAmt = userData.points + taskList.awardAmt;
                    var taskDone = userData.task;
                    userData.taskRolls = 0;
                    userData.task = 'none';
                    userData.points = newAmt;
                    
                    //Create logs
                    let logContent = "\r\n ---------[Task]--------" + String(Date(Date.now())) + "--------------------------------"
                    +"\r\n Task completed by: " + user.tag + " ID: " + user.id 
                    +"\r\n Task checked by: " + message.author.tag + " ID: " + message.author.id 
                    +"\r\n Task completed: " + taskDone 
                    +"\r\n " + user.tag + "'s Balance before task: " + orginalAmt
                    +"\r\n " + user.tag + "'s Balance after task: " + newAmt
                    +"\r\n File executed: markTaskDone.js" 
                    +"\r\n----------------------------END OF LOG -----------------------------------------------------"

                    save(user, userData, logContent);

                    //Send messages
                    responseGiven2 = true;
                    const embedA = new Discord.RichEmbed()
                    .setTitle("Task Completed")
                    .setDescription("You earned " + taskList.awardAmt + " Wildcoins! \n you now have " + newAmt + " Wildcoins")
                    .setColor("#00ff00")
                    user.send({embed: embedA});
                    const embedB = new Discord.RichEmbed()
                    .setTitle("Task Completed")
                    .setDescription(user.username + " Completed the task " + taskDone)
                    .setColor("#00ff00")
                    orginalMessage.edit({embed: embedB});
                   }
                   catch (e)
                   {
                        message.channel.send("Somthing went wrong " + e + "")
                   }

               } 
               else if(message.content.startsWith('\\'))
               {
                    //do nothing

               }    
               else
               {
                    const nEmbed = new Discord.RichEmbed()
                    .setTitle("Task not finished")
                    .setDescription("no changed was applied, run the command again when the task is compleeted")
                    .setColor('#ff0000');
                    orginalMessage.edit({embed: nEmbed});
                    responseGiven2 = true;
                    clearInterval(refreshIntervalId);
               }


            })
            collector.on('end', message =>{
                
                clearInterval(refreshIntervalId);
                if(!responseGiven2)
                {
                  const embed4 = new Discord.RichEmbed()
                 .setTitle("Task check timeout")
                 .setDescription("You took to long to reply. No change was applied")
                 .setColor("#ff0000");
                 setTimeout(d =>{
                    orginalMessage.edit({embed:embed4});
                 } , 1000);
                }   
            })
        }
        else
        {
            message.channel.send(user.username + " does not have a task")
        }
    }
    else
    {
        message.channel.send("you need to mention a user");
    }

  
}
module.exports.use = (bot, message, args) =>{
    var helpStr = "Finishes a user's current task. Make sure to review the requirements for the drawing before running this command!";
    return helpStr;
  }
  
module.exports.meta = {
      name: "finishtask",
      role: botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "finishtask";
    return msgstr;

  }