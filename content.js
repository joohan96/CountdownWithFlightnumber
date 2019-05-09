function getDistance(returnDate) {
    var countDownDate = new Date(returnDate);
    var now = new Date().getTime();

    var distance = countDownDate - now;

    return distance;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const countDownDate = request[0];
    const flightNumber = request[1];

    const distance = getDistance(countDownDate);

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        sendResponse({ msg: "\nStop playing! She's already back :)" });
    } else if (days > 0) {
        sendResponse({ msg: "\nUnfortunately, we cannot track your flight at this time, but your bb comes back in " + days + "days " + hours + " hours " + minutes + " minutes " + seconds + " seconds!!! \n" });
    } else {
        const arr = flightNumber.split(/(\d+)/);
        const url = 'https://aviation-edge.com/v2/public/routes?key=1bd984-705fbc&airlineIata=' + arr[0] + '&flightNumber=' + arr[1];
        console.log(url);
        fetch(url)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                response.json().then(function (data) {
                    console.log(data);
                    const message = "\nYour bb will be arriving at " +
                        data[0].arrivalTime + " at "
                        + data[0].arrivalIata + " airport terminal "
                        + data[0].arrivalTerminal + ". That is in " + hours + " hours " + minutes + " minutes " + seconds + " seconds!!! \n";
                    sendResponse({ msg: message });
                });
            })
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    };

    return true;
})