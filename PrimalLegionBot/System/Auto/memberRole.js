const botconfig = require('../../botconfig.json');


var isStaff = ((r_, member) =>{
   
   var flag = false;
    r_.forEach(role =>{
        if(member.roles.find("name", role))
        {
            flag = true;
        }
    })

    return flag;

});

module.exports.RunForPreExisting = (async (guild) =>{
        
       //DO NOT EDIT OUTSIDE THESE BOUNDS---------------------------------
       var StaffRoles = ["Owner",
                          "Helper",
                           "BOT"]; 
       // format var StaffRoles = ["role1", "role2"]; ...etc                    
       //------------------------------------------------------------------
        guild.members.forEach(async (member) => {

            var flag = isStaff(StaffRoles, member);
            console.log("checking roles for " + member.displayName);
            if(!member.roles.find("id", botconfig.roleMember) && flag == false)
            {
                console.log("Missing member role added. for  " + member.displayName);
                member.addRole(botconfig.roleMember).catch(console.error);
            }
            global.PrefSys.setUp(member);
            
          });      
});

module.exports.Run = (async (member) => {
    member.addRole(botconfig.roleMember).catch(console.error);
});