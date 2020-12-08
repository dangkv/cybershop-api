const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.raw({ type: "*/*" }));
app.use(cors());
app.use(morgan('combined'));

let cartTable = new Map();
let chatTable = new Map();
let itemTable = new Map();
let purchaseHistoryTable = new Map();
let sellerReviewTable = new Map();
let shipTable = new Map();
let tokenTable = new Map();
let userTable = new Map();

let counter = 0

// responses ===================================================================

const GLOBAL_RES = {
    invalidToken: {"success": false, "reason": "Invalid token"},
    missingTokenField: {"success": false, "reason": "token field missing"},
};

const POST_CHANGE_PW_RES = {
    good: {"success": true},
    invalidPassword: {"success": false, "reason": "Unable to authenticate"},
    missingNewPasswordField: {"success": false, "reason": "newPassword field missing"},
    missingOldPasswordField: {"success": false, "reason": "oldPassword field missing"},
};

const POST_CREATE_LISTING_RES = {
    good: {"success": true},
    missingDescriptionField: {"success":false,"reason":"description field missing"},
    missingPriceField: {"success":false,"reason":"price field missing"},
}

const POST_LOGIN_RES = {
    good: {"success": true, "token": undefined},
    invalidPassword: {"success": false, "reason": "Invalid password"},
    missingUsernameField: {"success": false, "reason": "username field missing"},
    missingPasswordField: {"success": false, "reason": "password field missing"},
    usernameNotExist: {"success": false, "reason": "User does not exist"},
};

const POST_SIGNUP_RES = {
    good: {"success": true},
    usernameExist: { "success": false, "reason": "Username exists" },
    missingUsernameField: { "success": false, "reason": "username field missing"},
    missingPasswordField: { "success": false, "reason": "password field missing"},
};


// api endpoints ===============================================================

// GET -------------------------------------------------------------------------

// app.get("/cart", (req, res) => {

// });

// app.get("/listing", (req, res) => {

// });

// app.get("/selling", (req, res) => {

// });

app.get("/sourcecode", (req, res) => {
    res.send(require('fs').readFileSync(__filename).toString());
});

// app.get("/status", (req, res) => {

// });

// app.get("/reviews", (req, res) => {

// });

// POST ------------------------------------------------------------------------

// app.post("/add-to-cart", (req, res) => {

// });

app.post("/change-password", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;
    let token = req.headers["token"];

    console.log("request: /change-password-", body);

    reqJSON = {oldPassword: body.oldPassword, newPassword: body.newPassword};

    res.send(postChangePassword(token, reqJSON));
});

// app.post("/chat", (req, res) => {

// });

// app.post("/chat-messages", (req, res) => {

// });

// app.post("/checkout", (req, res) => {

// });

app.post("/create-listing", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;
    let token = req.headers["token"];

    console.log("request: /create-listing", body);

    reqJSON = {price: body.price, description: body.description};

    res.send(postCreateListing(token, reqJSON));

});

app.post("/login", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;

    console.log("request: /login-", body);

    reqJSON = { username: body.username, password: body.password };

    res.send(postLogin(reqJSON));
});

// app.post("/modify-listing", (req, res) => {

// });

// app.post("/purchase-history", (req, res) => {

// });

// app.post("/ship", (req, res) => {

// });

app.post("/signup", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;

    console.log("request: /signup-", body);

    reqJSON = {username: body.username, password: body.password}

    res.send(postSignUp(reqJSON));
});

// app.post("/review-seller", (req, res) => {

// });

// others ----------------------------------------------------------------------
app.listen(process.env.PORT || 3000)

// functions ===================================================================

// endpoint functions ----------------------------------------------------------

let postChangePassword = (token, reqJSON) => {
    let response = postChangePasswordValidation(token, reqJSON);

    if (response["success"]) {
        let newPassword = reqJSON.newPassword;
        let username = tokenTable.get(token)["username"];

        userTable.get(username)["password"] = newPassword;
        console.log("Your password has been changed");
    };

    console.log("response: /change-password-", response);
};

