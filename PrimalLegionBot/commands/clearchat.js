const Discord = require('discord.js');
const botconfig = require('../botconfig.json');

module.exports.run =  (bot, message, args) => {

const prefix = botconfig.prefix;

async function clearchat() {
    message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
    // Now, we want to check if the user has the `Admin` role, you can change this to whatever you want.
    

    if (!message.member.roles.find("id", botconfig.roleTrusted)) { // This checks to see if they DONT have it, the "!" inverts the true/false
        return; // this returns the code, so the rest doesn't run.
    }
    
    if(args[0] == null)
    {
        args[0] = 99;
    }

    // We want to check if the argument is a number
    if (isNaN(args[0]) || args[0] > 100) {
        // Sends a message to the channel.
        message.channel.send('Please use a number between 0 - 100 as your arguments. \n Usage: ' + prefix + 'clearchat <amount>'); //\n means new line.
        // Cancels out of the script, so the rest doesn't run.
        return;
    }
    
   
    const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
    console.log(fetched.size + ' messages found, deleting...' + ' command run by ' +  message.member.displayName + ' ' + message.member.id); // Lets post into console how many messages we are deleting

    // Deleting the messages
    try{
    message.channel.bulkDelete(fetched).catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
    }
    catch(e)
    {
        reject('test');
        //message.channel.send("delete error" + e);
        console.log(("delete error the chat may have allready been empty " ));
    }
}
clearchat();

}

module.exports.use = (bot, message, args) =>{
    var text = ('Usage: ' + botconfig.prefix + 'clearchat <amount> \n');
    if (message.member.roles.find("id", botconfig.roleTrusted))
    {
     return text;
    }
    else
    {
     return "na";
    }
}

//the role attribute is only used to assist the help command
module.exports.meta = {
    name: "clearchat",
    role:botconfig.roleTrusted
  }

  module.exports.help = (bot, message, args) =>{
    var text = ('Usage: ' + botconfig.prefix + 'clearchat <amount> \n');
    if (message.member.roles.find("id", botconfig.roleTrusted))
    {
     return text;
    }
    else
    {
     return "na";
    }
  }

