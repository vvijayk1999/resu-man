const db = require("./database")

const persistUserDetails = (username, firstName, lastName, email, title, linkedIn, gitHub) => {

    return new Promise((resolve, reject)=>{
        const queryInsert = 'INSERT INTO USER_DETAILS (username, firstName, lastName, email, title, linkedIn, gitHub) VALUES (?,?,?,?,?,?,?)'
        const queryFetch = 'SELECT * FROM USER_DETAILS WHERE username = ?'

        db.get(queryFetch, [username], (err, row) => {
            if(row){
                reject({err: 'details already exists, try updating it.'})
            }else{
                db.run(queryInsert, [username, firstName, lastName, email, title, linkedIn, gitHub], (err, result)=>{
                    if(err){
                        reject({err: 'unable to insert record'})
                    }
                    else{
                        resolve()
                    }
                });
            }
        })
    })
    
}

module.exports = persistUserDetails;