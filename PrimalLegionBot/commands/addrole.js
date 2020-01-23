const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const RolesStruct = require('../roles.json');


//Add the names of all the roles that you want your users to be able to add
//adding a role name that does not exist or match a role in your server will ressult in an error
//you can add as many role as you like
//Set the roles inside roles.json
//var eRoles = botconfig.eRoles //["role2","role1","role3","role4","role5"];
var eRoles = [];
//files used

const checkmarkFilePath = "../PrimalLegionBot/Images/Icons/check-mark.png";
const checkmarkFileName = 'attachment://check-mark.png';
const redxFilePath = "../PrimalLegionBot/Images/Icons/red-x.jpg";
const redxFileName = "attachment://red-x.jpg";

var roleIndex = 0;

//flattenRoles
for(let i = 0; i < RolesStruct.Roles.length; i++)
{
    for(let j = 0; j < RolesStruct.Roles[i].catagoryRoles.length; j++)
    {
        eRoles.push(RolesStruct.Roles[i].catagoryRoles[j]);
    }
}


function isRole(arg_)
{
    console.log(arg_);
    for(let i = 0; i < eRoles.length; i++)
    {
        if(eRoles[i].toLowerCase() === arg_.toLowerCase())
        {
            roleIndex = i;
            return true;
        }
    }
    return false;
}


var StringUtils = function() {
}

var StringUtils = function() {
}

StringUtils.findLongestCommonSubstring = function(string1, string2) {
	var comparsions = []; //2D array for the char comparsions ...
	var maxSubStrLength = 0;
	var lastMaxSubStrIndex = -1, i, j, char1, char2, startIndex;

	for (i = 0; i < string1.length; ++i) {
		comparsions[i] = new Array();

		for (j = 0; j < string2.length; ++j) {
			char1 = string1.charAt(i);
			char2 = string2.charAt(j);

			if (char1 === char2) {
				if (i > 0 && j > 0) {
					comparsions[i][j] = comparsions[i - 1][j - 1] + 1;
				} else {
					comparsions[i][j] = 1;
				}
			} else {
				comparsions[i][j] = 0;
			}

			if (comparsions[i][j] > maxSubStrLength) {
				maxSubStrLength = comparsions[i][j];
				lastMaxSubStrIndex = i;
			}
		}
	}

	if (maxSubStrLength > 0) {
		startIndex = lastMaxSubStrIndex - maxSubStrLength + 1;

		return string1.substr(startIndex, maxSubStrLength);
	}

	return null;
}


function SimilarRoles(arg_)
{
    var maybe = [];
    for (let i = 0; i < eRoles.length ; i++ )
    {   
        let matches = 0;
        let words = arg_.split(" ");

        //var reeee = StringUtils.findLongestCommonSubstring(arg_.toLowerCase(), eRoles[i].toLowerCase());
        var reeee = StringUtils.findLongestCommonSubstring(eRoles[i].toLowerCase(),arg_.toLowerCase());
        console.log("role: " + eRoles[i] + "---------" + "comparison: " + reeee );

        if(reeee != null && reeee.length > 2)
        {
            var strcount = reeee.length;
            var rslt = {
                match: eRoles[i],
                count: strcount
            };
            maybe.push(rslt);
        }
       

    }
    maybe.sort(function(a, b){
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.count - a.count;
      });
    return maybe;
}


function replaceCharacters(arg_, location)
{
    var ref = eRoles[location];
    return ref; 
}

