const Discord = require('discord.js');
const botconfig = require('../botconfig.json');



async function save(sender, senderData, recipeint, recipeintData, logData)
{
    await global.PrefSys.UpdateFile(sender, senderData);
    await global.PrefSys.UpdateFile(recipeint, recipeintData);
    global.PrefSys.CreateLog(logData);
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.run = async (bot, message, args) => {
    
    if(args[0] != null && args[1] !=null && !isNaN(args[1]) && args[1] > 0 && message.mentions.users.size > 0)
    {
        var recipeint = message.mentions.users.first()
        if(recipeint.bot)
        {
            if(recipeint.id == bot.user.id)
            {
                const zhappy = bot.emojis.find(emoji => emoji.name === "zhappy");
                const ztongue = bot.emojis.find(emoji => emoji.name === "ztongue");
                message.channel.send("How nice of you! " + zhappy + " \nBut you should keep them to spend them on something worthwhile, WildLander! I'm not too sure what I'd do with them " + ztongue);

                return;
            }

            message.channel.send("You cant send Wildcoins to a bot");
            return;
        }

        if(recipeint.id == message.author.id)
        {
            const zthonk = bot.emojis.find(emoji => emoji.name === "zthonk");
            message.channel.send(zthonk + " If only it was that easy...");
            return;
        }

        var sender = message.author;
        var recipeintData = await global.PrefSys.LoadFile(recipeint);
        var senderData = await global.PrefSys.LoadFile(sender);

        let transferAmount = Number(args[1]);
        let rStartBalance = Number(recipeintData.points);
        let sStartBalance = Number(senderData.points);

        if(sStartBalance - transferAmount >= 0)
        { 
            var responseGiven = false;

            const embed = new Discord.RichEmbed()
            .setTitle("Coin transfer")
            .setDescription("Are you sure you want to send " + transferAmount + " Wildcoins to " + recipeint.tag + " ['yes' 'no']? ")
            .setColor("#FFFF33");

            const embed2 = new Discord.RichEmbed()
            .setTitle("Coin transfer ")
            .setDescription("Are you sure you want to send " + transferAmount + " Wildcoins to " + recipeint.tag + " ['yes' 'no']? ")
            .setColor("#ff650c");
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

                /* later */
           //


            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
            collector.on ('collect', message => {
            if (message.content.toLowerCase() == "yes") {
                  responseGiven = true;
                  collector.stop();
                  const embed3 = new Discord.RichEmbed()
                  .setTitle("Coin transfer")
                  .setDescription("Wildcoins have been sent!")
                  .setColor("#ADFF2F");

                  orginalMessage.edit({embed: embed3});
                  try{
                   //message.channel.send("WildCoins have been sent!");
                  recipeintData.points = Number(recipeintData.points) + transferAmount;
                  senderData.points = Number(senderData.points) - Number(transferAmount);
                  let confirmationCode = makeid(20);

                 
                  const embed5 = new Discord.RichEmbed()
                  .setTitle("You sent "  + transferAmount +  " Wildcoins to "  + recipeint.tag)
                  .setDescription( "\nStart balance: " + sStartBalance+"\nEnd balance: "+ senderData.points +"\nConfirmation code " + confirmationCode)
                  .setColor("#FFFF33");

                  const embed6 = new Discord.RichEmbed()
                  .setTitle( sender.tag + " sent you " + transferAmount + " Wildcoins")
                  .setDescription( "\nStart balance: " + rStartBalance+"\nEnd balance: "+ recipeintData.points +"\nConfirmation code " + confirmationCode)
                  .setColor("#FFFF33");
                  
                  message.author.send({embed: embed5});
                
                  recipeint.send({embed: embed6});

                  let logContent = "\r\n-----[TRANSFER]-----" + String(Date(Date.now())) + "-----------------------"
                  +"\r\n    Command issued by: " + message.author.tag + "  ID: " + message.author.id 
                  +"\r\n    Command file executed: prfTransferPoints.js" 
                  +"\r\n    Sender: " + sender.tag + "  ID: " + sender.id
                  +"\r\n    "+ sender.tag +" Start balance: " + sStartBalance
                  +"\r\n    " + recipeint.tag +" Start balance: " + rStartBalance
                  +"\r\n    Amount transferred:" + transferAmount + " FROM " + sender.tag + " " + sender.id + " TO " + recipeint.tag + " " + recipeint.id 
                  +"\r\n    " +sender.tag +" end balance: " + senderData.points
                  +"\r\n    "+ recipeint.tag +" end balance: " + recipeintData.points
                  +"\r\n    Files updated: " + recipeint.id + ".json , " + sender.id + ".json"
                  +"\r\n    Confirmation code: " + confirmationCode;
                  +"\r\n    -----------------------" + "END OF LOG ENTRY" + "-----------------------"
                
                save(sender, senderData, recipeint, recipeintData, logContent);
                  }
                  catch(e)
                  {
                    let logContent = "\r\n-----[TRANSFER ERROR]-----" + String(Date(Date.now())) + "---[TRANSFER ERROR]---"
                    +"\r\n    Command issued by: " + message.author.tag + "  ID: " + message.author.id 
                    +"\r\n    Command file executed: prfTransferPoints.js" 
                    +"\r\n    Sender: " + sender.tag + "  ID: " + sender.id
                    +"\r\n    "+ sender.tag +" Start balance: " + sStartBalance
                    +"\r\n    " + recipeint.tag +" Start balance: " + rStartBalance
                    +"\r\n    Ammount transferred:" + transferAmount + " FROM " + sender.tag + " " + sender.id + " TO " + recipeint.tag + " " + recipeint.id 
                    +"\r\n    " +sender.tag +" end balance: " + senderData.points
                    +"\r\n    "+ recipeint.tag +" end balance: " + recipeintData.points
                    +"\r\n    Files updated: " + recipeint.id + ".json , " + sender.id + ".json"
                    +"\r\n    Confirmation code: " + confirmationCode;
                    +"\r\n    Error information: " + e;
                    +"\r\n    -----------------------" + "END OF LOG ENTRY" + "-----------------------"
                  }

                

             } else  {
                 responseGiven = true;
                 
                 
                 collector.stop(); 
                 const embed6 = new Discord.RichEmbed()
                 .setTitle("Coin transfer ")
                 .setDescription("Transfer canceled")
                 .setColor("#ff650c");

                 setTimeout(d =>{
                    orginalMessage.edit({embed:embed6});
                 } , 1000);
                 //orginalMessage.edit({embed:embed6});
                 
                }

            })
            collector.on("end", c =>{
                console.log("collector end");
                clearInterval(refreshIntervalId);

            if(!responseGiven)
            {
                  const embed4 = new Discord.RichEmbed()
                 .setTitle("Coin transfer")
                 .setDescription("Transaction timeout. coins not sent")
                 .setColor("#ff0000");
                 setTimeout(d =>{
                    orginalMessage.edit({embed:embed4});
                 } , 1000);
                    //message.channel.send("Transaction timeout");
                }

            })
        }
        else
        {
            message.channel.send("you dont have that many Wildcoins");
        }
       
    
    }
    else
    {
        message.channel.send("You need to mention a user followed by a number greater then 0\n example: send @user 100\n make sure to only have one space between the mention and number")
    }
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'removes Wildcoins from your account and sends them to the mentioned account, Usage: ' + botconfig.prefix + "send @user <number>";
    return helpStr;
  }
  
module.exports.meta = {
      name: "send",
      role: "0"
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "send @user <number>\n make sure you do not have more then one space between the mention and number";

    return msgstr;

  }