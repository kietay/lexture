## Tag Correspondence
| Tag | Description | e.g. |
|:-----------------------:|:---------------------------------------:|:-----------------------------------------------------------:|
| {{course}} | Name of the whole course. | "Berkeley CS 61A" |
| {{title}} | Title of this particular lecture. | "Week 1: Functions" |
| {{#textSearchResults}} | Array of search results. | [{"textSearchSnippet":"...", "textSearchTimestamp":"..."},] |
| {{textSearchSnippet}} | Snippet of text around the search term. | "will be on the test for the next quiz next Tuesday." |
| {{textSearchTimestamp}} | Timestamp for that search result. | "01:42" |
| {{videoUrl}} | Url of lecture video. | "http://www.example.com/path/to/video.mp4" |
| {{lecturer}} | Lecturer of this course. | "Kieran Taylor" |
| {{#tags}} | Array of tags for this video. | [{"tag":"..."},] |
| {{tag}} | Tag name. | "Computer Science" |
| {{overview}} | Short description of course/teacher. | "CS 61A is offered to good little boys and girls." |
| {{#languages}} | Languages the transcript is offered in. | [{"language":"..."},] |
| {{language}} | Name of language. | "English" |
| {{transcriptText}} | Full text of transcript. | "Okay students, take out your pen, it's time for a quiz..." |

## Notes:
- The contents of `{{textSearchSnippet}}` are set to be truncated in HTML. You don't need to worry about length, just make sure the search 
term is close enough to the start (like, 2 or 3 words in) so it won't be truncated.

- For the specific search term in each transcript snippet, we want to stylize it, so wrap it inside tags like this:
`Text before search term <span class="search-term-highlight">search term</span> text after search term.`

