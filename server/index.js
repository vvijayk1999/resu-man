const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const dotenv = require('dotenv')
dotenv.config();

const persistUserDetails = require("./database-operations/persistUserDetails")
const persistUserCredentials = require("./database-operations/persistUserCredentials")
const fetchUserCredential = require("./database-operations/fetchUserCredential")
const updateUserDetails = require('./database-operations/updateUserDetails')
const fetchUserDetails = require('./database-operations/fetchUserDetails')

const port = process.env.PORT
const userName = process.env.USERNAME;
const password = process.env.PASSWORD;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Hi Welcome to Resu-Man, We are under development. Soon you can expect our services. Thankyou')
})

const generateAccessToken = (username) => {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
      if (err) {
          console.log(err)
          return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  }

const authenticateUsernamePassword = (username, password) => {
    return new Promise((resolve, reject)=>{
        fetchUserCredential(username)
            .then((bcryptString) => {
                bcrypt.compare(password, bcryptString, (err, result) => {
                    resolve(result)
                });
            })
            .catch((err)=>{
                reject(err)
            })
    })
}

app.post('/getNewToken', (req, res) => {
    
    let errors=[]
    if (!req.body.username){
        errors.push("No username provided");
    }
    if (!req.body.password){
        errors.push("No password provided");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    authenticateUsernamePassword(req.body.username, req.body.password)
        .then((result)=>{
            if(!result){
                res.status(401).json({"error": "username or password is incorrect"});
                return;
            }
            const token = generateAccessToken({ username: req.body.username });
            res.json(token);
        })
        .catch(err => res.status(400).json(err))
});

app.post('/createUser', (req,res) => {
    let errors=[]
    if (!req.body.username){
        errors.push("No username provided");
    }
    if (!req.body.password){
        errors.push("No password provided");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    
    persistUserCredentials(req.body.username, req.body.password)
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            res.status(400).json(err)
        })
})

app.get('/userDetails', authenticateToken, (req, res)=>{
    fetchUserDetails(req.user.username)
        .then((result)=>{
            res.json(result);
        })
        .catch((err)=>{
            res.status(400).json(err);
        })
})

app.post('/userDetails', authenticateToken, (req, res)=>{
    var errors=[]
    if (!req.body.firstName){
        errors.push("No firstName specified");
    }
    if (!req.body.lastName){
        errors.push("No lastName specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.title){
        errors.push("No title specified");
    }
    if (!req.body.linkedIn){
        errors.push("No linkedIn specified");
    }
    if (!req.body.gitHub){
        errors.push("No gitHub specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    const {firstName, lastName, email, title, linkedIn, gitHub} = req.body;

    persistUserDetails(req.user.username, firstName, lastName, email, title, linkedIn, gitHub)
        .then(()=>{
            res.status(200).json({"message": "success"})
        })
        .catch(err => 
            res.status(400).json(err))
})

app.patch('/userDetails', authenticateToken, (req, res)=>{

    updateUserDetails({username: req.user.username, ...req.body})
        .then(()=>{
            res.status(200).json({"message": "success"})
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json(err)})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})