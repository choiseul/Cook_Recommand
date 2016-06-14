var PredictionIO = require('predictionio-driver');

var pioApps = {
    myRecipe_aws: {
        eventURL: 'http://52.79.113.154:7070',
        queryURL: 'http://52.79.113.154:8000',
        appId: 1,
        accessKey: 'N9PbqlQXPoXLLJuHBAx2J99OJsmIPUVmul0Fhzdm7ctLD6nx471sLJoQmXmAxGnl',
    },
    myRecipe_aws2: {
        eventURL: 'http://52.79.113.154:7070',
        queryURL: 'http://52.79.113.154:8000',
        appId: 2,
        accessKey: 'SF5yZOllH2riNosrQ3Cy3O42D4sfajBbs95qkjw36FXrRTuB5YzbzWcLnzo4okSR',
    },
    myRecipe2: {
        eventURL: 'http://40.83.122.139:7070',
        queryURL: 'http://40.83.122.139:8000',
        appId: 1,
        accessKey: 'FKN95k4MIda1bTnoTuHk3tSh8qdwnnhbpC3SGzhqMbrHR7s5eZ7lEP6hNhijQdeN',
    }
};

var clients = {},
    events = {};

init();

function init() {
    for (var idx in pioApps) {
        var app = pioApps[idx];

        events[idx] = new PredictionIO.Events({
            appId: app.appId,
            accessKey: app.accessKey,
            url: app.eventURL,
        });

        clients[idx] = new PredictionIO.Engine({
            url: app.queryURL,
        });
    }
}

module.exports = (function () {
    return {
        getClient: getClient,
        getEvent: getEvent,
    };

    function getClient(app) {
        return clients[app];
    }

    function getEvent(app) {
        return events[app];
    }
})();
