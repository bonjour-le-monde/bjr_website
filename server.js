const express = require('express')
const path = require('path');
const axios = require('axios');
const qs = require('querystring')
const discordID = require('./discordapps-id')
const app = express();
const router = express.Router();
const routerRes = express.Router();
require('dotenv').config();

debug = process.env.DEBUG_MODE;


app.set("view engine", "pug")

function sendMyFile(res, filename)
{
    console.log('Sending '+filename+'...')
    res.sendFile(path.join(__dirname+'/'+filename))
}
routerRes.get(/(.*)/, function (req, res) {
    let filename = req.params[0]
    console.log('Sending resources '+filename+'...')
    res.sendFile(path.join(__dirname+'/res/'+filename))
})

app.use(express.urlencoded())
app.use(express.json())

app.get(/\/(.*\.(?:css|js|html))/, function (req, res) {
    sendMyFile(res, req.params[0])
})
app.use('/connexion', function (req, res){
    let code = req.body.code;
    let dataToDiscord = {
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': process.env.REDIRECT_URI,
        'scope': 'identify'
    }
    
    console.debug("req: ")
    console.debug(req)
    console.debug("code: ")
    console.debug(code)
    console.debug("dataToDiscord: ")
    console.debug(dataToDiscord)
    
    axios.post(process.env.API_ENDPOINT+"/oauth2/token", qs.stringify(dataToDiscord), {headers:{"Content-Type": "application/x-www-form-urlencoded"}})//
    .then(data=>{
        console.info("OAuth success")
        res.send(data.data)
    })
    .catch(err=>{
        console.error("OAuth failed: ")
        console.error(err)
    })
    // 
});
app.get("/getClientID", function (req, res) {
    res.send(discordID.CLIENT_ID)
})
app.use('/res/', routerRes);
app.get(/\/(?:onconnexion)?/, function (req, res) {
    res.render("index")
});
app.listen(80, function () {
  console.log('Example app listening on port 80!')
})