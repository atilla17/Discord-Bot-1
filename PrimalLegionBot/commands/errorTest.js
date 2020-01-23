const Discord = require('discord.js');
const botconfig = require('../botconfig.json');


module.exports.run =  (bot, message, args) => {

    message.chamnel.send("Creating error");
    asdasfasdfad

   
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'Shows a list of frequently asked questions';
    return helpStr;
  }
  
module.exports.meta = {
      name: "testerror",
      role: "0"
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "faq";
    return msgstr;

  }