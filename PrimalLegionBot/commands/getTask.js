const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const taskList = require('../userTaskListing.json');


function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(global.taskPicks.length));
  }

function refreshTaskList()
{
    console.log("refreshing task list.......");
    global.taskPicks = [];
    for(let i = 0; i < taskList.taskList.length; i++)
    {
        global.taskPicks.push(i);
    }

}


module.exports.run = async (bot, message, args) => {
   
    let userData = await global.PrefSys.LoadFile(message.author);
    var selectedTask;
    let fileChanged = false;
    var recurse = false;
    
    if(userData.lTaskTimeStamp != null && userData.lTaskTimeStamp != 0 && userData.lTaskTimeStamp != undefined)
    {
   
        let timestamp = new Date(userData.lTaskTimeStamp);
        let curDate = new Date(Date.now());
    
        let timeDifferance = Math.abs(curDate.getTime() - timestamp.getTime());
        let minutesDifferance = Math.ceil(timeDifferance / (1000 * 60));
        let hoursDifferance = (minutesDifferance/60);
    
        let cooldownHours = 24;

        let waitHours = cooldownHours - hoursDifferance;
        let frac = waitHours % 1;
        let leftOverMinutes = (waitHours % 1) * 60;
        let fullHours = waitHours - frac;
        

        if(hoursDifferance < cooldownHours)
        {   
            if(leftOverMinutes == 59)
                leftOverMinutes += 1;

            let messageString = "You must wait another " 
            if(fullHours >= 1)
                messageString += fullHours + " hours and " + leftOverMinutes.toFixed(0) + " minutes ";
            else
                messageString += leftOverMinutes.toFixed(0) + " minutes ";

            messageString += "before you can accept another task!";

            const rejectEmbed = new Discord.RichEmbed()
            .setTitle("Task cooldown")
            .setDescription(messageString)
            .setColor("#ffff00");

            message.channel.send({embed: rejectEmbed});

            return;
        }
        
    }

    if(userData.lTaskOverflowTimeStamp == 0 || userData.lTaskOverflowTimeStamp == undefined || userData.lTaskOverflowTimeStamp == null)
        {
            userData.lTaskOverflowTimeStamp = Date.now();
            fileChanged = true;
        }

    if(userData.taskRolls == null || userData.taskRolls == undefined)
    {
        userData.taskRolls = 0;
    }
    if( global.taskPicks.length > 0)
    {
        let randomNumber = getRandomInt();
        let taskIndex = global.taskPicks[randomNumber];
        selectedTask = taskList.taskList[taskIndex];
        global.taskPicks.splice(randomNumber, 1);
        global.taskPicks.splice(selectedTask, 1);
    }
    else
    {
        refreshTaskList();
        let randomNumber = getRandomInt();
        let taskIndex = global.taskPicks[randomNumber];
        selectedTask = taskList.taskList[taskIndex];
        global.taskPicks.splice(randomNumber, 1);
        global.taskPicks.splice(selectedTask, 1);
    }
    if(userData.taskRolls == 0)
    {

        const embed1 = new Discord.RichEmbed()
        .setDescription("Your task: " + selectedTask + "  Reward for task: " + taskList.awardAmt + " Wildcoins" +
        "\nIf you do not like this task you can run this command again to get another.\nRe-rolls: used 0/2")
        .setColor("#00ff00");

        message.channel.send({embed: embed1});
        userData.taskRolls += 1;
        userData.task = selectedTask;
        fileChanged = true;
    }
    else if(userData.taskRolls < 3)
    {


        const embed2 = new Discord.RichEmbed()
        .setDescription("New task: " + selectedTask + "  Reward for task: " + taskList.awardAmt + " Wildcoins" +
        "\nRe-rolls: " + Number(userData.taskRolls) + "/2")
        .setColor("00ff00");
         

        message.channel.send({embed: embed2});
        userData.taskRolls += 1;
        userData.task = selectedTask;
        fileChanged = true;
        //lTaskOverflowTimeStamp
        
    }
    else
    {
        if(userData.lTaskOverflowTimeStamp != null && userData.lTaskOverflowTimeStamp != 0 && userData.lTaskOverflowTimeStamp != undefined)
        {
            let timestamp = new Date(userData.lTaskOverflowTimeStamp);
            let curDate = new Date(Date.now());
    
            let timeDifferance = Math.abs(curDate.getTime() - timestamp.getTime());
            let minutesDifferance = Math.ceil(timeDifferance / (1000 * 60));
            let hoursDifferance = (minutesDifferance/60);
    
            let cooldownHours = 2;

            let waitHours = cooldownHours - hoursDifferance;
            let frac = waitHours % 1;
            let leftOverMinutes = (waitHours % 1) * 60;
             let fullHours = waitHours - frac;
        
        
            if(hoursDifferance < cooldownHours)
            {   
                if(leftOverMinutes == 59)
                    leftOverMinutes += 1;

                    var messageString = "Or you can wait " 
                 if(fullHours >= 1)
                     messageString += fullHours + " hours and " + leftOverMinutes.toFixed(0) + " minutes ";
                else{
                    messageString += leftOverMinutes.toFixed(0) + " minutes ";
                    messageString += " to get a new task!";
                   }
            
             }
            else
            {
                userData.taskRolls = 0;
                 userData.lTaskOverflowTimeStamp = 0;
                 fileChanged = true;
                 recurse = true;
            }

         const embed3 = new Discord.RichEmbed()
            .setDescription("You cannot ask for another task until you have finished your current task! \nTask: " + userData.task + '\n' + messageString)
            .setColor("#ff0000")

            if(messageString != undefined && messageString != null)
            {
                message.channel.send({embed: embed3});
            }
        }
    }
    if(recurse)
    {
        recurse = false;
        if(userData.taskRolls == 0)
            {

            const embed1 = new Discord.RichEmbed()
            .setDescription("Your task: " + selectedTask + "  Reward for task: " + taskList.awardAmt + " Wildcoins" +
            "\nIf you do not like this task you can run this command again to get another.\nRe-rolls: used 0/2")
            .setColor("#00ff00");

             message.channel.send({embed: embed1});
             userData.taskRolls += 1;
             userData.task = selectedTask;
            fileChanged = true;
        }
        else if(userData.taskRolls < 3)
        {


            const embed2 = new Discord.RichEmbed()
            .setDescription("New task: " + selectedTask + "  Reward for task: " + taskList.awardAmt + " Wildcoins" +
            "\nRe-rolls: " + Number(userData.taskRolls) + "/2")
            .setColor("00ff00");
         

             message.channel.send({embed: embed2});
             userData.taskRolls += 1;
             userData.task = selectedTask;
             fileChanged = true;
            //lTaskOverflowTimeStamp
             if(userData.lTaskOverflowTimeStamp == 0 || userData.lTaskOverflowTimeStamp == undefined || userData.lTaskOverflowTimeStamp == null)
             {
                userData.lTaskOverflowTimeStamp = Date.now();
                fileChanged = true;
             }
    }
    }
    if(fileChanged)
    {
        try{
            global.PrefSys.UpdateFile(message.author, userData);
        }
        catch{
            message.channel.send("Whoops somthing went wrong. The command had no effect please try it again. If you get this message more then once then ask a staff member for help");
        }
    }

  
}
module.exports.use = (bot, message, args) =>{
    var helpStr = 'Gives you a prompt to draw in exchange for Wildcoins ! You can change your prompt twice before your task is set';
    return helpStr;
  }
  
module.exports.meta = {
      name: "gettask",
      role: "0"
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "gettask";
    return msgstr;

  }