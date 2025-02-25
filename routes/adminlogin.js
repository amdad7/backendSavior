const Donor = require("../model/donor");
const Authentication = require("../auth");
const authentication = new Authentication();
const bcrypt = require("bcryptjs");
const { admin } = require("googleapis/build/src/apis/admin");
const Admin=require('../model/admin')
module.exports = async (req, res) => {
  try {
    //console.log(req.headers)
    let email = req.headers.username;
    let password = req.headers.password;
    
    
    //const redirect=0
    //console.log(redirect)
    if (!email || !password) {
      return res
        .status(200)
        .json({ 'status':0 ,'messege': "both Email & Password are required" });
    }
    let donor = await Admin.findOne({ username: email });
    if(donor){
      
      if (donor.password!=password) {
        return res.status(200).json({ 'status':0, 'messege': "wrong password" });
      }
      else {
        let payloadToCreateToken = {
          userType: "admin",
          id: donor._id,
          name: donor.name,
          email: donor.username,
          phone: donor.phone,
        };
        let token = authentication.createToken(payloadToCreateToken);
        let jwtOptions = { expiresIn: 60*60*12*1000 ,httpOnly:true, maxAge:60*60*100*1000,sameSite: 'none', secure: true};
        
        //return res.status(200).json({ token });

        //console.log(req.headers)
        res.cookie('accesstoken',token,jwtOptions)
        res.cookie('email',email,{maxAge:60*60*100*1000,encode:String,sameSite: 'none', secure: true},)
        res.status(200)
        return res.status(200).json({'status':1,'token':token,'email':email})
      }
    }
    else{
      return res.status(200).json({'status':"0",'messege': "No User Found with the given email" });
    }
  }catch (err) {
   // console.log(
     // `err creating token for admin`,
     // err
   // );
  }
};
