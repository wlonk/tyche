'use strict';

module.exports = function(robot) {
  robot.respond(/roll (\+|-)(\d+|{[^}]+})/i, function (msg) {
    let answer;
    let dice = 2;
    let sides = 6;
    let sign = msg.match[1];
    let stat = parseInt(msg.match[2], 10);
    if (sign == '-') {
      stat = -1 * stat;
    }
    answer = report(roll(dice, sides), stat);
    msg.reply(answer);
  });
}


var report = function(results, stat) {
  let total = results.reduce(function (x, y) { return x + y; }) + stat;
  let quality;
  if (total >= 10) {
    quality = "strong hit";
  } else if (total >= 7) {
    quality = "weak hit";
  } else {
    quality = "miss";
  }
  return "I rolled a " + quality + ". (" + total + ")";
}


var roll = function(dice, sides) {
  var i, j, ref, results1;
  results1 = [];
  for (i = j = 0, ref = dice; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    results1.push(rollOne(sides));
  }
  return results1;
};

var rollOne = function(sides) {
  return 1 + Math.floor(Math.random() * sides)
}
