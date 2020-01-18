import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import * as axios from 'axios';
import * as qs from 'querystring';
import * as dotenv from 'dotenv';
import { DiscordAuthenticator } from './DiscordAuth';
import * as passport from 'passport'

const cd = __dirname+'/../';

dotenv.config();
{
    let missingVarsEnv: string="";
    let arrvarenv = ["CLIENT_ID", "CLIENT_SECRET", "MY_URI", "API_ENDPOINT"]
    arrvarenv.forEach(varEnv => {
        if (!process.env[varEnv])
            missingVarsEnv+=`- ${varEnv}\n`
    });
    if (missingVarsEnv!=="")
        throw new Error(`Les variables d'environnements suivante n'ont pas été définies:\n${missingVarsEnv}\n`)
}
const app = express();

const router = express.Router();
const routerRes = express.Router();
let discordAuth = new DiscordAuthenticator(passport)

let debug: boolean = process.env.DEBUG_MODE=="true";


app.set("view engine", "pug")

function sendMyFile(res, filename)
{
    console.info('Sending '+filename+'...')
    res.sendFile(path.join(cd+filename))
}
routerRes.get(/(.*)/, function (req, res) {
    let filename = req.params[0]
    console.info('Sending resources '+filename+'...')
    res.sendFile(path.join(cd+"res"+filename))
})

app.use(express.urlencoded())
app.use(express.json())

app.use(session({
    secret: 'keyboard cat'
  }))

app.use(passport.initialize());
app.use(passport.session());

app.get(/\/(.*\.(?:css|js|html))/, function (req, res) {
    sendMyFile(res, req.params[0])
})
discordAuth.configureRoutes(app);
// app.use('/connexion', function (req, res){
//     let code = req.body.code;
//     let dataToDiscord = {
//         'client_id': process.env.CLIENT_ID,
//         'client_secret': process.env.CLIENT_SECRET,
//         'grant_type': 'authorization_code',
//         'code': code,
//         'redirect_uri': process.env.REDIRECT_URI,
//         'scope': 'identify'
//     }
    
//     console.debug("req: ")
//     console.debug(req)
//     console.debug("code: ")
//     console.debug(code)
//     console.debug("dataToDiscord: ")
//     console.debug(dataToDiscord)
//     axios.default.post(process.env.API_ENDPOINT+"/oauth2/token", qs.stringify(dataToDiscord), {headers:{"Content-Type": "application/x-www-form-urlencoded"}})//
//     .then(data=>{
//         console.info("OAuth success")
//         res.send(data.data)
//     })
//     .catch(err=>{
//         console.error("OAuth failed: ")
//         console.error(err)
//     })
//     // 
// });
app.use('/res/', routerRes);
app.get("/", function (req, res) {
    if(typeof req.user === 'object' && req.user)
        res.render("index", {
            user: req.user
        })
    else
        res.render("index")

});
app.listen(80, function () {
  console.log('Example app listening on port 80!')
})