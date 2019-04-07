
// Sets goal header
function setGoalHeader(){
    $('#goal-header').html(curr + " → " + end);
}

// jump to page
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
            links.forEach(element => {
                var linkBtn = document.createElement("button");
                linkBtn.innerHTML = element;
                linkBtn.className = "btn btn-primary";
                linkBtn.onclick = function(){
                    jumpPage(element);
                };

                $('#ladder-list').append(linkBtn);
                $('#ladder-list').append('<br>');
            });

            setGoalHeader();
            ladderPath.push(curr);
        }
    });
}

// Start game
$(document).ready(function(){
    jumpPage(curr);
});