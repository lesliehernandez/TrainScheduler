
//DOCUMENT READY ON PAGE LOAD
$(document).ready(function () {

//CONFIG FIREBASE
var config = {
  apiKey: "AIzaSyA44ehO3r0MH-JL_exgW_w9Z-5hc4xCTk4",
  authDomain: "train-scheduler-cbbec.firebaseapp.com",
  databaseURL: "https://train-scheduler-cbbec.firebaseio.com",
  projectId: "train-scheduler-cbbec",
  storageBucket: "",
  messagingSenderId: "665706371894"
};

//INITIALIZE FIREBASE
firebase.initializeApp(config);

//CREATE VARIABLE TO REFERENCE FIREBASE
var database = firebase.database();

// CAPTURE BUTTON CLICK
$("#submit").on("click", function(event) {

//PREVENT PAGE FROM REFRESHING  
event.preventDefault();

//GET USER INPUTS
trainName = $("#train-name").val().trim();
destination = $("#destination").val().trim();
firstTrainTime = $("#first-train-time").val().trim();
frequency = $("#frequency").val().trim();


var train = {
  trainName: trainName,
  destination: destination,
  firstTrainTime: firstTrainTime,
  frequency: frequency,
  dateAdded: firebase.database.ServerValue.TIMESTAMP
};

database.ref("/trains").push(train);
  
});

database.ref("/trains").on("child_added", function(childSnapshot) {
    
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;
    
  var firstTimeConverted = moment(firstTrainTime, "HH:mm");

  var currentTime = moment().format("HH:mm");
    
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    
  var timeRemainder = timeDiff % frequency;
    
  var minToTrain = frequency - timeRemainder;
    
  var nextArrival = moment().add(minToTrain, "minutes").format("HH:mm");

  $("#table-body").append("<tr>" + "<td>" + trainName + "</td>" + "<td>" + destination + "</td>" + "<td>" + frequency + "</td>" + "<td>" + nextArrival + "</td>" + "<td>" + minToTrain + "</td>" + "</tr>");

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
  });
});
