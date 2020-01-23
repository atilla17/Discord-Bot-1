Node.js is required to run the application

To run the program first go to

https://discordapp.com/developers/applications/

Create a bot account and obtain a apikey

open botconfig.json and place the key in the 'token' field.


Then on the discord app or website create a new server and invite the bot account into it.

Then fill out the remaining config feilds.


OwnerId: The account id for your own discord account.
prefix: The symbol that will tell the bot you are trying to run a command
WekcineCh : The name of the text channel you want welcome messages appearing in
RoleCh: The name of the text chanel the role command can be run in
roleAdmin: The ID of the role required to run Administrative commands
roleTrusted: The ID of the role required to allow some of the Administrative commands
roleMember: The ID of the role to be automaticly assigned to all regular members.




Next if you would like the role command to function you will need to open the file

roles.json

Create roles in your server then assign them to catagorys using the role names as they appear in discord
Delete any unused roles from the role file however the command will tollorate errors in the file as long
as the json format is not broken.

On windows run Start.bat

On any other platform type node app.js


Note some commands require the existance of server emoji's with the names

'zthonk'
'ztongue'
