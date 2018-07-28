class TrainSchedule {

    constructor(name, destination, firstTrainTime, frequency) {
        this._name = name;
        this._destination = destination;
        this._firstTrainTime = firstTrainTime;
        this._frequency = frequency;
    }

    // () -> String
    get name() {
        return this._name;
    }

    get destination() {
        return this._destination;
    }

    // () -> Moment
    get firstTrainTime() {
        return this._firstTrainTime;
    }

    get frequency() {
        return this._frequency;
    }

    // () -> Moment
    nextArrival() {
        var arrival = moment(this.firstTrainTime);
        while(arrival.isBefore(moment())) {
            arrival.add(this.frequency, 'm');
        }
        return arrival;
    }

    // () -> Number
    minutesAway() {
        return Math.ceil(moment.duration(this.nextArrival().diff(moment(new Date()))).asMinutes());
    }

}

// (TrainSchedule) -> HTML
function printTrainSchedule(trainSchedule) {
    return "<tr><td scope='col'>" + trainSchedule.name + "</td>" +
                "<td scope='col'>" + trainSchedule.destination + "</td>" +
                "<td scope='col'>" + trainSchedule.frequency + "(min)</td>" + 
                "<td scope='col'>" + trainSchedule.nextArrival().format('HH:mm') + "</td>" +
                "<td scope='col'>" + trainSchedule.minutesAway() + "</td>" +
            "</tr>";
}

function storeTrainSchedule(trainSchedule) {    
    database.ref().push({
        name: trainSchedule.name,
        destination: trainSchedule.destination,
        time: trainSchedule.firstTrainTime.format("HH:mm"),
        frequency: trainSchedule.frequency
    });
}

$("#train_form").on("submit", function (ev) {
    var trainForm = $(this);
    var trainName = trainForm.find("#name-input").val();
    var trainDestination = trainForm.find("#destination-input").val();
    var trainTime = trainForm.find("#time-input").val();
    var trainFrequency = trainForm.find("#frequency-input").val();
    storeTrainSchedule(new TrainSchedule(trainName, trainDestination, moment(trainTime, "HH:mm"), trainFrequency));
    ev.preventDefault();
});

var config = {
    apiKey: "AIzaSyDaMykx6zhzp2F6yNGg4Jaijx5GZy3Epuc",
    authDomain: "train-scheduler-a7cf8.firebaseapp.com",
    databaseURL: "https://train-scheduler-a7cf8.firebaseio.com",
    projectId: "train-scheduler-a7cf8",
    storageBucket: "train-scheduler-a7cf8.appspot.com",
    messagingSenderId: "340863963084"
};

firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function(snapshot) {
    var trainSchedule = new TrainSchedule(snapshot.val().name, 
                                          snapshot.val().destination, 
                                          moment(snapshot.val().time, "HH:mm"), 
                                          snapshot.val().frequency);
    $("#train_table_body").append(printTrainSchedule(trainSchedule));
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
