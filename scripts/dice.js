'use strict';

module.exports = function(robot) {
  robot.respond(/roll (\d+)d(\d+)/i, function(msg) {
    let answer;
    let dice = parseInt(msg.match[1]);
    let sides = parseInt(msg.match[2]);
    if (sides < 1) {
      answer = "What is that, a die for ants? I won't roll it.";
    } else if (dice > 100) {
      answer = "Really? I'm not going to roll more than 100 dice for you."
    } else {
      answer = report(roll(dice, sides));
    }
    msg.reply(answer);
  });
};


let report = function(results) {
  if (results != null) {
    switch (results.length) {
      case 0:
        return "I didn't roll any dice.";
      case 1:
        return `I rolled a ${results[0]}.`;
      default:
        let total = results.reduce((x, y) => x + y);
        let finalComma = (results.length > 2) ? "," : "";
        let last = results.pop();
        return `I rolled ${results.join(", ")}${finalComma} and ${last}, making ${total}.`;
    }
  }
};


let roll = (dice, sides) => __range__(0, dice, false).map((i) => rollOne(sides));


let rollOne = (sides) => 1 + Math.floor(Math.random() * sides);


function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
