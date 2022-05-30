/*
  Name: Christopher Scott
  Date: 04/21/2022
  Assignment: Week 6 Mobile Lab Project
  Purpose (Movie Database App): Queries movie database to bring up movie details.
*/

/**
 * Object containing movie API url for querying
 * JSON data containing movie details.
 */
const movieAPI = {
    url: "https://www.omdbapi.com/?t=",
    apiKey: "&apikey=317223ac"
}


/**
 * Makes an API call to a movie database to grab a user-defined
 * movie by title.  If response is true, the function calls
 * {@link buildRecordForm()} to fill the record form page
 * with relevant movie data.
 * 
 * @param {String} key As Always, key is 'cscott_Accounts'.
 */
function searchMovieDatabase(key, title) {
    let account = getJsonFromLocal(key)[getCurrentUser()];

    //Searches for title based on input field or script based call with arg2 'title'
    let newSearch = "";
    if (title == undefined) {
        newSearch = $("#movie-search-input").val().replace(/ /g, "+");
    } else {
        newSearch = title;
    }

    //Formed API query url for search based on title.
    let queryUrl = `${movieAPI.url}${newSearch}${movieAPI.apiKey}`;

    //API Call for getting JSON objects of queried movie titles.
    fetch(queryUrl)
        .then(data => data.json())
        .then(data => {
            //functions handling json data
            if (data['Response'] == "True") {
                setMovieInLocal(data);
                clearRecordForm('#form-movie-record');
                //Background poster placement in record form page w/ dimming.
                $('#movie-poster-background').css('background', `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${data['Poster']}')`);
                buildRecordForm(key, data);
                changePages('#page-records-form');
            } else if (data['Response'] == "False") {
                alert("Sorry! That movie doesn't exist!\nTry another search.");
            }
        });
}

/**
 * Calls list of {@link setElementValue()} functions to set HTML
 * Element text values to user defined elements.
 * 
 * @param {String} key As Always, key is 'cscott_Accounts'
 * @param {JSON} data Movie database object from API call.
 */
function buildRecordForm(key, data) {
    //Populating Record Form headers
    setElementValue('#movie-title', data['Title']);
    setElementValue('#movie-summary', data['Plot']);
    setElementValue('#movie-director', data['Director']);
    setElementValue('#movie-actors', data['Actors']);
    setElementValue('#movie-release-date', data['Released']);

    //Adjusts form input values.
    setElementValue('#user-movie-runtime', getUserMovieData(key, data['Title'], 'movie-watch-time'));
    setElementValue('#user-movie-runtime', data['Runtime'].replace(/^\D+/g, ''), 'max');
    setElementValue('#user-movie-date', getUserMovieData(key, data['Title'], 'latest-watch-date'));

    //Sets movie run time in comparison to watch time.
    if (getUserMovieData(key, data['Title'], 'movie-watch-time') == undefined) {
        setElementValue('#movie-watch-time', `${data['Runtime']}`);
    } else {
        setElementValue('#movie-watch-time', `Watched: ${getUserMovieData(key, data['Title'], 'movie-watch-time')}/${data['Runtime']}`);
    }

    
    
    //Attempt to adjust slider value.
    $(".ui-btn-active").css('width', (getUserMovieData(key, data['Title'], 'movie-watch-time') / data['Runtime'].replace(/^\D+/g, '')) + '%');

}

/**
 * Sets the value of selected element by Id. Can set attribute values of element
 * or innerHTML values depending on if attrName is specified or not.
 * 
 * @param {String} elementId Element ID name. Include #.
 * @param {*} value Value to be assigned to variable.
 * @param {String} attrName Optional. Attribute name to be adjusted instead of innerHTML.
 */
function setElementValue(elementId, value, attrName) {
    if (attrName == undefined) {
        if ($(elementId).is('input')) {
            $(elementId).val(value);
        } else {
            $(elementId).text(value);
        }
    } else {
        $(elementId).attr(attrName, value);
    }
}

/**
 * Gets the movie from user's account history to then return a 
 * defined value within the nested object.
 * 
 * @param {String} key Always will be "cscott_Accounts" to access database.
 * @param {String} movieTitle JSON object from API. Pass movie title.
 * @param {String} valueToGet Value to get from user database.
 * @returns Returns value after its retrieved from database.
 */
function getUserMovieData(key, movieTitle, valueToGet) {
    let movie = loadAccountData(key, movieTitle);

    //Buttons Text value change based on movie presence in account.
    if (movie != undefined) {
        let value = movie[`${valueToGet}`];
        $('#user-add-movie').text('Save Edit');

        if (typeof value == "number") {
            return value;
        } else if (value != undefined) {
            let newValue = value.replace(/^\D+/g, '');
            return newValue;
        } else {
            return 0;
        }
    } else {
        $('#user-add-movie').text('Add Movie');
    }
}

/**
 * Sets the current queried movie as a stored object in local storage.
 * 
 * @param {JSON} data API call JSON object.
 */
function setMovieInLocal(data) {
    if (data['Response'] == 'True') {
        setJsonToLocal('cscott_CurrentMovie', data);
    }
}

/**
 *  Gets the current and most recent queried movie in local storage.
 * 
 * @returns JSON object of last movie searched.
 */
function getMovieInLocal() {
    return getJsonFromLocal('cscott_CurrentMovie');
}

/**
 * Creates a movie object to add it to the user's account history. 
 * The object created here is a replacement for "tbRecords" as it stores 
 * records on a per-movie basis.
 * 
 * @param {String} key Always will be "cscott_Accounts" to access database.
 */
function addMovieToAccount(key) {
    let movieTitle = $('#movie-title').text();
    let watchTime = $("#user-movie-runtime").val();
    let date = $("#user-movie-date").val();
    let account = getJsonFromLocal(key)[`${getCurrentUser()}`];
    let currentMovie = getMovieInLocal('cscott_CurrentMovie');

    let currentDate = new Date();
    let movieReleaseDate = new Date(currentMovie['Released'].replace(/ /g, '-'));
    let setDate = new Date(date)

    //Creates the movie object here with movieTitle.
    if (date != "") {
        
        if (setDate > currentDate) {
            alert("You cannot set the watch time in the future!");
        } else if (setDate < movieReleaseDate) {
            alert(`You cannot set a date before the movie's release date \n${currentMovie['Released']}`);
        } else if (watchTime == "") {
            alert(`Please set watch time value.`);
        } else if (watchTime == "") {
        }   else {
            account['movie-time-records'][`${movieTitle}`] = {
                'movie-watch-time': watchTime,
                'latest-watch-date': date,
                'total-run-time': currentMovie['Runtime'],
            };
            //Adds it to database.
            let database = getJsonFromLocal(key);
            database[`${getCurrentUser()}`] = account;
            setJsonToLocal(key, database);
            changePages('#page-records');

            alert(`${movieTitle} details saved!`);
        }
    } else {
        alert("Please enter a date that the movie was watched.");
    }
}