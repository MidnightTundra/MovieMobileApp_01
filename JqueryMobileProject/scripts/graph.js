/*
  Name: Christopher Scott
  Date: 05/01/2022
  Assignment: Week 7 Mobile Lab Project
  Purpose: Creating a graph filled in canvas with text based advice based on statistics
*/


/**
 * Constructs canvas to show graph on the graph page for the user.
 * Shows the completed construct of the graph and is called when the page
 * is change to the graph page.
 * 
 */
function showGraph() {
    try {
        let dateAndWatchTime = fillDateWatchTime();
        let dateArr = new Array;
        let watchTimeArr = new Array;

        //fills new values for the graphic for comparing watchtime vs date.
        for (let i = 0; i < dateAndWatchTime.length; i++) {
            dateArr.push(dateAndWatchTime[i]['date']);
            watchTimeArr.push(dateAndWatchTime[i]['watch-time']);
        }

        //constructs canvas
        setupCanvas();

        let chartCap = watchTimeArr.sort();
        drawLines(watchTimeArr, dateArr, chartCap[0], chartCap[chartCap.length]);
    } catch (e) {

    }

}

/**
 * Constructs the canvas for the viewport when the graph
 * page is active.
 */
function setupCanvas() {
    const canvas = document.getElementById("canvas-graph");
    const context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.fillRect(0, 0, 600, 700);
}

/**
 * Draws the lines for the user's movie data to show statistics on the amount
 * of minutes the user watches movies through the dates.
 * 
 * @param {*} watchTimeArr Array of watch times. 
 * @param {*} dateArr Dates of watch times. Dates and watchtime values are merged if date is the same.
 * @param {*} bottom The lowest point of the graph
 * @param {*} top The highest point of the graph.
 */
function drawLines(watchTimeArr, dateArr, bottom, top) {
    const movieDataLine = new RGraph.Line("canvas-graph", watchTimeArr, top, bottom)
        .Set("labels", dateArr)
        .Set("colors", ["red", "black", "black"])
        .Set("shadow", true)
        .Set("shadow.offsetx", 1)
        .Set("shadow.offsety", 1)
        .Set("linewidth", 1)
        .Set("numxticks", 6)
        .Set("scale.decimals", 0)
        .Set("xaxispos", "bottom")
        .Set("gutter.left", 40)
        .Set("tickmarks", "filledsquare")
        .Set("ticksize", 3)
        .Set("chart.labels.ingraph", [, ["Minutes", "white", "black", 1, 50]])
        .Set("chart.title", "Movie Time vs Dates")
        .Draw();
}

/*
  labelAxes will get the context of the canvas-graph element and add text
  for the x and y axis labels.
*/
function labelAxes() {
    const canvas = document.getElementById("canvas-graph");
    const context = canvas.getContext("2d");

    context.font = "bold 11px Raleway";
    context.fillStyle = "white";
    context.fillText("Date (YYYY-MM-DD)", 500, 470);
    context.fillText("Value (Minutes)", 0, 10);
}

/**
 * Loops to compile similar dates and their respective watch times.
 * If the dates are the same, the cumulative watch time for that day is added
 * as one value.
 * 
 * @returns Returns an object array of dates and their totaled watch time
 * of movies.
 */
function fillDateWatchTime() {
    let movieData = compareDates();
    let length = movieData.length;
    let dateAndWatchTime = [];

    try {
        for (let i = 0, j = i + 1; i < length; i++, j++) {
            let date;
            let nextDate;

            //Establishes date formation based off of position in loop.
            if (i < length) {
                date = new Date(movieData[i]['latest-watch-date']);
                if (movieData[j] == undefined) {
                    nextDate = new Date();
                } else {
                    nextDate = new Date(movieData[j]['latest-watch-date']);
                    
                }

            } else {
                date = new Date(movieData[i]['latest-watch-date']);
                nextDate = new Date();
            }

            //Deletes Entrys if they have the same date and appends watch time to previous entry
            if (date.toDateString() == nextDate.toDateString()) {
                dateAndWatchTime.push({
                    'date': movieData[i]['latest-watch-date'],
                    'watch-time': parseInt(movieData[i]['movie-watch-time'])
                })
                dateAndWatchTime[i]['watch-time'] += parseInt(movieData[j]['movie-watch-time']);
                movieData.splice(i, 1);
            } else {
                dateAndWatchTime.push({
                    'date': movieData[i]['latest-watch-date'],
                    'watch-time': parseInt(movieData[i]['movie-watch-time'])
                })
            }
        }
    } catch (e) {
        console.log(e);
    }
    return dateAndWatchTime;
}