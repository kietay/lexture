function jumpToTime(timestampCard, video) {
    var timeText = timestampCard.find(".text-search-timestamp").text();
    var timeArr = timeText.split(":");
    var timestamp = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
    console.log("Jumping to timestamp: "+timestamp);
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

$(document).ready(function () {
    console.log("Document DOM ready!");

    // Enable popovers
    $('[data-toggle="popover"]').popover({
        placement: 'bottom',
        delay: {
            "show": 500,
            "hide": 100
        }
    }).click(function () {
        setTimeout(function () {
            $('.popover').fadeOut('slow');
        }, 4000);

    });

    // Select search results (timestamp card)
    var video = videojs("berkeley-cs61a-1");
    var currTimestampCard = $("#timestamp-card-1");
    $("#timestamp-card-1").click(function () {
        currTimestampCard = selectTimestampCard(currTimestampCard, $("#timestamp-card-1"), video);
    });
    $("#timestamp-card-2").click(function () {
        currTimestampCard = selectTimestampCard(currTimestampCard, $("#timestamp-card-2"), video);
    });
    $("#timestamp-card-3").click(function () {
        currTimestampCard = selectTimestampCard(currTimestampCard, $("#timestamp-card-3"), video);
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