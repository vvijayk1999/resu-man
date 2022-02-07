const db = require("./database")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const persistUserCredentials = (username, password) => {
    return new Promise((resolve, reject) => {
        const queryInsert = 'INSERT INTO USER_CREDENTIALS (username, password) VALUES (?,?)'
        const queryFetch = 'SELECT * FROM USER_CREDENTIALS WHERE username = ?'
        
        db.get(queryFetch, [username], (err, row) => {
            console.log(row)
            if(row){
                reject({
                    error: 'username already exists, try different username'
                })
            }else{
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    db.run(queryInsert, [username, hash], (err, result)=>{
                        if(err){
                            return false;
                        }
                        else{
                            console.log(hash)
                            resolve({
                                message : 'user created'
                            })
                        }
                    });
                });
            }
        })
    })
};

module.exports = persistUserCredentials;