module.exports.run = async (bot, message, args) => {
 if(message.channel != bot.channels.find("name", botconfig.roleCh))
 {
     return;
 }
 
 var arg = args[0];
 if(args.length > 1)
 {
     arg += ' ';
     for(let i = 1; i < args.length; i++ )
     {
         arg += args[i];
         if(i != args.length - 1)
         {
             arg += ' ';
         }
     }
 }

 if(arg != undefined && arg.startsWith('!'))
 {
    if(arg.length > 2)
    {
        let indexes = arg.split(',');
        indexes[0] = indexes[0].substr(1, indexes[0].length)

        let output = "";
        var indexResolveError = false;
        let roleAddCount = 0;
        let roleRemoveCount = 0;
        let roleErrorCount = 0;      
        let roleFileError = 0; 

        for(let i = 0; i< indexes.length; i++)
        {
           indexes[i] = indexes[i].trim();
        }

        for(let i = 0; i< indexes.length; i++)
        {
            indexResolveError = false;
            var roleName = "";
            let xy = indexes[i].split(' ');
              
            if(xy.length != 2)
            {
                indexResolveError = true;
            }
            try
            {           
              roleName = RolesStruct.Roles[Number(xy[0])].catagoryRoles[Number(xy[1])];
              if(roleName == undefined)
              {
                indexResolveError = true;
              }
            }
            catch(e)
            {
                indexResolveError = true;
            }
            if(!indexResolveError && isRole(roleName)) 
            {
                let role = message.guild.roles.find("name", replaceCharacters(roleName, roleIndex));
                if(message.guild.roles.find("name", roleName))
                {
                    if(message.member.roles.find("name", roleName))
                    {   
                        message.member.removeRole(role).catch(console.error);
                        output += ":white_check_mark: " + roleName + " Removed\n";
                        roleAddCount++;
                    }
                    else
                    {
                        message.member.addRole(role).catch(console.error);
                        output += ":white_check_mark: " + roleName + " Added\n";
                        roleRemoveCount++;
                    }
                }
                else if(!indexResolveError)
                {
                    output += ":bangbang: The role " + roleName + " has not been properly added to the server please contact staff" + '\n';
                    roleFileError++;
                }

            }
            else
            {
                output += ":x: Error trying to resolve " + (indexes[i].toString()) + '\n';
                roleErrorCount++;
            }
            
        }

        let green = "#51ff71";
        let yellow = "#ffff00";
        let red = "#f4424b";
        let color = green;
        if(roleAddCount + roleRemoveCount > 0 && roleErrorCount + roleFileError > 0)
            color = yellow;
        if(roleAddCount + roleRemoveCount <= 0 && roleErrorCount + roleFileError > 0)
           color = red;

        if(output.length < 2000)
        {
            const outEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setDescription(output);
            message.channel.send({embed: outEmbed});
        }
        else
        {
            const otherEmbed = new Discord.RichEmbed()
            .setDescription("Output too long to display\n" + roleAddCount+" roles added\n" + roleRemoveCount +" roles removed\n" + roleErrorCount + " Error's in command\n"+ roleFileError + " Unconfigured roles found, staff should review the role list.")
            .setColor(color);
            message.channel.send({embed:otherEmbed});
        }
    }
    else
    {
     
    }
    return;
}
 
 if(args.length < 1)
 {
    message.channel.send("You didn't give me a role name");
 }
 else
 {
    if(isRole(arg))
    {
        if(message.guild.roles.find("name", replaceCharacters(arg, roleIndex)))
        { 
            let role = message.guild.roles.find("name", replaceCharacters(arg, roleIndex));
            if(message.member.roles.find("name", role.name))
            {
               
                message.member.removeRole(role).catch(console.error);
                const embedA = new Discord.RichEmbed()
                .attachFile(checkmarkFilePath)
                .setFooter("Role removed", checkmarkFileName)
                .setColor("#51ff71");
                message.channel.send({embed:embedA});
            }
            else
            {
            
            
            message.member.addRole(role).catch(console.error);            
            const embedR = new Discord.RichEmbed()
            .attachFile(checkmarkFilePath)
            .setFooter("Role added ", checkmarkFileName)
            .setColor("#51ff71");


            message.channel.send({embed:embedR});
            }

        }
        else
        {
            const unknownErrorEmbed = new Discord.RichEmbed()
            .attachFile(redxFilePath)
            .setDescription("Oops! I cannot find that role. Sorry, that's an error on us! We'll fix it as soon as possible.")
            .setAuthor("error", redxFileName)
            .setColor("#f4424b");
            message.channel.send({embed: unknownErrorEmbed})
            //message.channel.send('there was an issue adding role ' + arg + ' I have sent a message to my master, the issue will be fixed soon \n please try again another day');
            let members = message.guild.members;
            // find specific member in collection - enter user's id in place of '<id number>'
            let owner = members.find('id', botconfig.ownerId);
            // send Direct Message to member
            owner.send(message.member.displayName + " tried to add the role " + arg + " but failed you may have made a typo in the role" );
        }
    }
    else
    {
        var fieldTitle = "Not found";
        var similarRoles = "----";
        var sudjestions = SimilarRoles(arg);
      
        if(sudjestions != null && sudjestions.length > 0)
        {
            similarRoles = " ";
            for (let x = 0; x < sudjestions.length && x < 6; x++)
            {
                similarRoles += sudjestions[x].match + "\n";
            }
            fieldTitle = "Did you mean one of these? \n"
        }

        
        const failEmbed = new Discord.RichEmbed()
        .attachFile(redxFilePath)
        .setFooter("Oops! I cannot find that role. Did you misspell something? - Double check what you entered! Is the role not listed in the Pins? - Ask a staff member to add the role for you!"  , redxFileName)
        .setColor("#f4424b")
        .addField(fieldTitle, similarRoles);
        
        message.channel.send({ embed: failEmbed });
    }

 }
}
module.exports.use = (bot, message, args) =>{
    let helpStr = 'Usage: ' + botconfig.prefix + 'role <role name>';
        helpStr += '\nDescription: Adds the specified role if you do not already have it. If you do have the role it will be removed';
    return helpStr;
  }
  
module.exports.meta = {
      name: "role",
      role: "0"
  }

  module.exports.help = async (bot, message, args) =>{
    let helpStr = 'Usage: ' + botconfig.prefix + 'role <role name> \nList of valid roles: \n'
    await message.member.send(helpStr);
    message.channel.send("Please wait while I get the role list for you.")
    for(let i = 0; i < RolesStruct.Roles.length; i++)
    {
        let catString = "";
        catString += RolesStruct.Roles[i].catagoryName + '\n';
        for(let j = 0; j < RolesStruct.Roles[i].catagoryRoles.length; j++)
        {
            catString += (i.toString())  + ' '  + (j.toString()) + ' : ' + RolesStruct.Roles[i].catagoryRoles[j] + "\n";
        }
        await message.member.send(catString);
    }
    await message.member.send("Example of how to add more then one role at a time\n\`\`\`>role !0 0,0 1,1 2\`\`\`\n at the start of the command place a \'!\' " + 
    "before the first number pair, each number pair must be separated by a \, and each number pair must have a space between them")

    let msgstr = "The role list has been sent to you via DM!";
    return msgstr;

    }
