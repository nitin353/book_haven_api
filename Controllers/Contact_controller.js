
import { Contact_model } from "../Models/Contact_model.js";
export const contact = async( req, resp)=>{
    const {name,email,phone,message}= req.body;
    console.log("calling")
    try{
        let contact_data= await new Contact_model({name,email,phone,message});
        const x= await contact_data.save()
        console.log("data added")
      
            
        resp.json({msg:" successfully added", success:true,x})
       
    }
    catch(err){
        resp.json({msg:err})
    }
    }