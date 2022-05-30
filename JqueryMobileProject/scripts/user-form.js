/*
  Name: Christopher Scott
  Date: 04/21/2022
  Assignment: Week 6 Mobile Lab Project
  Purpose (Movie Database App): User Form for recording user information for Movie App.
*/



/**
 * Loops through user form inputs to find values that are unfilled.
 * If the values aren't filled, the function will return false and the
 * alert will ping the user to fill the values.
 * 
 * @returns True if values are filled; false otherwise.
 */
function checkUserForm() {
    let inputs = $("#form-user-info").children().children();
    let labels = [];

    //Loops to fill the array with label names pertaining to unfilled inputs.
    for (let i = 0; i < inputs.length - 1; i++) {
        if ($(inputs[i]).val() == "") {
            let name = $(inputs[i]).attr('name').replace('-', ' ').toUpperCase();
            labels += name + ', \n';
        }

        //Checks if person is from the future.
        if ($(inputs[i]).attr('name') == "birth-date") {
            if (new Date($(inputs[i]).val()) >= new Date()) {
                alert("You can't be from the future.\nPlease set a date before today.");
                return false;
            }
        }
    }

    //Checks to see if the array is populated.  If it is, something wasn't filled.
    if (labels.length > 0) {
        alert("Please fill out the following fields: \n" + labels);
        return false;
    } else {
        alert("Account Changes Saved!");
        return true;
    }
}

/**
 * Used to populate the account information page
 * with current user data saved to their account in  
 * local storage.
 * 
 * @param {String} key As Always , key is 'cscott_Accounts'. 
 */
function showUserForm(key) {
    let inputs = $("#form-user-info").children().children();

    for (let n = 0; n < inputs.length; n++) {
        if ($(inputs[n]).attr('name') == 'change-pass') {
            $(inputs[n]).val(loadAccountData(key, 'password'));
        } else {
            $(inputs[n]).val(loadAccountData(key, $(inputs[n]).attr('name')));
        }
    }

    calcUserAge(key);
}


/**
 * Saves account information to local storage.
 * 
 * @param {String} key Always will represet 'cscott_Accounts'
 */
function saveUserForm(key) {
    let inputs = $("#form-user-info").children().children();

    //Checks if user form has all values filled.
    try {
        if (checkUserForm()) {
            for (let n in inputs) {
                if ($(inputs[n]).attr('name') == 'change-pass') { //If password is changed, value will be updated.
                    updateAccountData(key, 'password', $(inputs[n]).val());
                } else if ($(inputs[n]).attr('id') == 'user-age') {
                    continue;
                } else {
                    updateAccountData(key, $(inputs[n]).attr('name'), $(inputs[n]).val());
                }
            }
            changePages("#page-menu");
        }
    } catch (e) {
        console.log(e);
        changePages("#page-menu");
    }
}

/**
 * Made to update user account data.  Finds values in parsed json file
 * to update values.  Any nested objects that contain the name matching
 * 'valueToUpdate' will be found and updated
 * 
 * @param {String} key Used for local storage identifier "cscott_Accounts".
 * @param {String} valueToUpdate Name of JSON object's property.
 * @param {JSON} newData New value saved at specified property.
 */
function updateAccountData(key, valueToUpdate, newValue) {
    //Grabs JSON object from local storage and finds the user account.
    try {
        let account = getJsonFromLocal(key)[`${getCurrentUser()}`];

        //Loops to find valueToUpdate name match.
        for (let x in account) {
            if (typeof account[`${x}`] === 'object') {
                //Loops nested object values to match valueToUpdate
                for (let i in account[`${x}`]) {
                    if (valueToUpdate == i) {
                        account[`${x}`][i] = newValue;
                    }
                }
            } else if (valueToUpdate == x) { //No object and match is found.
                account[x] = newValue;
            }
        }

        //Gets the database; Saves account under current user; saves new DB to local.
        let database = getJsonFromLocal(key);
        database[`${getCurrentUser()}`] = account;
        setJsonToLocal(key, database);
    } catch (e) {

    }


}


/**
 * Loads account data based on current user logged in.  Nested objects values can 
 * be returned as well.
 * 
 * @param {String} key As Always, key is probably 'cscott_Accounts'.
 * @param {String} valueToGet Pass name of JSON object's property.
 * @returns Returns account property value determined by valueToGet.
 */
function loadAccountData(key, valueToGet) {
    let account = getJsonFromLocal(key)[`${getCurrentUser()}`];

    //Loops first tree until it finds a value that is an object.
    for (let x in account) {
        if (typeof account[`${x}`] === 'object') {
            //Loops nested object values to match valueToGet
            for (let i in account[`${x}`]) {
                if (valueToGet == i) {
                    return account[`${x}`][i];
                }
            }
        } else if (valueToGet == x) { //No object and match is found.
            return account[x];
        }
    }
}