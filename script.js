//initialize database
var rowColor = ""
var rowCounter = 0;
var currentTime = moment().format("HH:mm")
var startTime;
var config = {
    apiKey: "AIzaSyDPyJxS9RO45emWQqVAL6ILn8gxpk0x5-I",
    authDomain: "trainarrivals-4a16e.firebaseapp.com",
    databaseURL: "https://trainarrivals-4a16e.firebaseio.com",
    projectId: "trainarrivals-4a16e",
    storageBucket: "",
    messagingSenderId: "838817394324"
};
firebase.initializeApp(config);
database = firebase.database();

//database action once child is added to employee data folder
database.ref("/trainData").on("child_added", function (childSnapshot) {
    rowCounter++;
    var newRow = $("<tr>")
    newRow.attr("id", childSnapshot.val().trainID)

    var nameCell = $("<td>")
    var destCell = $("<td>")
    var freqCell = $("<td>")
    var mwCell = $("<td>")
    var nextCell = $("<td>")
    var awayCell = $("<td>")
    nameCell.text(childSnapshot.val().name)
    destCell.text(childSnapshot.val().destination)
    freqCell.text(childSnapshot.val().frequency)
    nextCell.text(childSnapshot.val().arrivalTime)
    awayCell.text(childSnapshot.val().minAway)
    $(newRow).append(nameCell)
    $(newRow).append(destCell)
    $(newRow).append(freqCell)
    $(newRow).append(nextCell)
    $(newRow).append(awayCell)


    $("#trainRow").append(newRow)
    $("#trainRow").css("background-color", rowColor)
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
//function that occurs once the submit button of the form is clicked
$("#add-train").on("click", function (event) {
    event.preventDefault()


    //gather info from form
    var name = $("#name-input").val().trim()
    var destination = $("#dest-input").val().trim()
    startTime = $("#first-input").val().trim()
    startTime = moment(startTime, "HH:mm a")
    
    
    var frequency = $("#freq-input").val().trim()
    
    var minAway = nextArrival(startTime, frequency)
    var arrivalTime = findNextArrivalTime(minAway)
    database.ref("/trainData").push({
        name: name,
        destination: destination,
        frequency: frequency,
        arrivalTime: arrivalTime,
        minAway: minAway,
        trainID: "train-" + (rowCounter + 1)
    });
    //clears form input fields
    $("#name-input").val("")
    $("#dest-input").val("")
    $("#freq-input").val("")
    $("#first-input").val("")

});

if (rowCounter % 2 == 0) {
    rowColor = "lightblue"
}


function findNextArrivalTime(minAway) {
    var nextTrain = moment().add(minAway, "minutes")
    return moment(nextTrain).format("hh:mm")
}

function nextArrival(startTime, frequency){
    var nextArrival = totalTime(startTime) % frequency
    return nextArrival
}

function totalTime(startTime) {

    var mins = moment().diff(moment(startTime), "minutes");
    return mins

}