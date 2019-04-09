
var links;
var ladderPath = [curr];
var sectionList = [];
var currSection = 0;

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
            buildSections(links);
            moveSection(0);

            // update page content
            setPageSummary(target, 'curr-content');

            // update jump count
            $('#curr-jumps').html(ladderPath.length);

            // update headers
            setHeaders();
            ladderPath.push(curr);

            // scroll back up
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            // detect win
            detectWin();
        }
    });
}

// detects win
function detectWin(){
    if(curr == end){
        //TODO: add win code
        alert(`You won in ${ladderPath.length} jumps!`);
    }
}

// Builds search sections
function buildSections(links){
    // reset
    $('#ladder-list').empty()
    $('#section-list').empty();
    sectionList = [];
    currSection = 0;

    // build map
    var linkMap = new Map();
    links.forEach(element => {
        var key = element[0].toLowerCase();
        if(linkMap.has(key)){
            linkMap.get(key).push(element);
        }
        else{
            linkMap.set(key, []);
            linkMap.get(key).push(element);
        }
    });

    // build html
    for(let key of linkMap.keys()){

        // add section
        var section = document.createElement("div");
        section.id = `section-${key}`;
        $('#ladder-list').append(section);
        sectionList.push(key);

        // add section title
        var sectionTitle = document.createElement("span");
        sectionTitle.innerHTML = key;
        sectionTitle.id = `section-title-${key}`;
        sectionTitle.className = "badge badge-secondary";
        $('#section-list').append(sectionTitle);

        // add buttons to section
        linkMap.get(key).forEach(element => {
            var linkBtn = document.createElement("button");
            linkBtn.innerHTML = element;
            linkBtn.className = "btn btn-primary";
            linkBtn.onclick = function(){
                jumpPage(element);
            };

            $(`#${section.id}`).append(linkBtn);
            $(`#${section.id}`).hide();
        });

        
    }

    
}

// Moves n sections
function moveSection(n){

    // reset old section
    $(`#section-${sectionList[currSection]}`).hide();
    $(`#section-title-${sectionList[currSection]}`).addClass("badge-secondary");
    $(`#section-title-${sectionList[currSection]}`).removeClass("badge-success");
    

    // update current
    currSection += n + sectionList.length;
    currSection %= sectionList.length;

    // fade in
    sectionId = sectionList[currSection];
    $(`#section-${sectionList[currSection]}`).fadeIn();
    $(`#section-title-${sectionList[currSection]}`).addClass("badge-success");
    $(`#section-title-${sectionList[currSection]}`).removeClass("badge-secondary");
}

// Start game
$(document).ready(function(){
    jumpPage(curr);
    setPageSummary(end, 'goal-content');
});