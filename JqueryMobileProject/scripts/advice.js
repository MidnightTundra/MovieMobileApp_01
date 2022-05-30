/*
  Name: Christopher Scott
  Date: 05/01/2022
  Assignment: Week 7 Mobile Lab Project
  Purpose: Creating a graph filled in canvas with text based advice based on statistics
*/

/**
 * Draws a canvas to show user advice based on statistics generated
 * from movie data submitted in the app.
 * 
 */
function showAdvice() {
    try {
        const account = getJsonFromLocal("cscott_Accounts")[getCurrentUser()];

        if (account == undefined) {
            alert("A user isn't logged in!")
            $(location).attr("href", "#page-menu");
        } else if (account['movie-time-records'] == undefined) {
            alert("No records exist yet!");
            changePages("#page-movie-query");
        } else {
            let mostRecentMovie = compareDates();
            let movieWatchLevel = calcMovieWatcherLevel();

            const canvas = document.getElementById("canvas-advice");
            const context = canvas.getContext("2d");

            context.fillStyle = "black";
            context.fillRect(0, 0, 800, 700);
            context.font = "bold 22px Raleway";
            drawAdviceCanvas(context, movieWatchLevel[0], movieWatchLevel[1]);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Draws the advice canvas when called.
 * Used to display the current watch level of the user as
 * well as the % of over all completion the user has
 * for registered films.
 * 
 * @param {RGraph} context Used to fill the canvas with text.
 * @param {String} watchLevel The level of which the user loves movies.
 * @param {Number} watcherPercent The rate of completion in all registered films.
 */
function drawAdviceCanvas(context, watchLevel, watcherPercent) {
    context.font = "bold 22px Raleway";
    context.fillStyle = "white";
    context.fillText(`Your current movie watch time is at`, 25, 400);
    context.fillText(`an average ${watcherPercent}% completion rate.`, 25, 420);

    if (watchLevel == "Movie Addict") {
        context.fillText(`You might be going overkill with the cinema.`, 25, 350);
        context.fillText(`ya ${watchLevel}.`, 25, 370);
        watchLevelWrite(context, watcherPercent);
    } else if (watchLevel == "Movie Enjoyer") {
        context.fillText(`This is your favorite past time.`, 25, 350);
        context.fillText(`You're a ${watchLevel}.`, 25, 370);
        watchLevelWrite(context, watcherPercent);
    } else if (watchLevel == "Movie on occasion") {
        context.fillText(`Movies are alright I bet.`, 25, 350);
        context.fillText(`Settle for a ${watchLevel}, eh?`, 25, 370);
        watchLevelWrite(context, watcherPercent);
    } else {
        context.fillText(`${watchLevel} Do you hate movies???`, 25, 350);
        watchLevelWrite(context, watcherPercent);
    }
}

/**
 * Generates the severity color for the for each threshhold.  The threshhold for
 * each level is determined by gaps of 25 points from 0 to 100.
 * watcherPercent is the basis for this.
 * 
 * @param {*} context Used to fill the canvas with text.
 * @param {Number} watcherPercent The rate of completion of all registered films.
 */
function watchLevelWrite(context, watcherPercent) {
    if (watcherPercent <= 100 && watcherPercent >= 75) {
        writeAdvice(context, "red", watcherPercent);
    } else if (watcherPercent <= 74 && watcherPercent >= 50) {
        writeAdvice(context, "orange", watcherPercent);
    } else if (watcherPercent <= 49 && watcherPercent >= 25) {
        writeAdvice(context, "yellow", watcherPercent);
    } else {
        writeAdvice(context, "green", watcherPercent);
    }

}

/**
 * Drafts advice text for the canvas on the suggestions page.
 * Advice text is based off of statistics formed from the user's account
 * and its current movie data.
 * 
 * @param {*} context Used to fill the canvas with text.
 * @param {*} severityColor severity of movie watcher status. Is based on color.
 * @param {*} watcherPercent The rate of completion of all registered films.
 */
function writeAdvice(context, severityColor, watcherPercent) {
    let adviceLine1 = "";
    let adviceLine2 = "";

    if (severityColor == "red") {
        adviceLine1 = "Bruh you probably should do something else.";
        adviceLine2 = "Go walk your dog.";
    } else if (severityColor == "orange") {
        adviceLine1 = "You like movies but you haven't finished";
        adviceLine2 = "Elden Ring. Go do that.";
    } else if (severityColor == "yellow") {
        adviceLine1 = "I see you're comfortable with your movie watching.";
        adviceLine2 = "Couldn't hurt to watch a little more, eh?";
    } else if (severityColor == "green") {
        adviceLine1 = "Bro do you even like movies???";
    }

    context.fillText(`Your movie watcher level is ${severityColor}`, 25, 460);
    context.fillText(adviceLine1, 25, 480);
    context.fillText(adviceLine2, 25, 500);

    drawMeter(context, watcherPercent);
}

/**
 * Draws the completed meter for determining movie watching intensity
 * level based off of user-entered statistics.
 * 
 * @param {RGraph} context 
 * @param {Number} watcherPercent 
 */
function drawMeter(context, watcherPercent) {
    let gauge;
    try {
        gauge = new RGraph.CornerGauge("canvas-advice", 0, 100, watcherPercent)
            .Set("chart.colors.ranges", [
                [75, 100, "red"],
                [50, 74, "#FFA500"],
                [25, 49, "yellow"],
                [0, 24, "green"]
            ]);


        gauge.Set("chart.value.text.units.post", "% of movie time")
            .Set("chart.value.text.boxed", false)
            .Set("chart.value.text.size", 14)
            .Set("chart.value.text.font", "Arial")
            .Set("chart.value.text.bold", true)
            .Set("chart.value.text.decimals", 2)
            .Set("chart.shadow.offsetx", 5)
            .Set("chart.shadow.offsety", 5)
            .Set("chart.scale.decimals", 2)
            .Set("chart.title", "Watch Time vs Run Time")
            .Set("chart.radius", 250)
            .Set("chart.centerx", 50)
            .Set("chart.centery", 250)
            .Draw();
    } catch (e) {
        console.log(e);
    }
}

/**
 * Sets total watchtime in minutes to account along with 
 * the total amount of minutes the user has in account.
 * 
 * Needs to be called before drawing advice and graph on canvas.
 * 
 * @see Account assigns values to account under current user for total watch time 
 * and total saved movie run time statistics.
 */
function setTotalMovieWatchTime() {
    try {
        let database = getJsonFromLocal("cscott_Accounts");
        let account = database[getCurrentUser()];
        let movies = Object.keys(account['movie-time-records']);
        let totalWatchTime = 0;
        let movieTotalTime = 0;

        for (let x = 0; x < movies.length; x++) {
            totalWatchTime += parseInt(loadAccountData("cscott_Accounts", movies[x])['movie-watch-time']);
            movieTotalTime += parseInt(loadAccountData("cscott_Accounts", movies[x])['total-run-time'].replace(/\D+/g, ''));
        }

        account['user-movie-details']['total-watch-time'] = totalWatchTime;
        account['user-movie-details']['all-movie-run-time'] = movieTotalTime;

        database[`${getCurrentUser()}`] = account;
        setJsonToLocal('cscott_Accounts', database);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Calculates the number of movies saved and saves their total runtime as a sum.
 * Then, it compares the sum of all the minutes the user has watched of all movies entered
 * and compares them.
 * 
 * @returns Retuns the movie watcher level & the watch time completion percentage.
 */
function calcMovieWatcherLevel() {
    setTotalMovieWatchTime();
    try {
        let account = getJsonFromLocal("cscott_Accounts")[getCurrentUser()];
        let watchTime = parseInt(account['user-movie-details']['total-watch-time']);
        let runTime = parseInt(account['user-movie-details']['all-movie-run-time']);

        
        let watcherPercent = Math.round((watchTime / runTime) * 100);

        if (watcherPercent <= 100 && watcherPercent >= 75) {
            return ["Movie Addict", watcherPercent];
        } else if (watcherPercent <= 74 && watcherPercent >= 50) {
            return ["Movie Enjoyer", watcherPercent];
        } else if (watcherPercent <= 49 && watcherPercent >= 25) {
            return ["Movie on occasion", watcherPercent];
        } else {
            return ["What Movie???", watcherPercent];
        }
    } catch (e) {
        console.log(e);
    }
}