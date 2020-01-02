const express = require('express')
const path = require('path');
const app = express();
const router = express.Router();
const routerRes = express.Router();

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

router.get('/', function (req, res) {
    sendMyFile(res, "index.html")
})
router.get(/\/(.*\.(?:css|js|html))/, function (req, res) {
    sendMyFile(res, req.params[0])
})
app.use('/', router);
app.use('/res/', routerRes);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})