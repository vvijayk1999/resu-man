const db = require("./database")
const queryFetch = 'SELECT * FROM USER_CREDENTIALS WHERE username = ?'

const fetchUserCredential = (username) =>{
    return new Promise((resolve, reject)=>{
        db.get(queryFetch, [username], (err, row) => {
            if(row){
                resolve(row.password)
            }else{
                reject({
                    error: 'no such username exists'
                })
            }
        })
    })
}

module.exports = fetchUserCredential