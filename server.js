const express = require('express')
const path = require('path');
const axios = require('axios');
const qs = require('querystring')
const app = express();
const router = express.Router();
const routerRes = express.Router();

debug=false;

var API_ENDPOINT = 'https://discordapp.com/api'
var CLIENT_ID = '667490129224532012'
var CLIENT_SECRET = 'qAWT5BHnUE13ahQ7Xp3P9lSAhGymozUc'
var REDIRECT_URI = 'http://localhost/onconnexion'

app.set("view engine", "pug")

function sendMyFile(res, filename)
{
    console.log('Sending '+filename+'...')
    res.sendFile(path.join(__dirname+'/'+filename))
}
routerRes.get(/(.*)/, function (req, res) {
    var filename = req.params[0]
    console.log('Sending resources '+filename+'...')
    res.sendFile(path.join(__dirname+'/res/'+filename))
})

app.use(express.urlencoded())
app.use(express.json())

app.get(/\/(.*\.(?:css|js|html))/, function (req, res) {
    sendMyFile(res, req.params[0])
})
app.use('/connexion', function (req, res){
    var code = req.body.code;
    var dataToDiscord = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'scope': 'identify'
    }
    
    console.debug("req: ")
    console.debug(req)
    console.debug("code: ")
    console.debug(code)
    console.debug("dataToDiscord: ")
    console.debug(dataToDiscord)
    
    axios.post(API_ENDPOINT+"/oauth2/token", qs.stringify(dataToDiscord), {headers:{"Content-Type": "application/x-www-form-urlencoded"}})//
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
app.use('/res/', routerRes);
app.get(/\/(?:onconnexion)?/, function (req, res) {
    res.render("index")
});
app.listen(80, function () {
  console.log('Example app listening on port 80!')
})