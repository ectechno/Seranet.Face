var rootRef = new Firebase('https://seranetface.firebaseio.com');

var stopTimer = function () {
    if (window.timer) {
        clearInterval(window.timer);
        window.timer = null;
    }
}

var startTimer = function () {
    progressLink(); //show first lement

    //set timer to rotate in given interval 
    window.timer = setInterval(function () {
        progressLink();
    }, window.timing);
}

var progressLink = function () {
    if (!window.allLinks[window.index]) {
        window.index = 0;
    }
    //console.log(window.allLinks[index++]);
    $('#content_frame').attr('src', window.allLinks[window.index++].url);
}

var showUrgent = function (urgent) {
    $('#content_frame').attr('src', urgent);
    $('#links').hide();
    $('#urgent').show();
}

var drawMenu = function () {
    $('#pages').empty();
    for(var i=0; i<window.allLinks.length; i++) {
        //console.log(window.allLinks[i]);
        $('#page-list').append('<li><a class="link" href="#" data-index="' + i + '">' + window.allLinks[i].name + '</a></li>')
    }

    $('.link').click(function (e) {
        var index = $(this).data("index");
        $('#content_frame').attr('src', window.allLinks[index].url);
        //pause the rotation
        if (window.timer) {
            stopTimer();
            $('#pause').html('Resume');
        }
        e.preventDefault();
    });

    $('#menu').dropit();
}

var showProject = function (snapshot) {
    //read changed project data
    var project = snapshot.val().projects[location.hash.substr(1)];
    if (!project) {
        alert('Requested project "' + location.hash.substr(1) + '" does not exist.');
        return;
    }
    var common = snapshot.val().common;
    //set to global values
    window.timing = snapshot.val().timing;
    window.allLinks = project.concat(common);
    //do UI changes
    $('#links').show();
    $('#urgent').hide();

    //start link rolling
    startTimer();

    //create the links menu
    drawMenu();
}

// handler for any change in the root element
rootRef.on('value', function (snapshot) {
    console.log('----------------------------- new data available -----------------------------------');
    console.log(snapshot.val());
    //lets stop the current timer first of all
    stopTimer();

    //if urgent message available show it indefinitly
    var urgent = snapshot.val().urgent;
    if (urgent) {
        showUrgent(urgent);
    } else {
        showProject(snapshot);
    }
});

$('#pause').click(function () {
    if (window.timer) {
        stopTimer();
        $(this).html('Resume');
    } else {
        startTimer();
        $(this).html('Pause');
    }
});

var nextUrl = function () {
    progressLink();
}