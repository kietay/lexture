$(document).ready(function () {
    var variableData = {
        course: "Berkeley CS 61A",
        title: "Week 1: Functions",
        textSearchResults:
            [
                {
                    textSearchSnippet: "will be on the <span class=\"search-term-highlight\">test</span> for the next quiz next Tuesday.",
                    textSearchTimestamp: "00:42"
                },
                {
                    textSearchSnippet: "won't be on the <span class=\"search-term-highlight\">test</span>, it's just fun to talk about.",
                    textSearchTimestamp: "04:20"
                },
                {
                    textSearchSnippet: "to study for the <span class=\"search-term-highlight\">test</span> that's coming out this Friday.",
                    textSearchTimestamp: "42:00"
                }
            ],
        videoUrl: "https://lexture.nyc3.digitaloceanspaces.com/sample_lectures/berkeley_cs61a_1.mp4",
        lecturer: "Kieran Taylor",
        tags: [
            {tag: "Algorithms"},
            {tag: "Computer Science"},
            {tag: "Hot Lecturer"}
        ],
        overview: "Kieran is a proficient speaker of Chinese and the world's leading authority on professional bar fighting.\n" +
            "He was born in a volcano as it erupted, raised by Shaolin masters, and has the power of three legendary pokemon combined.",
        languages: [
            {language: "English"},
            {language: "中文"},
            {language: "Español"},
            {language: "Binary"}
        ],
        transcriptText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget malesuada velit. Donec " +
            "auctor est sapien, luctus lobortis libero congue eu. Nullam commodo placerat sagittis. Phasellus finibus " +
            "nisi erat, et dictum sapien molestie id. Cras in bibendum risus. Fusce rhoncus magna mi, tristique ornare " +
            "ipsum consectetur ut."
    };
    var title = $(html).filter('title').text();
    Mustache.parse(title); // optional, speeds up future uses
    var renderedTitle = Mustache.render(title, variableData);
    $('#target').html(rendered);
});