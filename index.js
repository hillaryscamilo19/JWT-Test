const Express = require("express");
const JWT = require("jsonwebtoken");
const { beforeEach } = require("node:test");
const { type } = require("os");
const { json } = require("stream/consumers");
const app = Express();

app.get("/", (req, res) => {
  res.json({
    Text: "api work!",
  });
});

app.post('/api/login', (req, res) => {
  const user = { id: 3 };
  const token = JWT.sign({ user }, 'My_secret_key', {expiresIn: '3h'});
  res.json({
    token
  });
});

app.get('/api/protected', ensuretoken, (req, res) => {
        console.log(req.user)
        res.send('hola')
});

function ensuretoken(req, res, next) {
  const beareHeader = req.headers['authorization'];
  if (typeof beareHeader !== 'undefined') {
    const bearer = beareHeader.split(" ");
    const bearerToken = bearer[1];
    const user = JWT.verify(bearerToken, 'My_secret_key', 
    (error) => {
        if(error) {
            res.status(401).json({'message': "Unauthorized"})
        }
        else {
            req.user =bearerToken
            next()
        }
    }
    )
  }
}

app.listen(3000, () => {
  console.log("Server on port 3000");
});