let postChangePasswordValidation = (token, reqJSON) => {
    let newPassword = reqJSON.newPassword;
    let oldPassword = reqJSON.oldPassword;

    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };

    let username = tokenTable.get(token)["username"];

    // check for missing newPassword field
    if (newPassword === undefined) {
        return POST_CHANGE_PW_RES["missingNewPasswordField"];
    };
    // check for missing oldPassword field
    if (oldPassword === undefined) {
        return POST_CHANGE_PW_RES["missingOldPasswordField"];
    };
    // check for valid old password
    if (userTable.get(username)["password"] !== oldPassword) {
        return POST_CHANGE_PW_RES["invalidPassword"];
    };

    return POST_CHANGE_PW_RES["good"];
};

let postCreateListing = (token, reqJSON) => {
    let description = reqJSON.description;
    let newId = genId();
    let price = reqJSON.price;
    let response = postCreateListingValidation(token, reqJSON);

    if (response["success"]) {
        let username = tokenTable.get(token)["username"];
        response["success"]["listingId"] = newId;

        let item = {
            seller: username,
            description: description,
            price: price,
            isSold: false,
        };

        itemTable.set(newId, item);
        console.log("Thank you for listing an item at cybershop");
    };

    console.log("response: /create-listing-", response);
    return response
};

let postCreateListingValidation = (token, reqJSON) => {
    let description = reqJSON.description;
    let price = reqJSON.price;

    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };

    // check for missing description field
    if (description === undefined) {
        return POST_CREATE_LISTING_RES["missingDescriptionField"];
    };
    // check for missing price field
    if (price === undefined) {
        return POST_CREATE_LISTING_RES["missingPriceField"];
    };

    return POST_CREATE_LISTING_RES["good"]
};

let postLogin = reqJSON => {
    let response = postLoginValidation(reqJSON);

    if (response["success"]) {
        let token = genId().toString();
        let username = reqJSON["username"];

        tokenTable.set(token, {username: username});
        response["token"] = token;

        console.log("welcome back:", reqJSON["username"]);
    };

    console.log("response: /login-", response);
    return response
};

let postLoginValidation = reqJSON => {
    let username = reqJSON["username"];
    let password = reqJSON["password"];

    // check for missing username field
    if (username === undefined) {
        return POST_LOGIN_RES["missingUsernameField"];
    };
    // check for missing password field
    if (password === undefined) {
        return POST_LOGIN_RES["missingPasswordField"];
    };
    // check for not existing user
    if (!userTable.has(username)) {
        return POST_LOGIN_RES["usernameNotExist"];
    };
    // check for correct passwords
    if (userTable.get(username)["password"] !== password) {
        return POST_LOGIN_RES["invalidPassword"]
    };

    return POST_LOGIN_RES["good"];
};

let postSignUp = reqJSON => {
    let password = reqJSON.password;
    let response = postSignUpValidation(reqJSON);
    let username = reqJSON.username;

    if (response["success"]) {
        userTable.set(username, {password: password});
        console.log("welcome to cybershop: ", username)
    };

    console.log("response: /login-", response);
    return response;
};

let postSignUpValidation = reqJSON => {
    let username = reqJSON.username;
    let password = reqJSON.password;

    // check for missing username field
    if (username === undefined) {
        return POST_SIGNUP_RES["missingUsernameField"];
    };

    // check for missing password field
    if (password === undefined) {
        return POST_SIGNUP_RES["missingPasswordField"];
    };
    
    // check for not existing user
    if (userTable.has(username)) {
        return POST_SIGNUP_RES["usernameExist"];
    };

    return POST_SIGNUP_RES["good"];
};

// support functions -----------------------------------------------------------

let genId = () => {
    return ++counter;
};

// [T]oken validation function
let tokenValidations = token => {
    if (token === undefined) {
        return GLOBAL_RES["missingTokenField"];
    };

    if (!tokenTable.has(token)) {
        return GLOBAL_RES["invalidToken"];
    };

    return undefined;
};
