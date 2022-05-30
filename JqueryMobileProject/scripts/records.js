/*
  Name: Christopher Scott
  Date: 04/21/2022
  Assignment: Creating a log-in system and database for mobile app.  Also creating movie search functionality.
*/


/**
 * Gets number of movie data saved to current user account.  Deletes the records in
 * the JSON object and reloads table to reflect deleted values.
 * 
 * @param {String} key As Always, 'cscott_Accounts' for accounts database.
 */
function clearRecordsTable(key) {
    let movies = getJsonFromLocal(key)[getCurrentUser()]['movie-time-records'];
    for (let title in movies) {
        deleteEntryFromJson(key, title);
    }

    changePages("#page-menu");
    listRecords(key);
}


/**
 * Prompts user to search for a movie to add to account database.
 */
function addRecord() {
    changePages("#page-movie-query");
    alert("Search for a movie to add!");
}

/**
 * Makes an API call using {@link searchMovieDatabase()} to allow
 * user to edit movie records after search for movie based on table entry
 * 
 * @param {HTMLElement} button used to find movie title of table entry.
 */
function editRecord(button) {
    let elements = $(button).parent().parent().children();
    let movieTitle = $(elements[0]).text();
    searchMovieDatabase('cscott_Accounts', movieTitle);
}

function deleteRecord(button) {
    //Gets Title of movie entry and row button is with
    let elements = $(button).parent().parent().children();
    let movieTitle = $(elements[0]).text();
    let tableRow = $(button).parent().parent();

    //Deletes account movie record based on movieTitle.
    deleteEntryFromJson('cscott_Accounts', movieTitle);

    //Removes table row.
    $(tableRow).remove();
}


/**
 * Creates a new object and assigns the new object's value over the old one
 * whilst excluding the user-defined entry.
 * 
 * @param {String} key 'cscott_Accounts' local storage object
 * @param {*} valueToDelete Name of the JSON property to delete.
 * @returns Name of movie deleted for table.
 */
function deleteEntryFromJson(key, valueToDelete) {
    let database = getJsonFromLocal(key);
    let account;
    if (key == "cscott_Accounts") {
        account = database[getCurrentUser()];
    } else {
        account = database;
    }

    //Loops through object origin tree to find name of valueToDelete
    for (let x in account) {
        if (typeof account[`${x}`] === 'object') {
            //Transfering data for new obj
            let obj = {};
            for (let n in account[`${x}`]) {
                if (account[`${x}`][`${valueToDelete}`] == account[x][n]) {
                    continue;
                } else {
                    obj[`${n}`] = account[`${x}`][`${n}`];
                }
            }
            //Assigns new value to account object after constructing a new obj excluding denoted entry
            account[`${x}`] = obj;
        } else if (valueToDelete == x) {
            account[`${x}`] = "";
        }
    }

    //Assigns new data to database.
    if (key == "cscott_Accounts") {
        database[`${getCurrentUser()}`] = account;
    } else {
        database = account;
    }

    setJsonToLocal(key, database);
    return valueToDelete;
}

/**
 * Converts JSON object into Array.  Helper function for {@link deleteEntryFromJson()}.
 * 
 * 
 * @param {JSON} p Object used for converting JSON properties into array
 * @returns Array after conversion
 * @see StackOverflow.com Courtesy of 
 * https://stackoverflow.com/questions/29320141/json-parse-splice-issue
 */
function objectToArray(obj) {
    let keys = Object.keys(obj);
    keys.sort(function (a, b) {
        return a - b;
    });

    let arr = [];
    for (let i = 0; i < keys.length; i++) {
        arr.push(obj[keys[i]]);
    }
    return arr;
}


/**
 * Creates a table for movie records added by user onto
 * a corresponding account.
 * 
 * @param {String} key As Always, account database is cscott_Accounts
 */
