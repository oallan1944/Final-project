
const db = require('../config/db'); //connect to db
const bcrypt = require('bcryptjs'); //hashing passwords
const{validationResult} = require('express-validator'); // validation

//function to register user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    // check if any errors present
    if(!errors.isEmpty()){
        return res.status(400).json({ messege: "please correct input errors", errors:errors.array})
    }

    //fetching input parameters from request body
    const { name, email, passord } = req.body;

    try{
        //check if user exists
        const[user] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        if(user.length > 0){
            return res.status(400).json({ messege: 'The user already exists '});
        }
        //prepare our data, hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //insert records
        await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword ]);
        //response
        return res.status(201).json({ messege: 'new user registered successesfully. '});
    } catch(error){
        console.error(error);
        res.status(500).json({ messege: 'An error occured during registeration', error: error.messege});
    }
}

//login function
exports.loginUser = async (req, res) => {
    //fetct email and password from request body
    const {email, passord} = req.body;

    try {
        //check if user exists
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if(user.length === 0){
            return res.status(400).json( {messege: 'The user does not exist'});
        }
        //check the passwords
        const isMatch = await bcrypt.compare(password, user[0].password);
        if(!isMatch){
            return res.status(400).json({ messege: 'Invalid email/password combination'})
        }
        //create a session data
        req.session.userId = user[0].id;
        req.session.name = user[0].name;
        req.session.email = user[0].email;

        return res.status(200).json({ messege: 'Successesfully logged in'});
    } catch(error) {
        console.error(error);
        return res.status(500).json({ messege: 'An Error occured while logging in', error: error.messege});
    }
}

//logout function
exports.logoutUser = (req, res) => {
    req.session.destroy( (err) => {
        if(err){
            console.error(err);
            return res.status(500).json({ messege: 'An error occured. ', error: err.messege});
        }
        return res.status(200).json({ messege: 'successesfully logged out'});
    });
}
//funtion to get user information for editing
exports.getUser = async (req, res) => {
    //check whether the user is logged in or authorised
    if(!req.session.userId){
        return res.status(401).json({ messege: 'Unauthorised'});
    }
    try{
        //fetch user
        const [user] = await db.execute('SELECT name, email FROM users WHERE id = ?', req.session.sessionId);
        if(user.length === 0){
            return res.status(400).json({ messege: 'User not found'});
        }
        return res.status(200).json({messege: 'User details fetched for editing', user:user[0]});
    }catch(error){
        console.error(error);
        return res.status(500).json({ messege: 'An error occured while fetching user details', error: error.messege});
    }
}
//function for editing
exports.editUser = async (req, res) => {
    if(!req.session.userId){
        return res.status(400).json({ messege: 'Unauthorised, please login to continue'});
    }
    const errors = validationResult(req);
    //check if any errors in the validation
    if(!errors.isEmpty()){
        return res.status(400).json({messege: 'please correct input errors', errors:errors.array()});
    }
    //fetch user details from request body
    const {name, email, password } = req.body;
    //prepare data =hashed password
    const hashedPassword = await bcrypt.hash(passord, 10);
   

try{
    //update user details
    await db.execute('UPDATE users SET name =?, password = ? WHERE id = ? ', [name, email, hashedPassword]);
    return res.status(200).json({messege: 'User details updated successesfully'});
}catch(error){
    console.error(error);
    return res.status(500).json({ messege: 'An Error occured during edit', error: error.messege});
}
}