const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
var http = require('http');
var https = require('https');
var fs = require('fs');
const path = require('path');


var tmpDirFlag = false;


//moves the specified number of messages
var MoveMessages = (async(bot, message, args)=>{
      
        var destination; 
        destination = bot.channels.find("name", args[1]);

        const embed = new Discord.RichEmbed()
        .setTitle("Incoming messages")
        .setDescription("Messages are being moved from " + message.channel.name)
        .setColor("#FFFF33");

        //finish
        const embed2 = new Discord.RichEmbed()
        .setTitle("Moved messages")
        .setDescription("Messages have been moved from " + message.channel.name)
        .setColor("#ADFF2F");

        //origin post
        const embed3 = new Discord.RichEmbed()
        .setTitle("Messages have been moved to " + destination.name + " please post messages in in the correct channels, thank you")
        .setColor("#ADFF2F");
        var orginalMessage = await destination.send({embed: embed});
        

        console.log("fetching messages");
        const fetched = await message.channel.fetchMessages({limit: args[0]});
        console.log("fetch done");


        console.log("sending first embed");
        message.channel.send({embed: embed3});
        console.log('------------------------\n ' + args[0], ' requested ' + fetched.array().length + " fetched");
        //var log = "Moved chat from " + message.channel.name +"\n"

        for(let i = fetched.array().length - 1; i >= 0;i--)
        {
            console.log("prosessing move operation " + i);
             var moveRequest = await MessageMove(fetched.array()[i], destination).then(()=>{
                 console.log(i + " finished");
            }).catch((e)=>{
                console.log(e + "reee");
            });
        } 
        orginalMessage.edit({embed: embed2}).then(()=>{
            ClearTmpDir();          
        });

});

//moves a single message, used by MoveMessages
var MessageMove = (async(message, destination)=>{
    
    var moveJob = new Promise(async(resolve, reject) =>{
        if(message.attachments.array().length > 0)
        {
            var url = message.attachments.array()[0].url;
            var file;
            var fileExtention;
            var flag = true;

            if(url.toLowerCase().endsWith(".jpg"))
            {
                file = fs.createWriteStream("Images/MoveChat/file.jpg");
                items = file.path.split('.');
                fileExtention = "."+items[1];
            }
            else if (url.toLowerCase().endsWith(".png"))
            {
                file = fs.createWriteStream("Images/MoveChat/file.png");
                items = file.path.split('.');
                fileExtention = "."+items[1];
            }
            else if(url.toLowerCase().endsWith("gif"))
            {
                file = fs.createWriteStream("Images/MoveChat/file.gif");
                items = file.path.split('.');
                fileExtention = "."+items[1];
            }
            else
            {
                //if unsupported file break out of intance
                 flag = false;
                 console.log("a message move request has been rejected: unknown file type attached to message");
                 reject();
                 return;
            }
            var request = await https.get(url, function(response) {
                 response.pipe(file);
            });

            file.on("finish", () => {
                var FilePath =  file.path;
                var FileName = 'attachment://file' + fileExtention;
            
                const attachEmd = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .attachFile(FilePath)
                .setDescription(message.content)
                .setImage(FileName)
                .setTimestamp(message.createdAt)
                .setFooter("moved from " + message.channel.name);
                 destination.send({embed: attachEmd}).then(msg =>{
                 message.delete();
                 resolve();
                });  
            });  

        }
        else
        {
            const MsgEmd = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setDescription(message.content)
            .setTimestamp(message.createdAt)
            .setFooter("moved from " + message.channel.name);
            destination.send({embed: MsgEmd}).then(msg =>{
            message.delete()
            resolve();
            }).catch(e=>{console.log(e)});  
        }
    }).catch((e)=>{
        console.log("api error: " + e);
        reject();
    });

    return moveJob;

});

var ClearTmpDir = (()=>{
       
    const directory = 'Images/MoveChat';
   
    fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
    if (err) throw err;
            });
        }
    });
});


var CheckTarget = (async(messageid, channel) =>{
    var target =  await channel.fetchMessage(messageid).catch(error => { return null;});
    return target
});


module.exports.run = async(bot, message, args) => {
    
    var flag = true;
    var singleMessage = false;

    var target = await CheckTarget(args[0], message.channel).catch(error =>{
        console.log("[target error]: " + error)});

        if(target != null)
        {
            singleMessage = true;
        }
        if (!message.member.roles.find("id", botconfig.roleTrusted)) { // This checks to see if they DONT have it, the "!" inverts the true/false
        
            if(!message.member.roles.find("id", "557942376182579200"))
            {
                return; // this returns the code, so the rest doesn't run.
            }
        }
        

        console.log("movechat command was called by " +  message.member.displayName + ' ' + message.member.id);
        if(args.length < 2)
        {
            message.author.send("Wrong arguments correct usage is \">movechat <ammount> <channel name> \" ");     
            message.delete();
            flag = false;
            return;
        }
    
        if(!singleMessage)
        {
            if (isNaN(args[0]) || args[0] > 100 || args[0] < 0 ) {
            message.author.send("Wrong arguments correct usage is \">movechat <ammount> <channel name> \" Please enter a valid number between 1 and 100 \n If the number you entered was meant to be a message id, it was not a valid id");  
            message.delete();   
            flag = false; 
            return;
            }
        }
          
        try{
          var destination = bot.channels.find("name", args[1]); 
        }
        catch(e)
        {
            message.delete();
            message.author.send(`could not find channel`);
            flag = false;
            return;
        }
        if(flag == true && destination != null)
        {
            
            if(!singleMessage)
            {
                await message.delete().then(()=>{
                    MoveMessages(bot, message, args).catch((e)=>{
                        console.log(e)
                    });;
                });
              
            }
            else
            {   
                const notice = new Discord.RichEmbed()
                .setTitle("A message have been moved to " + destination.name + " please post messages in in the correct channels, thank you")
                .setColor("#ADFF2F");
             message.channel.send({embed: notice});
                var moveRequest = await MessageMove(target, destination).then(()=>{
                    message.delete();
                    ClearTmpDir();
                }).catch((e)=>{
                    console.log(e)
                });
            }
        }
        else
        {
            message.author.send("Couldint find channel");
        }
}
 
    
module.exports.use = (bot, message, arge) => 
{
    return "Moves text messages from one chat to another \n usage: movechat <amount> <destination> \n or movechat<messageid> <destination>";
}

module.exports.meta = {
    name: "movechat",
    role:botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    var text = ('Usage: ' + botconfig.prefix + 'movechat <amount> <destination> \n or movechat<messageid> <destination>');
    if (message.member.roles.find("id", botconfig.roleTrusted))
    {
     return text;
    }
    else
    {
     return "no premission ";
    }
  }