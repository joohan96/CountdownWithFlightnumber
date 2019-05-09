function getMessage(returnDate) {
    return new Promise(function (resolve, reject) {
        //1bd984-705fbc;; 
        //http://aviation-edge.com/api/public/routes?key=1bd984-705fbc&flightNumber=AC30

        var countDownDate = new Date(returnDate);
        var now = new Date().getTime();

        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            resolve("Stop playing! She's already back :)");
        } else {
            resolve("Your bb comes back in " + days + "days " + hours + "hours " + minutes + "minutes " + seconds + "seconds!!!");
        }
    });
}

function parseFlightData(resp) {
    return new Promise(function (resolve, reject) {
        var data = JSON.parse(resp);
        console.log(data);
        var msg = "Your bb will be arriving at " +
        data[0].arrivalTime + " at "
        + data[0].arrivalIata + " airport terminal "
        + data[0].arrivalTerminal;
        console.log(msg);
        resolve(msg);
    });
}

function getRouteDetails(url) {
    return new Promise(function (resolve, reject) {
        console.log("im here nig")
        var xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr);
                    console.log(xhr.response);
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            console.log("The request for " + url + " timed out.");
        };
        xhr.open('GET', url, true);
        xhr.send(null);
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // getMessage(request)
    console.log(request);
    const arr = request.split(/(\d+)/);
    const url = 'https://aviation-edge.com/v2/public/routes?key=1bd984-705fbc&airlineIata=' + arr[0] + '&flightNumber=' + arr[1];
    console.log(url);
    getRouteDetails(url)
        .then(function(response) {
            parseFlightData(response).then(function (msg) {
                console.log(msg);
                sendResponse({msg: msg});
            })
        })
})