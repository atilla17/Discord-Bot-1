const Discord = require('discord.js');
const botconfig = require('../botconfig.json');

var faq = {
    "questions":[
        //Edit this section only
        {"q": "question1", "a":"aswer1"},
        {"q": "question2", "a":"aswer2"},
        {"q": "question3", "a":"aswer3"},
        {"q": "question4", "a":"aswer4"},
        {"q": "question5", "a":"aswer5"},
        {"q": "question6", "a":"aswer6"},
        {"q": "question7", "a":"aswer7"},
        {"q": "question8", "a":"aswer8"},
        {"q": "question9", "a":"aswer9"},
        {"q": "question10", "a":"aswer10"},
        {"q": "question11", "a":"aswer11"},
        {"q": "question12", "a":"aswer12"},
        {"q": "question13", "a":"aswer13"},
        {"q": "question14", "a":"aswer14"}
        /*End of edit section, Edit carefuly typo's will ressult in the bot crashing */]
        /*Referance format {"q": "question", "a": "answer"} every line must end with , except for the last one
        compare to format below if you experiance any issues
        ------------------------------------
        {"q": "question1", "a":"aswer1"},
        {"q": "question2", "a":"aswer2"},
        {"q": "question3", "a":"aswer3"},
        {"q": "question4", "a":"aswer4"},
        {"q": "question5", "a":"aswer5"},
        {"q": "question6", "a":"aswer6"},
        {"q": "question7", "a":"aswer7"},
        {"q": "question8", "a":"aswer8"},
        {"q": "question9", "a":"aswer9"},
        {"q": "question10", "a":"aswer10"},
        {"q": "question11", "a":"aswer11"},
        {"q": "question12", "a":"aswer12"},
        {"q": "question13", "a":"aswer13"},
        {"q": "question14", "a":"aswer14"}
        ------------------------------------
        */
}

module.exports.run =  (bot, message, args) => {

    var messageString = "Frequently Asked Questions \n\n"

    for (let i = 0; i < faq.questions.length; i++)
    {
         messageString +=  "    Q: " + faq.questions[i].q +
                          "\n    A: " + faq.questions[i].a + "\n\n";    
    }   
    
    messageString += "Server Staff:\n <@232974806591471617>\n <@336731049268609026> "

    message.member.send(messageString);
    message.channel.send("I just sent you all the info, hope it helps!");
}
module.exports.use = (bot, message, args) =>{
    
    var helpStr = 'Shows a list of frequently asked questions';
    return helpStr;
  }
  
module.exports.meta = {
      name: "faq",
      role: "0"
  }

  module.exports.help = (bot, message, args) =>{
    let msgstr = "Usage: " + botconfig.prefix + "faq";
    return msgstr;

  }