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
//! ---------------------------- global var -----------------------------//
//* playerone or playertwo
var uid = null;
var oid = null;
var name = "anon";
var udbid = null;
var odbid = null;
var wins = 0;
var loses = 0;
var draws = 0;
var oppwins = 0;
var opploses = 0;
var oppdraws = 0;
var outcome = "";
var oppoutcome = "";
//! ---------------------------- END global var -----------------------------//
//!------------------------------------ connection reference block ----------------------------//

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
//* true = client connected
//* false = client not connected
var connectedRef = database.ref(".info/connected");

// chat database reference
var chatRef = database.ref("/chat");

//client connection event listener
connectedRef.on("value", function (snapshot) {
	//* if connected
	if (snapshot.val()) {
		var con = connectionsRef.push(true);
		udbid = con.key;
		con.set({
			player: "",
			name: "",
			wins: 0,
			draws: 0,
			loses: 0,
			choice: ""
		});

		con.onDisconnect().remove();
		chatRef.remove();
	}
});

connectionsRef.on("value", function (snapshot) {
	// sets user profile
	if (uid === null) {
		if (snapshot.numChildren() === 1) {
			uid = "playerone";
			oid = "playertwo";
			$(`#${uid}header`).append($("<p>").text("you"));
			$(`#${uid}name`).append($("<p>").text("waiting on other player"));
			$(`#${oid}header`).append($("<p>").text("player 2"));
			$(`#${oid}name`).append($("<p>").text("waiting for player"));
			createOptions();
		} else {
			uid = "playertwo";
			oid = "playerone";
			$(`#${uid}header`).append($("<p>").text("you"));
			$(`#${uid}name`).append($("<p>").text("waiting on other player"));
			$(`#${oid}header`).append($("<p>").text("player 2"));
			$(`#${oid}name`).append($("<p>").text("waiting for player"));
			createOptions();
		}
	}

	//! if both players are in
	if (snapshot.numChildren() === 2) {
		//* gets opp pathway
		if (uid === "playerone") {
			odbid = Object.keys(snapshot.val())[1];
		} else if (uid === "playertwo") {
			odbid = Object.keys(snapshot.val())[0];
		}
		//* sets up pathways and records
		var yourDB = snapshot.child(udbid).val();
		var oppDB = snapshot.child(odbid).val();

		wins = yourDB.wins;
		loses = yourDB.loses;
		draws = yourDB.draws;

		//* name creation
		if (!yourDB.name) {
			$(`#${uid}name`).empty();
			let newDiv = $("<div id='name_form'>");
			let newForm = $("<form onsubmit='submitedForm()'>");
			let newInput = $("<input>")
				.addClass("nameinput")
				.attr("placeholder", "name then press enter");
			let newButton = $("<button>")
				.addClass("namebutton")
				.attr("id", "button")
				.attr("type", "submit")
				.text("send");
			newForm.append(newInput, newButton);
			newDiv.append(newForm);
			$(`#${uid}name`).append(newDiv);
		} else {
			$(`#${uid}name`).empty();
			$(`#${uid}name`).append($("<p>").text(name));
		}

		if (!oppDB.name) {
			$(`#${oid}name`).empty();
			$(`#${oid}name`).append($("<p>").text("name"));
		} else {
			$(`#${oid}name`).empty();
			$(`#${oid}name`).append($("<p>").text(oppDB.name));
		}

		//* compares choices
		if (yourDB.choice && oppDB.choice) {
			var dbpath = database.ref(`/connections/${udbid}`);

			if (yourDB.choice === "rock") {
				//! draw
				if (oppDB.choice === "rock") {
					oppdraws++;
					draws++;
					outcome = "draw";
					oppoutcome = "draw";
					dbpath.update({
						choice: "",
						draws: draws
					});
				}
				//! win
				if (oppDB.choice === "scissors") {
					opploses++;
					wins++;
					outcome = "won!";
					oppoutcome = "loss!";
					dbpath.update({
						choice: "",
						wins: wins
					});
				}

				//! loss
				if (oppDB.choice === "paper") {
					oppwins++;
					loses++;
					outcome = "loss!";
					oppoutcome = "won!";
					dbpath.update({
						choice: "",
						loses: loses
					});
				}
			}

			if (yourDB.choice === "paper") {
				//! draw
				if (oppDB.choice === "paper") {
					oppdraws++;
					draws++;
					outcome = "draw";
					oppoutcome = "draw";
					dbpath.update({
						choice: "",
						draws: draws
					});
				}

				//! win
				if (oppDB.choice === "rock") {
					opploses++;
					wins++;
					outcome = "won!";
					oppoutcome = "loss!";
					dbpath.update({
						choice: "",
						wins: wins
					});
				}

				//! lose
				if (oppDB.choice === "scissors") {
					oppwins++;
					loses++;
					outcome = "lose!";
					oppoutcome = "won!";
					dbpath.update({
						choice: "",
						loses: loses
					});
				}
			}

			if (yourDB.choice === "scissors") {
				//! draw
				if (oppDB.choice === "scissors") {
					oppdraws++;
					draws++;
					outcome = "draw";
					oppoutcome = "draw";
					dbpath.update({
						choice: "",
						draws: draws
					});
				}

				//! win
				if (oppDB.choice === "paper") {
					opploses++;
					wins++;
					outcome = "won!";
					oppoutcome = "loss!";
					dbpath.update({
						choice: "",
						wins: wins
					});
				}

				//! lose
				if (oppDB.choice === "rock") {
					oppwins++;
					loses++;
					outcome = "loss!";
					oppoutcome = "won!";
					dbpath.update({
						choice: "",
						loses: loses
					});
				}
			}

			createOptions();
		}

		if (yourDB.choice && !oppDB.choice) {
			//! waiting on opp
			$(`#${uid}options`).empty();
			let youwaiting = $("<div>")
				.addClass("waiting")
				.text("waiting on opponent...");
			$(`#${uid}options`).append(youwaiting);
		}

		if (!yourDB.choice && oppDB.choice) {
			//! waiting on you
			$(`#${oid}options`).empty();
			let oppwaiting = $("<div>")
				.addClass("waiting")
				.text("waiting on you..");
			$(`#${oid}options`).append(oppwaiting);
		}
	}
});

