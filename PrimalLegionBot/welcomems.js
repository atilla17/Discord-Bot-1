/*
file         : welcomems.js
Author       : Atilla Puskas
Date         : 2018-06-01
Last modified: 2018-06-01

desc: parses a pre written welcom message and replaces "username" with the a username

note: make sure there is allways a space before and after "username"

*/


 var channelMentionl; 


 var welcomeMessages = ["Welcome to the Legion, \n username !",
                        "hi username  Nice of you to join the Legion!"];

                
                                      
NewWelcomMessage = function SelectMessage(username)
{
   //TODO: add code to randomly select a message from the above array 
  var output = welcomeMessages[0];
  var output = replace(output, username);

  return output;
}

function replace(str, username)
{
  var min = 0;
  var max = 0;  
  
  var contents = str.split(" ");

  var result = "";

  for(let i =0; i < contents.length;  i++)
  {
    if(contents[i] === "username")
    {
      contents[i] = "<@" + username + ">";
      result += contents[i];
    }
    else
    {
        if(contents[i-1] === "username" && contents[i].length != 1)
        {
          result += " ";
        }
        result += contents[i] + " ";
    }
  }

  return result;
}

module.exports = NewWelcomMessage;


