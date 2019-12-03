function jumpToTime(timestampCard, video) {
    var timeText = timestampCard.find(".text-search-timestamp").text();
    var timeArr = timeText.split(":");
    var timestamp = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
    console.log("Jumping to timestamp: " + timestamp);
    video.currentTime(timestamp);
    video.play();
}

function selectTimestampCard(currTimestampCard, targetTimestampCard, video) {
    if (currTimestampCard) {
        currTimestampCard.removeClass("selected-timestamp-card");
    }
    targetTimestampCard.addClass("selected-timestamp-card");
    jumpToTime(targetTimestampCard, video);
    return targetTimestampCard;
}

function switchTab(currTab, currCard, targetTab, targetCard) {
    currTab.removeClass("selected-tool-tab");
    targetTab.addClass("selected-tool-tab");
    currCard.css("display", "none");
    targetCard.css("display", "block");
    return [targetTab, targetCard];
}

function transcriptJumpToTime(timestampText, video) {
    var timeArr = timestampText.split(":");
    var timestamp = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
    console.log("Jumping to timestamp: " + timestamp);
    video.currentTime(timestamp);
    video.play();
}

$(document).ready(function () {

    // Enable popovers
    $('[data-toggle="popover"]').popover({
        placement: 'bottom',
        container: 'body'
    }).click(function () {
        setTimeout(function () {
            $('.popover').fadeOut('slow');
        }, 2000);
    });

    var video = videojs("lecture-video");
    // Click text-search-timestamp-card -> highlight timestamp card, jump to timestamp
    var currTimestampCard = null;
    $(".text-search-timestamp-card").click(function () {
        currTimestampCard = selectTimestampCard(currTimestampCard, $(this), video);
    });
    // Click transcript -> jump to timestamp
    $(".transcript-line").click(function () {
        transcriptJumpToTime($(this).data("content"), video);
    });

    // Switch between tabs
    var currTab = $("#overview-tab");
    var currCard = $("#overview-card");
    $("#overview-tab").click(function () {
        [currTab, currCard] = switchTab(currTab, currCard, $("#overview-tab"), $("#overview-card"));
    });
    $("#transcript-tab").click(function () {
        [currTab, currCard] = switchTab(currTab, currCard, $("#transcript-tab"), $("#transcript-card"));
    });
    $("#qna-tab").click(function () {
        [currTab, currCard] = switchTab(currTab, currCard, $("#qna-tab"), $("#qna-card"));
    });
    $("#mytags-tab").click(function () {
        [currTab, currCard] = switchTab(currTab, currCard, $("#mytags-tab"), $("#mytags-card"));
    });
});