//* chat display

chatRef.on("value", function (snapshot) {
	if (snapshot.val()) {
		if (snapshot.val().name) {
			let chat_name = snapshot.val().name;
			let chat_message = snapshot.val().message;

			//* checks if its you that inserted message
			if (chat_name === name) {
				chat_name = "you";
			}

			//* creates message
			let newDiv = $("<div>").addClass("chatline");
			let new_message_name = $("<p>")
				.addClass("cname")
				.text(chat_name + ":");
			let new_message = $("<p>")
				.addClass("cmessage")
				.text(chat_message);

			newDiv.append(new_message_name, new_message);
			$(".chat_display").append(newDiv);

			// keeps user scrolled to the bottom /
			$(".chat_display").scrollTop($(".chat_display")[0].scrollHeight);
		}
	}
});
//!-------------------------------- END connection reference block -------------------------//
//* creates rock paper scissors options
function createOptions() {
	$(`#${uid}options`).empty();
	$(`#${oid}options`).empty();
	$(`#${uid}scores`).empty();
	$(`#${oid}scores`).empty();

	//** your options */
	let rockOption = $("<div>")
		.addClass("option")
		.append($("<p>").text("rock"));
	let paperOption = $("<div>")
		.addClass("option")
		.append($("<p>").text("paper"));
	let scissorsOption = $("<div>")
		.addClass("option")
		.append($("<p>").text("scissors"));
	$(`#${uid}options`).append(rockOption, paperOption, scissorsOption);

	//** other players options */
	let choosing = $("<div>")
		.addClass("waiting")
		.text("choosing...");
	$(`#${oid}options`).append(choosing);

	//** your score */
	let outcomescore = $("<div>")
		.addClass("score")
		.append($("<p>").text(outcome));
	let winsscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`wins: ${wins}`));
	let losesscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`loses: ${loses}`));
	let drawsscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`draws: ${draws}`));
	$(`#${uid}scores`).append(outcomescore, winsscore, losesscore, drawsscore);

	//** opp score */
	let oppoutcomescore = $("<div>")
		.addClass("score")
		.append($("<p>").text(oppoutcome));
	let oppwinsscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`wins: ${oppwins}`));
	let opplosesscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`loses: ${opploses}`));
	let oppdrawsscore = $("<div>")
		.addClass("score")
		.append($("<p>").text(`draws: ${oppdraws}`));
	$(`#${oid}scores`).append(
		oppoutcomescore,
		oppwinsscore,
		opplosesscore,
		oppdrawsscore
	);
}

function optionClicked(playerchoice) {
	database.ref(`/connections/${udbid}`).update({
		choice: playerchoice
	});
}

//* name submition form
function submitedForm() {
	event.preventDefault();

	name = $(".nameinput")
		.val()
		.trim();

	database.ref(`/connections/${udbid}`).update({
		name: name
	});
}

function chatForm() {
	event.preventDefault();
	//* retrieves message
	message = $(".chat_input")
		.val()
		.trim();

	$(".chat_input").val("");
	chatRef.set({
		name: name,
		message: message
	});
}

//* event listenters
$(document).ready(function () {
	$(".options").on("click", ".option", function () {
		playerchoice = $(this).text();
		optionClicked(playerchoice);
	});
});