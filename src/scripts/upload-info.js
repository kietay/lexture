var timeOut = 600;
// I'm using these to animate the ellipses in the dumbest way I can.
var ellipsesLoop0 = function () {
    $("#progress-bar-status-ellipses").text("");
    $("#submit-btn-status-ellipses").text("");
    setTimeout(ellipsesLoop1, timeOut);
};
var ellipsesLoop1 = function () {
    $("#progress-bar-status-ellipses").text(".");
    $("#submit-btn-status-ellipses").text(".");
    setTimeout(ellipsesLoop2, timeOut);
};
var ellipsesLoop2 = function () {
    $("#progress-bar-status-ellipses").text("..");
    $("#submit-btn-status-ellipses").text("..");
    setTimeout(ellipsesLoop3, timeOut);
};
var ellipsesLoop3 = function () {
    $("#progress-bar-status-ellipses").text("...");
    $("#submit-btn-status-ellipses").text("...");
    setTimeout(ellipsesLoop0, timeOut);
};

// FOR SHOWCASING ONLY -- REMOVE WHEN UPLOADING FUNCTION COMPLETE
var fakeProgress = function (start) {
    var uploadProgressBar = $("#upload-progress-bar");
    var percentage = (new Date - start) / 50;
    uploadProgressBar.width(percentage + "%");
    if (percentage >= 100) {
        console.log("Video upload complete!");
        clearInterval(intervalId);
        uploadProgressBar.addClass("bg-success");
        $("#progress-bar-status").html("Your video was successfully uploaded!");
        $("#submit-btn-status").html("You may now save and publish your video.");
        $("#save-and-publish-btn").removeAttr("disabled");
    }
};

var intervalId = null; // FOR SHOWCASING ONLY -- REMOVE WHEN UPLOADING FUNCTION COMPLETE

$(document).ready(function () {
    ellipsesLoop3();

    // FOR SHOWCASING ONLY -- REMOVE WHEN UPLOADING FUNCTION COMPLETE
    var currTime = new Date;
    intervalId = setInterval(function () {
        fakeProgress(currTime)
    }, 500);

    // Gather all form inputs into an array when SAVE & SUBMIT is clicked
    $('#video-info-form').submit(function (event) {
        var formValues = $(this).serializeArray();

        // Note for Kieran, when getting the TAGS data:
        // The TAGS come in as a string, are split by comma into an array, and then spaces/newlines on either side are trimmed.
        // However, the TAGS input form is not required (unless you want them to be!), so if the TAGS form is left blank,
        // we will get back just a single empty string in an array. Just a heads-up about getting back an empty string.
        var tags = formValues[3]['value'].split(',');
        tags = $.map(tags, $.trim);
        formValues[3]['value'] = tags;
        console.log(formValues);
        $("#submit-btn-status").html("Your video has been published!");
        $("#save-and-publish-btn")
            .addClass("btn-success")
            .removeClass('btn-primary')
            .html("<span>&#10003;</span>")
            .attr("disabled", true);
        event.preventDefault(); // Prevents page from refreshing

        // TODO: Redirect...?
        // I guess when everything's done, we should redirect to the page of the uploaded video?
        // Or if it takes a while to transcribe and stuff, maybe redirect to the home page?
    });
});