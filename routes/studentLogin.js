const Student = require("../model/student");
const Authentication = require("../auth");
const authentication = new Authentication();
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  try {
    let email = req.headers.email;
    let password = req.headers.password;
    if (!email || !password) {
      return res
        .status(200)
        .json({ 'status':0, 'messege': "wrong password"});
    }
    let student = await Student.findOne({ email: email });
    if(student){
      let isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        return res.status(200).json({ 'status':0, 'messege': "wrong password" });
      }
      else if(isPasswordValid){
        let payloadToCreateToken = {
          userType: "student",
          id: student._id,
          grade: student.grade,
          name: student.name,
          email: student.email,
          phone: student.phone,
        };
        let token = authentication.createToken(payloadToCreateToken);
        let jwtOptions = { expiresIn: 60*60*12*1000 ,httpOnly:true, maxAge:60*60*100*1000,sameSite: 'none', secure: true};
        res.cookie('accesstoken',token,jwtOptions)
        res.cookie('email',email,{maxAge:60*60*100*1000,encode:String,sameSite: 'none', secure: true})
        //res.status(200)
        return res.status(200).json({'status':1,'token':token,'email':email})
        
      
      }
    }
    else{
      return res.status(404).json({ 'status':"0",'messege': "No User Found with the given email" });
    }
  }catch (err) {
    //console.log(
      //`err creating token for student `,
      //err
   // );
   return res.status(500)
  }
};
