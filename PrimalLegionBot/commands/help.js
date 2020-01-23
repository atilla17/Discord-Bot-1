const Discord = require('discord.js');
const botconfig = require('../botconfig.json');

module.exports.run = async (bot, message, args) => {
  
//this code will later be updated for to be cleaner and more orginized 


     var commands = bot.commands.array();
     var count = 0;
     var output = "";
     if(args.length > 0)
     {
        let commandfile = bot.commands.get(args[0]);
        if(commandfile){
          //output = commandfile.help(bot,message,args); 
          output = await Promise.resolve(commandfile.help(bot,message,args))
          //output += commandfile.help(bot,message,args);
        }

        if(output.length > 0)
        {
            message.channel.send(output);
            return;
        }
  
     }


     for(var u in commands)
     {
         if(commands[u].meta.role != "0")
         {
           if(message.member.roles.find("id", commands[u].meta.role))
           {
                output += "Command: "
                output += commands[u].meta.name + '[staff command] \n'
                output += commands[u].use(bot, message, args) + '\n\n';
                count++;
           }
         }
         else
         {
            output += "Command: "
            output += commands[u].meta.name + "\n"
             output += commands[u].use(bot, message, args) + '\n\n';
            count++;
         }
     }

     message.channel.send(output);

}

module.exports.use = (bot, message, args) =>{
  return 'Usage: ' + botconfig.prefix + 'help <command name> \n';
}

module.exports.meta ={
    name: "help",
    role: "0"
}

module.exports.help = (bot, message, args) =>{
    return 'Usage: ' + botconfig.prefix + 'help <command name> \n';
  }

