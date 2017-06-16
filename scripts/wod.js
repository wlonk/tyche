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
		} else if (explode_target < SUCCESS_THRESHOLD || explode_target > DEFAULT_EXPLODE_TARGET) {
			answer = 'That is an invalid explode target, human';
		} else if (is_rote) {
			let initial_roll = rollMany(pool);
			let success_pool = [];
			let failure_pool = [];
			let combined_results = [];
			for (var i = 0; i < initial_roll.length; i++) {
				if (initial_roll[i] >= SUCCESS_THRESHOLD) {
					success_pool.push(initial_roll[i]);
				} else if (initial_roll[i] < SUCCESS_THRESHOLD) {
					failure_pool.push(initial_roll[i]);
				}
			}
			success_pool = explode(success_pool, explode_target);
			failure_pool = rote(failure_pool);
			combined_results = failure_pool.concat(success_pool);
			answer = report(combined_results);
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
		if (reroll[i] < SUCCESS_THRESHOLD){
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
			let hits = 0
			if (results[0] > SUCCESS_THRESHOLD) {
				return `I rolled a ${results[0]}, making 1 hit.`;
			} else {
			return `I rolled a ${results[0]}, for no hits.`;
			}
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
