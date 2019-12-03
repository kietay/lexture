var variableData = {
    searchTerm: "test",
    resultCount: 20,
    filterTypes: {
        lecturers: [
            {id: 1, name: "Kieran Taylor"},
            {id: 2, name: "Barack Obama"}
        ],
        times: [
            {id: 1, range: "< 15 min"},
            {id: 2, range: "15 - 30 min"},
            {id: 3, range: "30 - 60 min"},
            {id: 4, range: "> 60 min"}
        ],
        transcripts: [
            {id: 1, language: "English"},
            {id: 2, language: "中文"},
            {id: 3, language: "Español"},
            {id: 4, language: "Binary"}
        ]
    },
    searchResultEntries: [
        {
            id: 1,
            title: "Course Title 1",
            lecturer: "Professor 1",
            time: "1h 23m",
            topics: [
                {tag: "Algorithms"},
                {tag: "Introductions"},
                {tag: "Computer Science"}
            ],
            transcriptSearchResults: [
                // I haven't programmed the mechanic for only the top 2 results to be shown.
                {
                    iid: 1,
                    snippet: "will be on the <span class='search-term-highlight'>test</span> for the next quiz next Tuesday.",
                    timestamp: "00:42",
                    timeParam: "42"
                },
                {
                    iid: 2,
                    snippet: "won't be on the <span class='search-term-highlight'>test</span>, it's just fun to talk about.",
                    timestamp: "04:20",
                    timeParam: "260"
                }
            ],
            url: "http://lexture.com/video1.html"
        },
        {
            id: 2,
            title: "Course Title 2",
            lecturer: "Professor 2",
            time: "2h 34m",
            topics: [
                {tag: "Machine Learning"},
                {tag: "Nearest Neighbors"},
                {tag: "Computer Science"}
            ],
            transcriptSearchResults: [
                // I haven't programmed the mechanic for only the top 2 results to be shown.
                {
                    iid: 1,
                    snippet: "might be on the <span class='search-term-highlight'>test</span> for the next quiz next Tuesday.",
                    timestamp: "00:24",
                    timeParam: "24"
                },
                {
                    iid: 2,
                    snippet: "might not be on the <span class='search-term-highlight'>test</span>, it's just fun to talk about.",
                    timestamp: "02:40",
                    timeParam: "160"
                }
            ],
            url: "http://lexture.com/video2.html"
        }
    ]
};