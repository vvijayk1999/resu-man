const db = require("./database")
const fetchUserDetails = require("./fetchUserDetails")

const updateUserDetails = (userDetails) => {

    return new Promise((resolve, reject)=>{
        const queryUpdate = 'UPDATE USER_DETAILS SET firstName=?, lastName=?, email=?, title=?, linkedIn=?, gitHub=? WHERE username=?'

        fetchUserDetails(userDetails.username)
            .then((result)=>{
                var updatedUserDetails = {...result, ...userDetails}
                console.log(updatedUserDetails)
                const {username, firstName, lastName, email, title, linkedIn, gitHub} = updatedUserDetails

                db.run(queryUpdate, [firstName, lastName, email, title, linkedIn, gitHub, username], (err, result)=>{
                    if(err){
                        reject({err: 'unable to insert record'})
                    }
                    else{
                        resolve()
                    }
                });
            })
            .catch((err)=>{
                reject(err)
            })
    })
    
}

module.exports = updateUserDetails;