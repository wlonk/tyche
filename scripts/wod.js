'use strict';

//pool, explode-at, rote
//where rote means the intial failed dice are rerolled
//notably, those rerolled dice cannot explode, and failed exploding dice from qualities can't either
//meaning that rote has to be counted separately AFTER accounting for dice explosion
//All 10s explode

module.exports = function(robot) {
	robot.respond(/roll (\d+)e(\d+)([r])/i, function (msg) {
		let answer;
		let pool = parseInt(msg.match[1]);
    	let explode = parseInt(msg.match[2]);
    	let rote = parseInt(msg.match[3]);
    	if (explode == NaN) {
    		//TODO why NaN?
    		//TODO test regex
    		//TODO fill out rest of msg.reply
    		//TODO bad input cases
    	}
	}
}


function roll() {
	let result = Math.floor(Math.random()*10) + 1;
	return(result);
}


function rollMany(dice){
	let results = [];
	for (var i = 0; i < dice; i++) {
		results[i] = roll();
	}
	results.sort(function(a, b) {
		return a - b;
	});
	return(results);
}


function explode(results, target) {
	let myArray = results.slice(0);
	var targetNumber = target;
	for (var num of myArray) {
		if (num >= target){
			myArray.push(roll());
		}
	}
	return(myArray);
}


function rote(results) {
	let reroll = results.slice(0);
	for (var i = 0; i < reroll.length; i++) {
		if (reroll[i] < 8){
			reroll[i] = roll();
		}
	}
	return(reroll);
}


function report(rollarray) {
	if (array != null) {
		switch (results.length) {
			case 0:
				return "I didn't roll any dice"
			case 1:
				return `I rolled a ${results[0]}.`;
			default: 
				let finalComma = (results.length > 2) ? "," : "";
        		let last = results.pop();
        		let successes = 0;
        		for (var i = 0; i < rollarray.length; i++) {
        			if (rollarray[i] > 8) {
        				successes++;
        			}
        		}
        		return `I rolled ${results.join(", ")}${finalComma} and ${last} making ${successes} hits.`;
		}
	}
}