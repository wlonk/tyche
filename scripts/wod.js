'use strict';

const SUCCESS_THRESHOLD = 8;
const DEFAULT_EXPLODE_TARGET = 10;

module.exports = function(robot) {
	robot.respond(/roll (\d+)(?:e(\d+))?(r?)/i, function (msg) {
		let answer;
		let pool = parseInt(msg.match[1]);
		let explode_target = parseInt(msg.match[2]) || DEFAULT_EXPLODE_TARGET;
		let is_rote = Boolean(msg.match[3]);
		if (pool < 1) {
			answer = 'That is too few dice, my human';
		} else if (pool > 100){
			answer = 'That is too many dice, my human';
		} else if (explode_target < 8) {
			answer = 'That is an invalid explode target, human';
		} else if (is_rote) {
			let initial_roll = rote(rollMany(pool));
			let explode_allowed = (explode(rollMany(pool), explode_target));
			Array.prototype.push.apply(explode_allowed, initial_roll);
			answer = report(explode_allowed);
		} else {
			answer = report(explode(rollMany(pool), explode_target));
		}
		msg.reply(answer);
	});
}


function roll() {
	let result = Math.floor(Math.random()*10) + 1;
	return result ;
}


function rollMany(dice){
	let results = [];
	for (var i = 0; i < dice; i++) {
		results.push(roll());
	}
	results.sort(function(a, b) {
		return a - b;
	});
	return results;
}


function explode(results, target) {
	let myArray = results.slice(0);
	for (var num of myArray) {
		if (num >= target){
			myArray.push(roll());
		}
	}
	return myArray;
}


function rote(results) {
	let reroll = results.slice(0);
	let noExplodeyDice = [];
	for (var i = 0; i < reroll.length; i++) {
		if (reroll[i] < 8){
			noExplodeyDice.push(roll());
		}
	}
	return noExplodeyDice;
}


function report(results) {
	if (results != null) {
		switch (results.length) {
			case 0:
			return "I didn't roll any dice"
			case 1:
			return `I rolled a ${results[0]}.`;
			default: 
			let successes = 0;
			for (var i = 0; i < results.length; i++) {
				if (results[i] >= SUCCESS_THRESHOLD) {
					successes++;
				}
			}
			let last = results.pop();
			let finalComma = (results.length > 2) ? "," : "";
			return `I rolled ${results.join(", ")}${finalComma} and ${last} making ${successes} hits.`;
		}
	}
}
