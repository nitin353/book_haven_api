import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { user_model } from "../Models/User_model.js";
import { Otp_model } from '../Models/Otp_model.js';
import nodemailer from 'nodemailer'
export const signUp = async (req,res) => {
    try{
        const {name, email,stream, password, role} =req.body;
        console.log(password)
        const existingEmail= await user_model.findOne({email});
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists", success:false});
        }
        if (password.length <=5) {
            return res.json({message:"Password's length should be greater than 5"})
        }
         const hash_password = await bcrypt.hash(password,10)
        const newUser = new user_model({ name,email,stream,password:hash_password,role});
        await newUser.save();
        return res.json({ message: "signup successfully", success:true});
        
    }catch(error)
    {
        return res.json({message:"internal server error",error:error, success:false});
    }
}
export const signIn = async (req,res)=> {
    try{
        const {email,password} = req.body;
        console.log("get value==",email)
        const existingUser = await user_model.findOne({email});
        if (!existingUser){
            console.log("existing")
            return res.json({message: "invalid credential",success:false})
        }
        const valid_password =await bcrypt.compare(password,existingUser.password)
        
        if (valid_password){
            const auth_data = {
                name:existingUser.name,
                role: existingUser.role,
                userid:existingUser._id,
                stream:existingUser.stream,
                
            }
            const  token_id = jwt.sign(auth_data,'bookstore',{expiresIn:"30d"});
            return res.json({
                id:existingUser._id,

                role:existingUser.role,
                token:token_id ,
                success:true
            })
        }
    } catch(error){
        res.json({message: `internal server error ${error}`,success:false})
    }
}
export const getUser = async (req, res) => {
    try{
        // const {id} = req.headers;
        // const data = await user_model.findById(id).select('-password');
        // if(!data){

        // }
        // return res.status(200).json(data);
        res.json({user:req.user})
    }catch (error) {
        res.json({ message: "internal server error", error:error});
    }
}
export const updateAddress = async (req, res)=> {
    try{
        const {id} = req.headers;
        const {address} = req.body;
        await user_model.findByIdAndUpdate(id,{address: address});
        return res.status(200).json({message : "address updated"});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
}
export const getUsers = async (req, res) => {
    try{
        const {id} = req.headers;
        const data = await user_model.find().select('-password');
        if(!data){

        }
        return res.status(200).json(data);
    }catch (error) {
        res.status(500).json({ message: "internal server error", error:error});
    }
}

const mailer = (email, otp)=>{
    const transporter = nodemailer.createTransport(
        {
            service:"gmail",
            secure: false,
            port:587,
            auth:{
                user:"gadgetgalaxy3010@gmail.com",
                pass:"zrro gtxb gwlm hmzh",
            }

        }
    )
    console.log("define variable")
    const mail_options={
        from:'gadgetgalaxy3010@gmail.com',
        to:email,
        subject:"sending Email using Node . js",
        text:`thank you sir !!!! your otp: ${otp}`
    }

    console.log( "mail option", mail_options)
    return transporter.sendMail(mail_options);
    // transporter.sendMail(mail_options, function(error,info){
    //     if(error){
    //         console.log("error==========",error)
    //     }
    //     else{
    //         console.log("email send ================", info)
    //     }
    // })
}

export const send_email = async (req,resp) => {
    console.log(req.body.email)
    let data = await user_model.findOne({email: req.body.email});
console.log("data" )
    if (data){
console.log("enter if")
        let otp_code = Math.floor((Math.random()*10000 )+ 1);
        console.log(otp_code)
        let otp_data = new Otp_model({
            email: req.body.email,
            code:otp_code,
            expireIn : new Date(). getTime() +300*1000
        })

        console.log("otp data", otp_data)
 await otp_data.save()
const x= mailer(req.body.email,otp_code)
console.log("x", x)
if (x){
    resp.status(200).json({msg:'please check your email id  ', success: true});
}
else{
    resp.status(400).json({msg:'something wrong', success: false});
}
         
        //  resp.status(400).json({msg:'email send', success: true});
        }
          
          else{
            resp.status(400).json({msg:'email id is not register', success: false});
          }
    }
    export const changePassword = async (req,resp) =>{
        const data = await Otp_model.find({email: req.body.email,code:req.body.otp_code});
        if(data){
            const currentTime = new Date().getTime();
            const diff= data.expireIn - currentTime;
            if (diff<0){
                resp.status(400).json({msg:'token expire',success:false});

            }
            else{
                let user = await user_model.findOne({email: req.body.email})
                // const pw =

                user.password= await bcrypt.hash(req.body.password,10);;
                user.save()
                resp.json({msg:'password successfuly changed', success: true})
            }
        }
        else{
            resp.json({msg:'invalid otp',success:false});
        }
    }
    export const AllUsers = async (req,res) => {
        try{
            const users = await user_model.find()
            res.status(200).json(users)
        }catch(error){
            console.log(error);
            return res.status(500).json({message:" An error occured"})
        }
    }
