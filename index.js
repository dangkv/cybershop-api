const bodyParser = require('body-parser');
const cors = require('cors');
const { response } = require('express');
const express = require('express');
const { token } = require('morgan');
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

const GET_CART_RES = {
    good: {"success":true,"cart": undefined},
}

const GET_LISTING_RES = {
    good: {"success":true,"listing": undefined},
    invalidListing: {"success":false,"reason":"Invalid listing id"},
};

const GLOBAL_RES = {
    invalidToken: {"success": false, "reason": "Invalid token"},
    missingTokenField: {"success": false, "reason": "token field missing"},
};

const POST_ADD_TO_CART_RES = {
    good: {"success":true},
    missingItemIdField: {"success":false,"reason":"itemid field missing"},
    itemNotExist: {"success":false,"reason":"Item not found"},
};

const POST_CHANGE_PW_RES = {
    good: {"success": true},
    invalidPassword: {"success": false, "reason": "Unable to authenticate"},
    missingNewPasswordField: {"success": false, "reason": "newPassword field missing"},
    missingOldPasswordField: {"success": false, "reason": "oldPassword field missing"},
};

const POST_CHECKOUT_RES = {
    good: {"success":true},
    itemNotAvailable: {"success":false,"reason":"Item in cart no longer available"},
    emptyCart: {"success":false,"reason":"Empty cart"},
}

const POST_CREATE_LISTING_RES = {
    good: {"success": true, listingId: undefined},
    missingDescriptionField: {"success":false,"reason":"description field missing"},
    missingPriceField: {"success":false,"reason":"price field missing"},
};

const POST_LOGIN_RES = {
    good: {"success": true, "token": undefined},
    invalidPassword: {"success": false, "reason": "Invalid password"},
    missingUsernameField: {"success": false, "reason": "username field missing"},
    missingPasswordField: {"success": false, "reason": "password field missing"},
    usernameNotExist: {"success": false, "reason": "User does not exist"},
};

const POST_MODIFY_LISTING_RES = {
    good: {"success":true},
    missingItemIdField: {"success":false,"reason":"itemid field missing"},
};

const POST_SIGNUP_RES = {
    good: {"success": true},
    usernameExist: { "success": false, "reason": "Username exists" },
    missingUsernameField: { "success": false, "reason": "username field missing"},
    missingPasswordField: { "success": false, "reason": "password field missing"},
};


// api endpoints ===============================================================

// GET -------------------------------------------------------------------------

app.get("/cart", (req, res) => {
    let token = req.headers["token"];

    console.log("request: /cart");
    res.send(getCart(token));
});

app.get("/listing", (req, res) => {
    let listingId = req.query.listingId

    console.log("request: /listing-", listingId);
    res.send(getListing(listingId));
});

// app.get("/purchase-history", (req, res) => {
    // let token = req.headers["token"];

    // console.log("request: /purchase-history");
    // res.send(getPurchaseHistory(token));
// });

// app.get("/selling", (req, res) => {
    // let sellerUsername = req.query.sellerUsername;

    // console.log("request: /selling-", sellerUsername);
    // res.send(getSelling(sellerUsername));

// });

app.get("/sourcecode", (req, res) => {
    res.send(require('fs').readFileSync(__filename).toString());
});

// app.get("/status", (req, res) => {
    // let itemId = req.query.itemid

    // console.log("request: /status-", itemId);
    // res.send(getStatus(itemId));
// });

// app.get("/reviews", (req, res) => {
    // let sellerUsername = req.query.sellerUsername;

    // console.log("request: /reviews-", sellerUsername);
    // res.send(getReviews(sellerUsername));
// });

// POST ------------------------------------------------------------------------

app.post("/add-to-cart", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;
    let token = req.headers["token"];

    console.log("request: /add-to-cart-", body);

    reqJSON = {itemId: body.itemid};

    res.send(postAddToCart(token, reqJSON));
});

app.post("/change-password", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;
    let token = req.headers["token"];

    console.log("request: /change-password-", body);

    reqJSON = {oldPassword: body.oldPassword, newPassword: body.newPassword};

    res.send(postChangePassword(token, reqJSON));
});

