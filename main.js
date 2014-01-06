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
    document.getElementById('content_frame').src = window.allLinks[window.index++];
}

// handler for any change in the root element
rootRef.on('value', function (snapshot) {
    console.log('----------------------------- new data available -----------------------------------');
    console.log(snapshot.val());
    //lets stop the current timer first of all
    stopTimer();

    //read changed project data
    var project = snapshot.val().projects[location.hash.substr(1)];

    //if urgent message available show it indefinitly
    var urgent = snapshot.val().urgent;
    if (urgent) {
        document.getElementById('content_frame').src = urgent;
    } else if (project) {
        //merge common and project URL arrays
        window.allLinks = project.concat(snapshot.val().common);
        window.timing = snapshot.val().timing;
        startTimer();
    } else {
        alert('Requested project "' + location.hash.substr(1) + '" does not exist.');
    }
});

var timerToggle = function () {
    var toggleBtn = document.getElementById('btnTimer');
    if (window.timer) {
        stopTimer();
        toggleBtn.innerHTML = 'Resume'
    } else {
        startTimer();
        toggleBtn.innerHTML = 'Pause'
    }
}

var nextUrl = function () {
    progressLink();
}