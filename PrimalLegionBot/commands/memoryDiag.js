const Discord = require('discord.js');
const botconfig = require('../botconfig.json');

module.exports.run =  (bot, message, args) => {
    const used = process.memoryUsage().heapTotal / 1024 / 1024;
    message.channel.send((`Memory Usage ${Math.round(used * 100) / 100} MB`));
    
   
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'Shows a list of frequently asked questions';
    return helpStr;
  }
  
module.exports.meta = {
      name: "memoryusage",
      role:botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "memoryusage";
    return msgstr;

  }