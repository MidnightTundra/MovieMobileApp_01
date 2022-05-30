/*
  Name: Christopher Scott
  Date: 04/09/2022
  Assignment: Creating a log-in system and database for mobile app.  Also creating movie search functionality.
*/
/* ---- THIS IS THE DUMP OF CONCEPTS FOR THE APP ----
        ----REST IN REESES PIECES ----
        */
/**
 * Jquery Document 
 */

/*
----------------- JSON DATABASE/ACCOUNT FUNCTIONS ------------------
*/



/*
----------------------- MOVIE API CALL FUNCTIONS -------------------------
*/



/*
  ----------------- DEBUG/TESTING SECTION BELOW -------------
*/

/*
const jsonAccounts = ('scripts/jsonexample.json');
let jsonTest = {
  "testAppend": {
    "password": "somestuff",
    "acceptDisc" : true,
    "firstName": "Bob",
    "lastName": "Dole",
    "birthDate": "",
    "userMovieDetails": {
      "totalWatchtime": 22,
      "favGenre": "Action",
      "favMovie": "The_Departed"
    },
    "timePerMovie": {
      "movieName": "total watchtime"
    }
  }
}
*/
/*
/**
 * Testing for future JSON file manipulation with local storage.
 * This is a reference for myself that I made.
 * Can ignore; this is for debug and testing.
 
function getJsonFile() {
  let fs;
  fetch(jsonAccounts)
    .then(data => data.json())
    .then(data => {
      //localStorage.setItem("cscott_test_json", JSON.stringify(data));
      let name = "usernametest";
      let test = JSON.parse(localStorage.getItem("cscott_test_json"));
      let obj = newAccountObject(name, "hidude");

      console.log(test);
      //(test)[`${name}`] = jsonTest; //appends new user to
      test[name] = obj[name]; //set up for correct json object saving.
      localStorage.setItem("cscott_test_json", JSON.stringify(test));
      console.log(test);
    });
}

/**
 * Reference for accessing nested object values.  
 
function testiesYo() {
  let account = getJsonFromLocal("cscott_Accounts")["Guest"];
  console.log(typeof account['userMovieDetails']);

  for (let x in account) {
    if (typeof account[`${x}`] === 'object') {
      console.log(x + " (length): " + Object.keys(account[`${x}`]).length);
      for (let n in account[`${x}`]) {
        console.log(n + " : " + account[`${x}`][n]);
      }
    } else {
      console.log(x + ": " + account[x]);
    }
  }
}

//getJsonFile();

/*
                               movieDate1 = new Date(account[`${movies[i - 1]}`][`latest-watch-date`]);
                               movieDate2 = new Date(account[`${movies[i]}`][`latest-watch-date`]);
                               if (movieDate1 > movieDate2) {
                                   let temp = account[`${movies[i]}`];
                                   JSON.parse(JSON.stringify())
                                   account[`${movies[i]}`] = account[`${movies[i + 1]}`];
                                   account[`${movies[i + 1]}`] = temp;
                                   i = 0;
                                   console.log(`Switch ${i}`);
                               } else {
                                   console.log(`Nope`);
                               }
*/
/*
function compareDates() {
  setJsonToLocal("temp-movies", getJsonFromLocal("cscott_Accounts")[getCurrentUser()]["movie-time-records"]);
  let account = getJsonFromLocal("temp-movies");

  let movies = Object.keys(account);
  let tempMovies = Object.keys(account)
  movies.sort();
  tempMovies.sort();
  console.log(account);
  console.log(movies);

  let movieListLength = movies.length;

  for (let i = 0; i < movieListLength; i++) {
    console.log(i);
    if (i <= movieListLength) {
      let movieDate1;
      let movieDate2;
      try {
        movieDate1 = new Date(account[`${movies[i]}`][`latest-watch-date`]);
        movieDate2 = new Date(account[`${movies[i + 1]}`][`latest-watch-date`]);
        if (movieDate1 > movieDate2) {

          let temp = account[`${movies[i]}`];
          //let temp2 = account[`${movies[i + 1]}`];
          //account = renameMovieEntry(account, movies, i);
          //account = renameMovieEntry(account, movies, i);
          account[`${movies[i]}`] = account[`${movies[i + 1]}`];
          account[`${movies[i + 1]}`] = temp;
          
          deleteEntryFromJson("temp-movies", `${movies[i]}`);
          setJsonToLocal("temp-movies", account);
          movies = Object.keys(account);
          
          let tempMovie1 = tempMovies[i];
          tempMovies[i] = tempMovies[i + 1];
          tempMovies[i + 1] = tempMovie1;


          //let temp = account[`${movies[i]}`];
          //let temp2 = account[`${movies[i + 1]}`];
          //delete recentWatchedMovie['movie-to-return'];
          //recentWatchedMovie['movie-to-return'] = temp2;
          i = -1;

        } else {

        }
      } catch {

      }
    }
  }

  console.log(movies[movieListLength - 1]);
  return tempMovies[movieListLength - 1];
}

function renameMovieEntry(account, movies, i) { // function to rename on button click
    account = account.map(function (obj) {
        obj[`${movies[i]}`] = obj[`${movies[i + 1]}`]; // Assign new key
        delete obj[`${movies[i]}`]; // Delete old key
        return obj;
    });

    return account;

}
*/
/*
function listRecords(key) {
  //let tblRecords = getJsonFromLocal(key)[getCurrentUser()]['movie-time-records'];
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

  //If tblRecords isn't empty. It will loop and create entries based on account.
  if (tblRecords != "") {
      for (let entry in tblRecords) {
          $("#tbl-records").append(
              `
                  <tr>
                      <td>${entry}</td>
                      <td>${tblRecords[entry]['latest-watch-date']}</td>
                      <td>${tblRecords[entry]['movie-watch-time']} / ${tblRecords[entry]['total-run-time']}</td>
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

  if (tblRecords != "") {
      for (let i =0; i< tblRecords.length; i++) {
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
}
*/

/*
//Creates an object holding useful statistics for movie data.
    let movieDateInfo = {
        "latest-movie-title": tempMovies[movieListLength - 1],
        "latest-watch-date": account[`${movies[movieListLength-1]}`][`latest-watch-date`],
        "earliest-movie-title": tempMovies[0],
        "earliest-watch-date": account[`${movies[0]}`][`latest-watch-date`],
        "date-gap-days": `${dateGap(account[`${movies[0]}`][`latest-watch-date`], account[`${movies[movieListLength-1]}`][`latest-watch-date`])}`
    }

    /**
 * Gets the number of days between watch dates.
 * 
 * @param {*} date1 first date in YYYY-DD-MM format
 * @param {*} date2 second date in YYYY-DD-MM format.
 * @returns Returns the number of days from the earliest movie watch date minus the latest.
 
function dateGap(date1, date2) {
  let movieDate1 = new Date(date1);
  let movieDate2 = new Date(date2);

  if ((movieDate1 > movieDate2)) {
      return (movieDate1.getTime() - movieDate2.getTime()) / 86400000;
  } else {
      return (movieDate2.getTime() - movieDate1.getTime()) / 86400000;
  }
}

*/