// app.post("/chat", (req, res) => {
    // let body = JSON.parse(req.body);
    // let reqJSON = undefined;
    // let token = req.headers["token"];

    // console.log("request: /chat-", body);

    // reqJSON = {destination: body.destination, contents: body.contents};

    // res.send(postChat(token, reqJSON));
// });

// app.post("/chat-messages", (req, res) => {
    // let body = JSON.parse(req.body);
    // let reqJSON = undefined;
    // let token = req.headers["token"];

    // console.log("request: /chat-messages", body);

    // reqJSON = {destination: body.destination};

    // res.send(postChatMessages(token, reqJSON));
// });

app.post("/checkout", (req, res) => {
    let token = req.headers["token"];

    console.log("request: /checkout");

    res.send(postCheckout(token));
});

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

app.post("/modify-listing", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;
    let token = req.headers["token"];

    console.log("request: /modify-listing-", body);

    reqJSON = {itemId: body.itemid, price: body.price, description: body.description};

    res.send(postModifyListing(token, reqJSON));
});

// app.post("/ship", (req, res) => {
    // let body = JSON.parse(req.body);
    // let reqJSON = undefined;
    // let token = req.headers["token"];

    // console.log("request: /ship-", body);

    // reqJSON = {itemId: body.itemid};

    // res.send(postShip(token, reqJSON));
// });

app.post("/signup", (req, res) => {
    let body = JSON.parse(req.body);
    let reqJSON = undefined;

    console.log("request: /signup-", body);

    reqJSON = {username: body.username, password: body.password}

    res.send(postSignUp(reqJSON));
});

// app.post("/review-seller", (req, res) => {
    // let body = JSON.parse(req.body);
    // let reqJSON = undefined;
    // let token = req.headers["token"];

    // console.log("request: /review-seller-", body);

    // reqJSON = {numStars: body.numStars, contents: body.contents, itemId: body.itemid};

    // res.send(postReviewSeller(token, reqJSON));
// });

// others ----------------------------------------------------------------------
app.listen(process.env.PORT || 3000)

// functions ===================================================================

// endpoint functions ----------------------------------------------------------
let getCart = token => {
    let response = getCartValidation(token);

    if (response["success"]) {
        let username = tokenTable.get(token)["username"];
        let cartItemList = [];
        let cartList = cartTable.get(username)["cartList"]

        for (let i = 0; i < cartList.length; i++) {
            let cartItem = itemTable.get(cartList[i]);
            let itemInfo = {
                price: cartItem["price"],
                description: cartItem["description"],
                itemId: cartList[i],
                sellerUsername: cartItem["sellerUsername"],
            };
            cartItemList.push(itemInfo);
        };

        response["cart"] = cartItemList;
    };

    console.log("response: /cart-", response);

    return response;
};

let getCartValidation = token => {
    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };

    return GET_CART_RES["good"];
};

let getListing = (listingId) => {
    let response = getListingValidation(listingId);

    if (response["success"]) {
        let listingValue = itemTable.get(listingId)
        let info = {
            "price": listingValue["price"],
            "description": listingValue["description"],
            "itemId": listingId,
            "sellerUsername": listingValue["sellerUsername"],
        };

        response["listing"] = info;
    };

    console.log('response: /listing', response);
    return response;
};

let getListingValidation = (listingId) => {

    if (!itemTable.has(listingId)) {
        return GET_LISTING_RES["invalidListing"];
    };

    return GET_LISTING_RES["good"];
};

let getPurchaseHistory = token => {

};

let getPurchaseHistoryValidation = token => {

};

let getSelling = sellerUsername => {

};

let getSellingValidation = sellerUsername => {
    
};

let postAddToCart = (token, reqJSON) => {
    let response = postAddToCartValidation(token, reqJSON);

    if (response["success"]) {
        let itemId = reqJSON.itemId;
        let username = tokenTable.get(token)["username"];

        // check if user has existing cart
        if (cartTable.has(username)){
            cartTable.get(username)["cartList"].push(itemId);
        } else {
            cartTable.set(username, {cartList:[itemId]});
        };
    }

    console.log("response: /postAddToCart-", response);

    return response;
};