function listRecords(key) {
    try {
        let tblRecords = compareDates();

        //Header set up for table entries.
        if (tblRecords != undefined) {
            $("#tbl-records").html(
                `
        <thead>
            <tr>
                <th>Movie Title</th>
                <th>Latest Watch Date </th>
                <th>Total Movie Watchtime</th>
                <th>Edit/Delete</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        `);
        }

        if (tblRecords != undefined && tblRecords.length > 0) {
            for (let i = 0; i < tblRecords.length; i++) {
                $("#tbl-records").append(
                    `
                    <tr>
                        <td>${tblRecords[i]['movie-title']}</td>
                        <td>${tblRecords[i]['latest-watch-date']}</td>
                        <td>${tblRecords[i]['movie-watch-time']} / ${tblRecords[i]['total-run-time']}</td>
                        <td>
                            <button class='ui-btn' data-role='button'
                            onclick='editRecord(this);' data-icon='edit'>Edit</button>
                            <button class='ui-btn' data-role='button' 
                            onclick='deleteRecord(this);' data-icon='delete' >Del</button>
                        </td>
                    </tr>
                `
                );
            }
        } else {
            $("#tbl-records").append("No Entries");
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Compares the dates of JSON objects and sorts them in the 
 * array accordingly to return the most recently watched title.
 * 
 * @returns The account's movie items sorted by date as an array of objects.
 */
function compareDates() {
    setTotalMovieWatchTime();
    let account = getJsonFromLocal("cscott_Accounts")[getCurrentUser()]['movie-time-records'];
    let tempAccount = new Array;
    let movies = Object.keys(account);
    let tempMovies = Object.keys(account)
    movies.sort();
    tempMovies.sort();

    let movieListLength = movies.length;

    //Loops to sort array of movies by date.
    if (movies.length > 1) {
        for (let i = 0; i < movieListLength; i++) {
            if (i <= movieListLength) {
                let movieDate1;
                let movieDate2;
                try {
                    movieDate1 = new Date(account[`${movies[i]}`][`latest-watch-date`]);
                    movieDate2 = new Date(account[`${movies[i + 1]}`][`latest-watch-date`]);
                    if (movieDate1 > movieDate2) {
                        //Shifts dates so bubble sort can work.
                        let temp = account[`${movies[i]}`];
                        account[`${movies[i]}`] = account[`${movies[i + 1]}`];
                        account[`${movies[i + 1]}`] = temp;

                        //Shifts the array to line up to the movie with the latest date.
                        let tempMovie1 = tempMovies[i];
                        tempMovies[i] = tempMovies[i + 1];
                        tempMovies[i + 1] = tempMovie1;

                        //Saves movie title to object and creates a temp account sorted by date.
                        account[`${movies[i]}`]['movie-title'] = tempMovies[i];
                        account[`${movies[i + 1]}`]['movie-title'] = tempMovies[i + 1];
                        tempAccount[i] = account[`${movies[i]}`];
                        tempAccount[i + 1] = account[`${movies[i + 1]}`];
                        i = -1;
                    } else {
                        //Saves movie title to object and creates a temp account sorted by date.
                        account[`${movies[i]}`]['movie-title'] = tempMovies[i];
                        account[`${movies[i + 1]}`]['movie-title'] = tempMovies[i + 1];
                        tempAccount[i] = account[`${movies[i]}`];
                        tempAccount[i + 1] = account[`${movies[i + 1]}`];
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    } else if (movies.length == 1){
        account[`${movies[0]}`]['movie-title'] = tempMovies[0];
        tempAccount[0] = account[`${movies[0]}`];
     } else {
        return alert("No Movies!");
    }

    
    setJsonToLocal('temp-accounts', tempAccount);

    return tempAccount;
}


/**
 * Forms a users age based on date of birth and todays date.
 * 
 * @param {String} key 
 * @returns Returns constructed user age.
 */
function calcUserAge(key) {
    const account = getJsonFromLocal(key)[getCurrentUser()];
    const dateOfBirth = new Date(account['birth-date']);

    var ageDifMs = Date.now() - dateOfBirth.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch

    if (dateOfBirth == "" || dateOfBirth == undefined) {
        $("#user-age").text("");
        return "";
    } else {
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        $("#user-age").text(age);
        return age;
    }

}

/**
 * Resets form values for selected forms.  Mostly for 
 * values in the record form page.
 * 
 * @param {String} formId String value of form Id.
 */
function clearRecordForm(formId) {
    let inputs = $(formId).children().children();

    for (let i = 0; i < inputs.length; i++) {
        //Slider value reset
        if ($(inputs[i]).attr('type') == 'slider') {
            $(inputs[i]).attr('value', 0);
            $(inputs[i]).val('');
            //Date Reset
        } else if ($(inputs[i]).attr('type') == 'date') {
            $(inputs[i]).attr('value', "");
            $(inputs[i]).val('');

        }
    }
}

/**
 * Gets JSON data from localStorage to replicate
 * a fake database of accounts.
 * @param {String} key Gets value from key String entered.
 * @returns JSON object containing account details.
 */
function getJsonFromLocal(key) {
    return JSON.parse(localStorage.getItem(key));

}

/**
 * Sets JSON data to localStorage as a mock database
 * of accounts or any other object need a key/value pair set-up.
 * 
 * @param {String} key Sets value for localStorage in key/value pairs.
 * @param {JSON} data JSON data saved as the value in key/value pair.
 */
function setJsonToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}