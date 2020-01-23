/*
file         : app.js
Author       : Atilla Puskas
Date         : 2018-06-01
Last modified: 2018-10-08

description:

Main application file for the bot, please make sure botconfig.json is set before trying to run the bot
   
inside appconfig.json
    
    token - this is the token the bot will use to login
            you can get one from https://discordapp.com/developers/
            you will need to create a bot account
    
    prefix - the symbol used to lead bot commands please only use a single character
    
    welcomeCh - the name of the chanel that welcome messages will be sent to.


*/
const botconfig = require('./botconfig.json');
const Discord = require("discord.js");
const fs = require("fs");
const NewWelcomMessage = require("./welcomems");
const NewMemberRole = require("./System/Auto/memberRole");
global.PrefSys = require("./System/ProfileSystem/prefManager.js");
const taskList = require('./userTaskListing.json');
global.taskPicks = [];
const bot = new Discord.Client({autoReconnect:true});
bot.commands = new Discord.Collection();
//bot.PrefSys = require("./System/Auto/memberRole");
var defaultChannel;
var notifCh;
var psKill = true;

//tasklist setup
for(let i = 0; i < taskList.taskList.length; i++)
{
  global.taskPicks.push(i);
}

console.log(global.taskPicks);


var defaultState  = {
  "ShutdownReason" : "restart",
  "locked" : false,
  "pid" : process.pid
}
var liveState;
var abort = false;

function closePgm(code)
{
  if(!abort)
  {
    liveState.locked = false;
    let data = JSON.stringify(liveState, null, 2);
    fs.writeFile('state.json', data, (err) => {          
        if (err) throw err;
        console.log('safety un locked');
        });
  }
  return console.log(`About to exit with code ${code}`);
}

//comment out beacuse the code is currently not needed
process.on('exit', async function(code) {
  if(notifCh != null)
  {
    console.log("sending message");
    await notifCh.send("!I am leaving for now, goodbye! \n(Kojo is offline. He has ran into an error or is getting a restart. He will be back soon!)");
  }
  return 4;
});
process.on('uncaughtException', async function(err){
  closePgm(4);
  console.log("error code 4");
  if(notifCh != null)
  {
    console.log("sending message");
    await notifCh.send("I am leaving for now, goodbye! \n(Kojo is offline. He has ran into an error or is getting a restart. He will be back soon!)");
  }
  process.exit(4);
});
process.on("unhandledRejection", async function(err){
  if(notifCh != null)
  {
    console.log("sending message");
    await notifCh.send("I am leaving for now, goodbye! \n(Kojo is offline. He has ran into an error or is getting a restart. He will be back soon!)");
  }
  process.exit(4);
});

if(!fs.existsSync('state.json'))
{
  let data = JSON.stringify(defaultState, null, 2);
  fs.writeFile('state.json', data, (err) => {          
    if (err) throw err;
    console.log('State file not found\nCreating file...');
    });
}
else
{
  try{

    if(fs.existsSync('state.json'))
     {
        let filePath = 'state.json';
        let object = JSON.parse(fs.readFileSync('state.json', 'utf8'));
        liveState = object;
     }
  }
  catch(exception){
      console.log("failed to load statefile\n" + exception);   
  }
}

if(liveState == null || liveState == undefined || liveState.length < 1)
{
  liveState = defaultState;
}

if(liveState.locked)
{
  if(psKill)
  {
    try{
      process.kill(liveState.pid);
    }
    catch(e)
    {
      console.log("Process kill failed \n " + e)
    }
  }
  else
  {
    console.log("Bot is allready running, Aborting...");
    abort = true;
    process.exit(4);
  }
}


  liveState.locked = true;
  liveState.pid = process.pid;
  let data = JSON.stringify(liveState, null, 2);
    fs.writeFile('state.json', data, (err) => {          
        if (err) throw err;
        console.log('safety locked');
        });



fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.meta.name, props);
     // bot.commands.set(props.meta.use, props);
    });
  });


bot.on("ready", async () =>{
  bot.user.setActivity("you", {type : "WATCHING"});
  defaultChannel = await bot.channels.find("name", botconfig.welcomeCh);
  notifCh = await bot.channels.find("name", botconfig.roleCh); 
  notifCh.send("I'm back! Did you miss me?\n(Kojo is online)");
  bot.guilds.forEach(guild => {
    NewMemberRole.RunForPreExisting(guild);
    
  });
  



});

bot.on("message",  message =>{
  

  //NewMemberRole.Run(message.member);

    //ignore direct messages and its own messages
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  
  
  
  //splits the message into a command and arguments, the first word will be the command name the rest are all arguments
  let messageContent = message.content.split(" ");
  let cmd = messageContent[0];
  let args = messageContent.slice(1);
  
  //if the message does not start with the prefix then just exit.
  if(!cmd.startsWith(prefix)) return;
  
  cmd = cmd.toLowerCase();

  if(cmd === prefix && args.length == 0){
       message.channel.send("Yup thats me hi");    
  }
  
  //slice the prefix off the command to get only the command name
  //Example command prefix-clearchat 60
  //ressult command = (clearchat) args = (60)
  //final code = clearchat.run(bot,message,args)
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  
  //run the selected command from the command file
  if(commandfile) commandfile.run(bot,message,args);

  


});


//When a member joins the server send them a welcome in the welcome chanel
bot.on("guildMemberAdd",  member => {  
    defaultChannel.send(NewWelcomMessage(member.id));
    NewMemberRole.Run(member);
    global.PrefSys.setUp(member);
    
});



var outErr = true;
var outWrn = true;
//set this to 'false' if you dont want console outputs
var outdebug = true;

bot.on("error", (e) => {if(outErr)console.info('[ERROR]' + e)});
bot.on("warn", (e) => {if(outWrn)console.info('[WARN]' + e)});
bot.on("debug", (e) => {if(outdebug)console.info('[info]' + e)});


bot.login(botconfig.token);
console.log('Bot started...');


var stdin = process.openStdin();

//Skeloton for commandline commands from the terminal
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we account for that  
    // with toString() and then trim() 

     let input = d.toString().trim();
     let messageContent = input.split(" ");
     let cmd = messageContent[0];
     let args = messageContent.slice(1);

     if(cmd === 'help')
     {
         console.log(a = { text : "commands none"});
         return;
     }
  
  });

