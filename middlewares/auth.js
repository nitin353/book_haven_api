import jwt from "jsonwebtoken"
export const  authenticateToken = async (req, res, next) => {
    const  token = req.header("Auth");
   console.log(token)
   if(token == null){
    return res.status(401).json({message: "Autheniticated token required"});
   }
   jwt.verify(token, "bookstore",(err, user)=> {
    if(err){
        console.log("enter auth page", err)
        return res.status(403).json(err);
    }
    req.user = user;
    console.log(user)
    next();
   })
};
// export default authenticateToken ;
export const isLibrarian = (req,res,next)=> {
    if (req.user && req.user.role === "Librarian"){
        next();
    }else{
        res.status(403).json({message: "Not authorized as librarian"})
    }
}
