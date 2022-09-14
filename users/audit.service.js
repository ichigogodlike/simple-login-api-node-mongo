const audit=require('./audit.model');

async function login(user){
    const newuser={
       username:  user.username,
       loginDate: new Date().now(),
       logoutDate: null
    }
   await newuser.save()
}

async function logout(user){
   const newuser=audit.findOne({username : user.username , logoutDate:null})
   if(newuser){
   const modifieduser={
        ...user,
        logoutDate: new Date().now()
    }
   }
   await modifieduser.save();
   return true;
}
async function getAll(){
    const users=await audit.find()
    return users
}

module.exports={
    login,
    logout,
    getAll
}