let postAddToCartValidation = (token, reqJSON) => {
    let itemId = reqJSON.itemId

    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };
    // check for missing item id field
    if (itemId === undefined) {
        return POST_ADD_TO_CART_RES["missingItemIdField"]
    };
    // check for item in itemTable
    if (!itemTable.has(itemId)) {
        return POST_ADD_TO_CART_RES["itemNotExist"];
    };
    
    return POST_ADD_TO_CART_RES["good"];
};

let postChangePassword = (token, reqJSON) => {
    let response = postChangePasswordValidation(token, reqJSON);

    if (response["success"]) {
        let newPassword = reqJSON.newPassword;
        let username = tokenTable.get(token)["username"];

        userTable.get(username)["password"] = newPassword;
        console.log("Your password has been changed");
    };

    console.log("response: /change-password-", response);
    return response;
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

let postChat = (token, reqJSON) => {

};

let postChatValidation = (token, reqJSON) => {

};

let postChatMessages = (token, reqJSON) => {

};

let postChatMessagesValidation = (token, reqJSON) => {

};

let postCheckout = token => {
    let response = postCheckoutValidation(token);

    if (response["success"]) {
        let username = tokenTable.get(token)["username"];
        let cartList = cartTable.get(username)["cartList"];
        
        for (let i = 0; i < cartList.length; i++){
            let itemId = cartList[i];

            // set isSold to true in itemTable
            itemTable.get(itemId)["isSold"] = true;

            // push all cart items to purchaseHistoryTable
            if (purchaseHistoryTable.has(username)) {
                purchaseHistoryTable.get(username)["purchaseList"].push(itemId);
            } else {
                purchaseHistoryTable.set(username, {purchaseList: [itemId]});
            };
        };

        // clear cart
        cartList = [];
        console.log("Thank you for shopping at cybershop, see you in the near future");
    };

    console.log("reponse: /checkout-", response);
    return response;
};

let postCheckoutValidation = token => {
    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };

    let username = tokenTable.get(token)["username"];
    console.log("tables:", itemTable)
    console.log("username:", username)
    console.log("cartTable:", cartTable)
    console.log("!cartTable.has(username)", !cartTable.has(username))
    
    // check for empty cart
    if (!cartTable.has(username) || cartTable.get(username)["cartList"].length === 0) {
        return POST_CHECKOUT_RES["emptyCart"];
    };

    let cartList = cartTable.get(username)["cartList"];

    // check for item availability
    for (let i = 0; i < cartList.length; i++){
        let itemId = cartList[i];
        if (itemTable.get(itemId)["isSold"]) {
            return POST_CHECKOUT_RES["itemNotAvailable"];
        };
    };
    
    return POST_CHECKOUT_RES["good"];
};

let postCreateListing = (token, reqJSON) => {
    let description = reqJSON.description;
    let price = reqJSON.price;
    let response = postCreateListingValidation(token, reqJSON);

    if (response["success"]) {
        let newId = genId().toString();
        let username = tokenTable.get(token)["username"];
        response["success"]["listingId"] = newId;

        let item = {
            price: price,
            description: description,
            sellerUsername: username,
            isSold: false,
        };

        itemTable.set(newId, item);

        response["listingId"] = newId;
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

let postModifyListing = (token, reqJSON) => {
    let description = reqJSON.description;
    let itemId = reqJSON.itemId;
    let price = reqJSON.price;
    let response = postModifyListingValidation(token, reqJSON);

    if (response["success"]) {
        let item = itemTable.get(itemId);

        if (description !== undefined) {
            item["description"] = description;
        };

        if (price !== undefined) {
            item["price"] = price;
        };

        itemTable.set(itemId, item);
        console.log("Your listing has been modified");
    }

    console.log("response: /modify-listing-", response);
    return response
};

let postModifyListingValidation = (token, reqJSON) => {
    let itemId = reqJSON.itemId;
    
    // check for invalid token request
    if (tokenValidations(token) !== undefined) {
        return tokenValidations(token);
    };
    // check for missing item id field
    if (itemId === undefined) {
        return POST_MODIFY_LISTING_RES["missingItemIdField"];
    };
    return POST_MODIFY_LISTING_RES["good"];
};

let postShip = (token, reqJSON) => {

};

let postShipValidation = (token, reqJSON) => {

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

let postReviewSeller = (token, reqJSON) => {

};

let postReviewSellerValidation = (token, reqJSON) => {

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
