//! ----------------------------Your web app's Firebase configuration ---------------------------//
var firebaseConfig = {
	apiKey: "AIzaSyAdiblSUR0V5HA0mTOk7uGFbhveIm_YN7s",
	authDomain: "onlinerps-1c079.firebaseapp.com",
	databaseURL: "https://onlinerps-1c079.firebaseio.com",
	projectId: "onlinerps-1c079",
	storageBucket: "",
	messagingSenderId: "374757918264",
	appId: "1:374757918264:web:d609eb8f319f32e3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();
//! ---------------------------- END Your web app's Firebase configuration ---------------------------//
//! ---------------------------- Initial var -----------------------------//
var player1 = null;
var player2 = null;
var playerOneName = "";
var playerTwoName = "";
console.log('reloaded"');
//! ---------------------------- END Initial var -----------------------------//
//!------------------------------------ connection reference block ----------------------------//

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
//* true = client connected
//* false = client not connected
var connectedRef = database.ref(".info/connected");

//client connection event listener
connectedRef.on("value", function(snapshot) {
	//* if connected
	if (snapshot.val()) {
		//* ADD
		//user to connection list
		var con = connectionsRef.push(true);

		//* REMOVE
		//user frome connection list when disconnect
		con.onDisconnect().remove();
	}
});

connectionsRef.on("value", function(snapshot) {
	//**PLAYER 1 */
	if (snapshot.child("Player1").exists()) {
		P1 = snapshot.val().Player1;
		$("#p1name").text(P1.name);
		$("#new_player_one").remove();
	} else {
		$("#p1name").text("Waiting on player 1 name...");

		//**CREATES PLAYER 1 INPUT NAME REQUEST */
		$("#new_player_one").remove();
		console.log("player 1 doesn't exist");
		newDiv = $("<div id='new_player_one'>");
		newForm = $("<form>");
		newInput = $("<input>")
			.addClass("new_input")
			.attr("id", "player_one_name_input")
			.attr("type", "text");
		newBtn = $("<button>")
			.addClass("new_submit")
			.attr("id", "player_one_name_submit")
			.attr("type", "submit")
			.text("Submit");
		newForm.append(newInput, newBtn);
		newDiv.append(newForm);
		$("#playerone").append(newDiv);
	}
	//**PLAYER 2 */
	if (snapshot.child("Player2").exists()) {
		P2 = snapshot.val().Player2;
		$("#p2name").text(P2.name);
		$("#new_player_two").remove();
	} else {
		$("#p2name").text("Waiting on player 2 name...");

		//**CRREATES PLAYER 2 INPUT NAME REQUEST */
		$("#new_player_two").remove();
		console.log("player 2 doesn't exist");
		newDiv = $("<div id='new_player_two'>");
		newForm = $("<form>");
		newInput = $("<input>")
			.addClass("new_input")
			.attr("id", "player_two_name_input")
			.attr("type", "text");
		newBtn = $("<button>")
			.addClass("new_submit")
			.attr("id", "player_two_name_submit")
			.attr("type", "submit")
			.text("Submit");
		newForm.append(newInput, newBtn);
		newDiv.append(newForm);
		$("#playertwo").append(newDiv);
	}
});

//!-------------------------------- END connection reference block -------------------------//

//!--------------------------------Button Event---------------------------------//

$(document).ready(function() {
	$(".new_submit").on("click", "#player_one_name_submit", function(event) {
		event.preventDefault();

		let inputValue = $("#player_one_name_inpput")
			.val()
			.trim();
		console.log("name entered " + inputValue);
		if (inputValue === "") {
			return false;
		} else {
			let newPlayer1 = {
				name: inputValue,
				wins: 0,
				loses: 0,
				ties: 0,
				choice: ""
			};

			database.ref("/connections/Player1").set({
				newPlayer1
			});
		}
	});
});
