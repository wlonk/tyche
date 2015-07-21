module.exports = (robot) ->
  robot.respond /roll (\d+)d(\d+|{[^}]+})/i, (msg) ->
    dice = parseInt msg.match[1]
    sides = parseInt msg.match[2]
    if isNaN sides
      group = msg.match[2]
      elements = group[1..group.length - 2].split ","
      answer = if elements.length < 1
        "Oh, c'mon!"
      else if dice > 100
        "Really? I'm not going to roll more than 100 dice for you."
      else
        getElements dice, elements
    else
      answer = if sides < 1
        "What is that, a die for ants? I won't roll it."
      else if dice > 100
        "Really? I'm not going to roll more than 100 dice for you."
      else
        report roll dice, sides
    msg.reply answer


report = (results) ->
  if results?
    switch results.length
      when 0
        "I didn't roll any dice."
      when 1
        "I rolled a #{results[0]}."
      else
        total = results.reduce (x, y) -> x + y
        finalComma = if (results.length > 2) then "," else ""
        last = results.pop()
        "I rolled #{results.join(", ")}#{finalComma} and #{last}, making #{total}."


getElements = (dice, elements) ->
  results = (elements[i - 1] for i in roll dice, elements.length)
  finalComma = if (results.length > 2) then "," else ""
  last = results.pop()
  console.log(results)
  if results.length > 0
    "I rolled #{results.join(", ")}#{finalComma} and #{last}."
  else
    "I rolled #{last}."


roll = (dice, sides) ->
  rollOne(sides) for i in [0...dice]

rollOne = (sides) ->
  1 + Math.floor(Math.random() * sides)
