// Custom Verifier Server Sample Code

// Import express for creating API's endpoints
const express = require("express");

// Import jwt for API's endpoints authentication
const jwt = require("jsonwebtoken");

// Creates an Express application, initiate
// express top level function
const app = express();

// A port for serving API's
const port = 9980;

// A fake database object
let database = [
	{
		name: "admin",
		password: "abc",
	},
	{
		name: "arcana",
		password: "123",
	},
];

// A demo get route
app.get("/", (req, res) => {
	res.json({
		route: "/",
		authentication: false,
	});
});

// Allow json data
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Login route
app.post("/login", (req, res) => {
	// Get the name to the json body data
	const name = req.body.name;
	// Get the password to the json body data
	const password = req.body.password;
	// Make two variable for further use
	let isValidUser = false;
	let userIndex = null;
	// iterate a loop to the data items and
	// check what data are matched.
	for (let i = 0; i < database.length; i++) {
		// If data name are matched so check
		// the password are correct or not
		if (database[i].name === name
			&& database[i].password === password) {

			// If both are correct so make 
			// isValidUser variable true
			isValidUser = true;

			// And store the data index
			userIndex = i;

			// Break the loop after matching successfully
			break;
		}
	}
	// If isValideUser is true, then create a
	// token and pass to the response
	if (isValidUser) {
		// The jwt.sign method are used
		// to create token
		const token = jwt.sign(database[userIndex], "secret");

		// Pass the data or token in response
		res.json({
			login: true,
			token: token,
			data: database[userIndex],
		});
	} else {

		// If isValidUser is false return the error
		res.json({
			login: false,
			error: "Not a valid user.",
		});
	}
});

// Verify route
app.get("/verify", (req, res) => {

	// Get token value to the json body
	const token = req.body.token;

	// If the token is present
	if (token) {

		// Verify the token using jwt.verify method
		const decode = jwt.verify(token, "secret");

		// Return response with decode data
		res.json({
			login: true,
			data: decode,
		});
	} else {

		// Return response with error
		res.json({
			login: false,
			data: "error",
		});
	}
});

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})

// Listen the server
app.listen(port, () => {
	console.log(`Custom User Verifier Server is running : 
	http://localhost:${port}/`);
});
