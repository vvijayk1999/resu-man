var sqlite3 = require('sqlite3').verbose()
const dotenv = require('dotenv')
dotenv.config();

const DBSOURCE = process.env.DBSOURCE 

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE USER_DETAILS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text UNIQUE,
            firstName text,
            lastName text, 
            email text, 
            title text,
            linkedIn text,
            gitHub text,
            CONSTRAINT username_unique UNIQUE (username)
            )`,(err) => {
                if(err)console.log(err)
            }
        )
        db.run(`CREATE TABLE USER_CREDENTIALS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text UNIQUE,
            password text, 
            CONSTRAINT username_unique UNIQUE (username)
            )`,(err) => {
                if(err)console.log(err)
            }
        )
    }
})


module.exports = db