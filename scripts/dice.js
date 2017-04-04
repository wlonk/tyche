module.exports = function(robot) {
  robot.respond(/roll (\d+)d(\d+|{[^}]+})/i, function(msg) {
    let answer;
    let dice = parseInt(msg.match[1]);
    let sides = parseInt(msg.match[2]);
    if (isNaN(sides)) {
      let group = msg.match[2];
      let elements = group.slice(1, +group.length - 2 + 1 || undefined).split(",");
      if (elements.length < 1) {
        answer = "Oh, c'mon!"
      } else if (dice > 100) {
        answer = "Really? I'm not going to roll more than 100 dice for you."
      } else {
        answer = getElements(dice, elements);
      }
    } else {
      if (sides < 1) {
        answer = "What is that, a die for ants? I won't roll it.";
      } else if (dice > 100) {
        answer = "Really? I'm not going to roll more than 100 dice for you."
      } else {
        answer = report(roll(dice, sides));
      }
    }
    msg.reply(answer);
  });
};


var report = function(results) {
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


var getElements = function(dice, elements) {
  let results = (Array.from(roll(dice, elements.length)).map((i) => elements[i - 1]));
  let finalComma = (results.length > 2) ? "," : "";
  let last = results.pop();
  console.log(results);
  if (results.length > 0) {
    return `I rolled ${results.join(", ")}${finalComma} and ${last}.`;
  } else {
    return `I rolled ${last}.`;
  }
};


var roll = (dice, sides) => __range__(0, dice, false).map((i) => rollOne(sides));

var rollOne = (sides) => 1 + Math.floor(Math.random() * sides);

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
