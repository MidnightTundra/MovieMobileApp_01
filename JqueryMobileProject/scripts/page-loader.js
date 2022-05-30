/*
  Name: Christopher Scott
  Date: 04/21/2022
  Assignment: Week 6 Mobile Lab Project
  Purpose (Movie Database App): Queries movie database to pring up movie details.
*/

/**
 * Whenever the records page is switched to active. Functions will be called.
 */
$(document).on('pagebeforeshow', '#page-records', function () {
    listRecords('cscott_Accounts');
});

/**
 * Whenever the account information page is switched to active. Functions will be called.
 */
$(document).on('pagebeforeshow', '#page-user-info', function () {
    showUserForm('cscott_Accounts');
});

/**
 * Whenever the menu page is switched to active. Functions will be called.
 */
$(document).on('pagebeforeshow', '#page-menu', function () {
    if (getCurrentUser() == undefined) {
        changePages('#page-login');
        alert("Please Log in)");
    }
});

/**
 * Whenever the Movie search page is switched to active. Functions will be called.
 */
$(document).on('pagebeforeshow', '#page-movie-query', function () {
    if (getCurrentUser() == undefined) {
        changePages('#page-login');
        alert("Please Log in.");
    }
});

$(document).on('pagebeforeshow', '#page-advice', function () {
    if (getCurrentUser() != undefined) {
        showAdvice();
        resizeGraph();
    } else {
        changePages('#page-login');
        alert("Please Log in.");
    }
});

$(document).on('pagebeforeshow', '#page-graph', function () {
    if (getCurrentUser() != undefined) {
        showGraph();
        resizeGraph();
    } else {
        changePages('#page-login');
        alert("Please Log in.");
    }
});

/*
------------- APP UI MANIPULATION FUNCTIONS ---------------
*/

function resizeGraph() {
    if ($(window).width() < 700) {
        $("#canvas-advice").css({
            "width": $(window).width() - 50
        });
        $("#canvas-graph").css({
            "width": $(window).width() - 50
        });
    }
}

/**
 * Takes the element id of a page to switch the 
 * active page for the user's viewport.
 * 
 * @param {String} pageId Include #. Arg for page id.
 */
function changePages(pageId) {
    $.mobile.changePage(`${pageId}`);
}