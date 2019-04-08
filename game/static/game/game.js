
var links;
var ladderPath = [curr];

const MAX_SUMMARY_WORDS = 100;
const MAX_LINKS = 9999;

// Sets goal header
function setHeaders(){
    $('#goal-header').html(end);
    $('#curr-header').html(curr);
}

// Gets page summary
function setPageSummary(target, pageId){
    $.ajax({
        type: "GET",
        url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${target}`,
        async: true,
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
            var pages = data['query']['pages'];
            for(k in pages){

                var words = pages[k]['extract'].split(" ");
                var res = words.slice(0, MAX_SUMMARY_WORDS).join(" ");
                if(words.length > MAX_SUMMARY_WORDS){
                    res += "...";
                }

                $(`#${pageId}`).html(res);
                break;
            }
        }
    });
}

// Jumps to target page
function jumpPage(target){
    // query wikipedia api
    $.ajax({
        type: "GET",
        url: `https://en.wikipedia.org/w/api.php?action=parse&page=${target}&format=json`,
        async: true,
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
            curr = data.parse.title;
            links = data.parse.links.filter(x => x['ns'] == 0).map(x => x['*']);

            // update page
            $('#ladder-list').empty()
            links.slice(0, 10).forEach(element => {
                var linkBtn = document.createElement("button");
                linkBtn.innerHTML = element;
                linkBtn.className = "btn btn-primary";
                linkBtn.onclick = function(){
                    jumpPage(element);
                };

                $('#ladder-list').append(linkBtn);
            });

            // update page content

            setPageSummary(target, 'curr-content');

            $('#curr-content').html();

            // update headers
            setHeaders();
            ladderPath.push(curr);
        }
    });
}

// Start game
$(document).ready(function(){
    jumpPage(curr);
    setPageSummary(end, 'goal-content');
});