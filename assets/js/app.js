// CONFIGURE FIREBAS
var config = {
    apiKey: "AIzaSyA44ehO3r0MH-JL_exgW_w9Z-5hc4xCTk4",
    authDomain: "train-scheduler-cbbec.firebaseapp.com",
    databaseURL: "https://train-scheduler-cbbec.firebaseio.com",
    projectId: "train-scheduler-cbbec",
    storageBucket: "",
    messagingSenderId: "665706371894"
  };

  // INITIALIZE FIREBASE
  firebase.initializeApp(config);

  // CREATE VARIABLE TO REF DATABASE
  var database = firebase.database();

  // CREATE VARIABLES
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;
  var nextArrival = "";

  // CAPTURE BUTTON CLICK
  $("#submit").on("click", function(event) {

  //PREVENT PAGE FROM REFRESHING    
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();


    var json = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

  //PUSHING NEW VALUES TO FIREBASE  
    database.ref("/trains").push(json);

  });

  // Firebase watcher + initial loader. This function fires on page load and when an object is added to the database
  database.ref("/trains").on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    var timeFormat = "HH:mm";
    var convertedTime = moment(childSnapshot.val().firstTrainTime, timeFormat);
    var nextArrival = moment(convertedTime).diff(moment(), "minutes");
    var minutesAway = nextArrival * childSnapshot.val().frequency;

    $("#table-body").append("<tr>" + "<td>" + childSnapshot.val().trainName + "</td>" + "<td>" + childSnapshot.val().destination + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "<td>" + nextArrival + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "</tr>");

  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });