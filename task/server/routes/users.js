// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router();// Create an Express router
const cors = require('cors');//Import Cross-Origin Resource Sharing middleware
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
//Schemas
const User = require('../models/userSchema');// Import the User model

//=========SETUP MIDDLEWARE============
router.use(cors());// Enable Cross-Origin Resource Sharing for all routes
router.use(express.json());// Parse JSON bodies for incoming requests

/*
// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];    // Extract token from Authorization header
    //Conditional rendering to chexk if the token exists
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });// If no token is provided, deny access

    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'secretKey', (err, user) => {
        if (err) {
            // If token verification fails, deny access
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user; // Attach user data to request object
        next(); // Call next middleware
    });
};
*/
//========ROUTES==============

/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/

//-----------GET--------------
//Route to handle GET requests to fetch a single user
router.get('/user', /*authenticateToken,*/ async (req, res) => {
    console.log('Finding user');//Log a message in the console for debugging purposes
    try {
        // const user = await User.findOne({ username: req.user.username })
        const user = await User.findOne({ _id: req.user.userId });

        //Conditional rendering to check if the user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' }) // If user is not found, return 404 error
        }

        // Respond with the user details
        res.status(200).json({ message: 'Successfully fetched user details' });
        console.log('user details:', user);// Log the user details in the console for debugging purposes
    }
    catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
    }
})

//Route to handle GET request to fetch all users 
router.get('/findUsers', async (req, res,) => {
    console.log('Finding users')
    
    try {
        // Find users optionally filtered by username
        const { username } = req.query;// Extract username from request query
        const query = username ? { username } : {}; // Construct query object: if username is provided, filter by username, otherwise, fetch all users
        // const users = await User.find({ username });
        const users = await User.find(query); // Use the query object to find users
        console.log(users);// Log the users in the console for debugging purposes
            // Send a 201 Created response with a success message and the saved user object
        res.status(200).json(users);// Return found users
    }
    catch (error) {
        //Error handling
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal server Error' });// Send 500 status code and error message in JSON response
    }
});

//----------POST-------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) =>{
    console.log(req.body);//Log the request body in the console for debugging purposes
    console.log('User Login')//Log a message in the console for debugging purposes
    
    try {
        
        const {username, password} = req.body;//Extract the username and password from the request body
        const user = await User.findOne({username, password});// Find the user in the database by username and password
        console.log(user);//Log the user details in the console for debugging purposes

        //Conditional rendering to check if the user exists
        if (!user) {
            throw new Error('User not found');//Throw an error if the user is not found
        }

    // Conditional rendering to check if the provided password matches the user's password
        if (password === user.password) {
            const jwtToken = jwt.sign(
                { userId: user._id },//Payload containing userId
                        'secretKey',//SecretKey
                        /*process.env.JWT_SECRET,*/
                        {// Token expiration time and algorithm
                            expiresIn: '12h',// Token expiration time
                            algorithm: 'HS256',// Token signing algorithm
                        }
                    );
            res.json({ 'token': jwtToken })// Respond with the JWT token
        } 
        else {
            throw new Error('Password Incorrect');
        }
    } 
    catch (error) 
    {
        console.error('Login Failed: Username or password are incorrect', error.message);//Log an error message in the console for debugging purposes
        res.status(401).json({ message: 'User not authenticated' }); // Send a 401 (Unauthorized) status code and error message in JSON response
    }
})

//Route to send a POST request the register endpoint
router.post('/register', async (req, res) => {
    // console.log('Register User');
    console.log(req.body);//Log the request body in the console for debugging purposes
    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;//Extract the registration details from the request body
        
        // Conditional rendering to check if username already exists
          const existingUser = await User.findOne({ username });
        if (existingUser) {
            // If username already exists, return error response
            return res.status(400).json({ message: 'Username already exists' });
        };
        
        //Conditional rendering to check if the required fields are provided
                 if (!username || !email || !dateOfBirth || !password) {
              console.error('Username and password are required');
              return res.status(400).json({ message: 'Username and password are required' });
             /*If any field is missing, it returns a 400 (Bad Request) response with an error message*/
            }
        // Conditional rendering to check if the username already exists in the database
        const existingUser = await User.findOne({username});
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        };

        //Create a new user
        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password
        });

        const savedUser = await newUser.save();// Save the new user to the database

        // Generate a JWT token for the new user
        const token = jwt.token(
            { _id: savedUser._id, username: savedUser.username },//Payload containing userId
            'secretKey',//SecretKey
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',//Token expiration time
                 algorithm: 'HS256'//algorithm
                }
        );

        // Respond with the JWT token and user details
        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);//Log the new user details in the console for debugging purposes


    } catch (error) {
        console.error('Failed to add User');//Log an error message in the console for debugging purposes
        return res.status(500).json({error: 'Internal Server Error'})//Send a 500 (Internal Server Error) status response in the JSON response
    }
})

//--------------DELETE--------------------
//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id',  async (req, res) => {
    try {
        const {id} = req.params;// Extract the user ID from the request parameters

        const removedUser = await User.findByIdAndDelete(id);//Find the user and delete the user by ID

        //Conditional rendering to check if the removed user exists in the database
        if (!removedUser) {
            //If the user is not found, return a 404 (Not Found) response with an error message
            return res.status(404).json({message: 'User not found'})
        }

        res.json({//Send a JSON response back to the client
            message: 'User Successfully deleted',//Message indicating that the user was successfully deleted
            deletedUserId: removedUser._id //Deleted/removed user ID
        })

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error.message);// Log the error message in the console for debugging purposes
        res.status(500).json({error: 'Failed to delete User'});// Send a 500 Internal Server Error response with an error message
    }
})



module.exports = router;// Export the router to be used in other parts of the application
