import express from  "express"
import colors from  "colors"

const app = express();


app.get('/',(req,resp) =>{
    resp.send("hello from backend")
})
app.get('/about',(req,resp)=>{
    resp.send('welcome')
})
app.get('/con',(req,resp)=>{
    resp.send(`"<h1>hlo</h1><h1>hlo</h1>
        <p>edfvgbhnjmk,</p>
        "`)
})

app.listen(4000,() =>{
    console.log("server started".blue);
})