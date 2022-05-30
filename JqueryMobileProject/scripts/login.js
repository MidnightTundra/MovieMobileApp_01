/*
  Name: Christopher Scott
  Date: 04/21/2022
  Assignment: Week 6 Mobile Lab Project
  Purpose: Creating a log-in system and database for mobile app.  Also creating movie search functionality.
*/

$("document").ready(function () {
    //Premade account for teacher.
    loadGuestAccount("cscott_Accounts");
});



/**
 * Creates a new user account for the movie database app.
 * All of my keys for localStorage will be prefaced with cscott_
 * 
 * @param {String} key String value for localStorage key. Always 'cscott_Accounts.
 * @param {String} username String value for username of account
 * @param {String} password String value for password of account
 */
function createNewAccount(element, key) {
    let parent = element.parentElement;
    let username = $(parent.querySelector(".input-username")).val();
    let password = $(parent.querySelector(".input-password")).val();
    let newAccount = newAccountObject(username, password);

    //Allows username and password combo to be made if over 3 characters.
    if (username.length >= 4 && password.length >= 4) {
        if (localStorage.getItem(key) == undefined) {
            //Creates new account and new local storage directory if there is none.
            setJsonToLocal(key, newAccount);
            alert(`Hi, ${username}! \nNew Account created!`);
            changePages('#page-login');
        } else {
            //Gets database to append new account to object.
            let database = getJsonFromLocal(key);
            //If object key value doesn't exist, creates a new account with designated name.
            if (Object.keys(database).includes(username) == false) {
                database[`${username}`] = newAccount[`${username}`];
                setJsonToLocal(key, database);
                alert(`Hi, ${username}! \nNew Account created!`);
                changePages('#page-login');
            } else {
                alert("This account already exists!");
            }
        }
    } else {
        alert("Please enter username and password values longer than 3 characters");
    }
}

/**
 * Creates a new account in the form of a JSON object
 * to be appended to the cscott_Accounts JSON file in 
 * localStorage.
 * 
 * @param {String} username 
 * @param {String} password 
 * @returns Object file to be converted into JSON object.
 */
function newAccountObject(username, password) {
    let accountObject = {
        [username]: {
            "password": password,
            "agreedToLegal": false,
            "first-name": "",
            "last-name": "",
            "birth-date": "",
            "user-movie-details": {
                "total-watch-time": 0,
                "all-movie-run-time": 0,
                "fav-genre": "",
                "fav-movie": ""
            },
            "movie-time-records": {}
        }
    }
    return accountObject;
}



/**
 * Loads "Guest" account for teacher evaluation so they can log in and use the system
 * without issue.  If Guest account already exist, it will skip this call.
 * If there isn't a local storage database, it will create a new one with a guest account
 * on load.
 * 
 * @param {String} key String key for local storage accounts. Always 'cscott_Accounts'.
 */
function loadGuestAccount(key) {
    let accounts = getJsonFromLocal(key);

    if (accounts != undefined) {
        if (!accounts["Guest"]) {
            let newAccount = newAccountObject("Guest", "2345");
            accounts["Guest"] = newAccount["Guest"];
            setJsonToLocal(key, accounts);
        }
    } else {
        let newAccount = newAccountObject("Guest", "2345");
        setJsonToLocal(key, newAccount);
    }
}


/**
 * Grabs all elements in the form and finds the values for input fields
 * The values are used to cross check cscott_Accounts for a valid account.
 * 
 * @param {HTMLElement} element Gets element the function was called on.
 */
function userLogIn(element) {
    let accounts = getJsonFromLocal("cscott_Accounts");
    let parent = element.parentElement;
    let username = $(parent.querySelector(".input-username")).val();
    let password = $(parent.querySelector(".input-password")).val();

    if (getPassword(accounts, username) != password) {
        alert(`Sorry. ${username} does not have that password! \nTry the Guest Account in info\nOr, Try making a new account`);
    } else {
        alert(`Welcome ${username}! You are successfully logged in!`);
        setCurrentUser(username);
        disclaimerHandler('cscott_Accounts');
    }

    
}

/**
 * Deletes the current active account in local storage and
 * sends the user back to the log-in page.
 */
function userLogOut() {
    localStorage.removeItem("cscott_CurrentUser");
    alert("User has been successfully logged out!");
    changePages('#page-login');
}

/**
 * Changes value for agreedToLegal to true for accepting
 * the disclaimer.
 * 
 * @param {String} key As Always, 'cscott_Accounts' to access database.
 */
function acceptDisclaimer(key) {
    let account = getJsonFromLocal(key)[getCurrentUser()];

    if (account != undefined) {
        updateAccountData(key, 'agreedToLegal', true);
        changePages('#page-user-info');
    } else {
        alert("Please log into an account!");
        changePages('#page-login');
    }
}

/**
 * Handles page changes based on the current active account's
 * agreedToLegal Boolean status. Ensures disclaimer page doesn't
 * pop up every log in.
 * 
 * @param {String} key As Always. Key is 'cscott_Accounts'.
 */
function disclaimerHandler(key) {
    let account = getJsonFromLocal(key)[getCurrentUser()];

    if (account != undefined) {
        if (account['agreedToLegal'] != false) {
            changePages("#page-user-info");
        } else {
            changePages("#page-disclaimer");
        }
    }
}


/**
 * Adds number value based on keypad button press value.
 * 
 * @param {HTMLElement} button  
 */
function addValueToPassword(value) {
    let passcode = $("#log-input-password");

    if (value == "del") {
        $(passcode).val($(passcode).val().slice(0, -1));
    } else {
        $(passcode).val($(passcode).val() + value);
    }
}

/**
 * Returns current user password.  If there currently isn't a user
 * alerts the DOM that there's isnt a user available.
 * 
 * @param {JSON} accounts JSON object holding all accounts.
 * @param {String} username account username
 * @returns current active account's password.
 */
function getPassword(accounts, username) {

    //Loops to find password in designated account among database.
    for (let n in accounts) {
        if (n == username) {
            return accounts[`${username}`].password;
        }
    }

    //If there isn't a match; retuns default account.
    alert("A user currently is not logged in!");
}


/**
 * Sets current active user account for the app.
 * Saves username to localStorage for furthr app
 * reference as cscott_CurrentUser.
 * 
 * @param {String} username 
 */
function setCurrentUser(username) {
    localStorage.setItem("cscott_CurrentUser", username);
}

/**
 * Gets current user logged into the device application.
 * 
 * @returns String value of current user account logged in.
 * @see localStorageKey cscott_CurrentUser
 */
function getCurrentUser() {
    return localStorage.getItem("cscott_CurrentUser");
}