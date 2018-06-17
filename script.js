//initialize database
var rowColor = ""
var rowCounter = 0;
var currentDateYear = moment().format("YYYY")
var currentDateMonth = moment().format("MM")

var config = {
    apiKey: "AIzaSyBZeMQmksdsqPdOHEXNOST7amL6j6vZ-24",
    authDomain: "timesheet-8ce5d.firebaseapp.com",
    databaseURL: "https://timesheet-8ce5d.firebaseio.com",
    projectId: "timesheet-8ce5d",
    storageBucket: "",
    messagingSenderId: "680559553665"
};
firebase.initializeApp(config);
database = firebase.database();

//database action once child is added to employee data folder
database.ref("/employeeData").on("child_added", function (childSnapshot) {
    rowCounter++;
    var newRow = $("<tr>")
    newRow.attr("id", childSnapshot.val().employeeID)

    var delButton = $("<button>")
    delButton.html("X")
    delButton.addClass("delete")
    delButton.attr("value", childSnapshot.val().employeeID)
    var nameCell = $("<td>")
    var roleCell = $("<td>")
    var sdCell = $("<td>")
    var mwCell = $("<td>")
    var mrCell = $("<td>")
    var tbCell = $("<td>")
    var delCell = $("<td>")
    delCell.append(delButton)
    nameCell.text(childSnapshot.val().name)
    roleCell.text(childSnapshot.val().role)
    sdCell.text(childSnapshot.val().startDate)
    mwCell.text(childSnapshot.val().monthsWorked)
    mrCell.text(childSnapshot.val().monthlyRate)
    tbCell.text(childSnapshot.val().totalBilled)
    $(newRow).append(nameCell)
    $(newRow).append(roleCell)
    $(newRow).append(sdCell)
    $(newRow).append(mwCell)
    $(newRow).append(mrCell)
    $(newRow).append(tbCell)
    $(newRow).append(delButton)
    $("#employeeRow").append(newRow)
    $("#employeeRow").css("background-color", rowColor)
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
//function that occurs once the submit button of the form is clicked
$("#add-emp").on("click", function (event) {
    event.preventDefault()
    
    
    //gather info from form
    var name = $("#name-input").val().trim()
    var role = $("#role-input").val().trim()
    var startDate = $("#sd-input").val().trim()
    startDate = moment(startDate).format("MM/DD/YYYY")
    var monthsWorked = findMonthsWorked(startDate);
    var monthlyRate = $("#rate-input").val().trim()
    var totalBilled = monthsWorked * monthlyRate
    //fill db with values
    database.ref("/employeeData").push({
        name: name,
        role: role,
        startDate: startDate,
        monthsWorked: monthsWorked,
        monthlyRate: monthlyRate,
        totalBilled: totalBilled,
        employeeID: "emp-" + (rowCounter + 1)
    });
    //clears form input fields
    $("#name-input").val("")
    $("#role-input").val("")
    $("#rate-input").val("")
    $("#sd-input").val("")

});

if (rowCounter % 2 == 0){
    rowColor = "lightblue"
}

    
function findMonthsWorked(startDate){
    var monthsWorked;
    var yearsWorked;
    
    var startMonth = moment(startDate).format("MM")
    var startYear = moment(startDate).format("YYYY")
    
    monthsWorked = (parseInt(currentDateYear) - parseInt(startYear)) * 12
    
    monthsWorked += (parseInt(currentDateMonth) - parseInt(startMonth))
    
    return monthsWorked
}

$(document).on("click", ".delete", function(event){
    event.preventDefault()
    alert("delete button clicked")
    var trow = $(this).attr("value")
    alert(trow)
    $("#" + trow).empty()


})