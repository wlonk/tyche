'use strict';

module.exports = function(robot) {
  robot.respond(/roll (\w+) (\+|-)(\d+)/i, function (msg) {
    let answer;
    let sign = msg.match[2];
    let stat = parseInt(msg.match[3], 10);
    if (sign == '-') {
      stat = -1 * stat;
    }
    answer = report(roll(), stat);
    msg.reply(answer);
  });
};


const report = function(results, stat) {
  let total = results.reduce(function (x, y) { return x + y; }) + stat;
  let values = results.map(function (x) {
    switch (x) {
      case -1:
        return '-';
      case 0:
        return 'o';
      case 1:
        return '+';
      default:
        return '';
    }
  }).join(', ');
  return `I rolled ${total}. (${values})`;
};


const roll = function() {
  let i, results;
  results = [];
  for (i = 0; i < 4; i++) {
    results.push(rollOne(3) - 2);
  }
  return results;
};


const rollOne = function(sides) {
  return 1 + Math.floor(Math.random() * sides)
};
