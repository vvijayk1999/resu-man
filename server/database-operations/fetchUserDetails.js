const db = require("./database")
const queryFetch = 'SELECT * FROM USER_DETAILS WHERE username = ?'

const fetchUserDetails = (username) =>{
    return new Promise((resolve, reject)=>{
        db.get(queryFetch, [username], (err, row) => {
            if(row){
                resolve(row)
            }else{
                reject({
                    error: 'no such username exists'
                })
            }
        })
    })
}

module.exports = fetchUserDetails