// return arguments sent with request, if any
function checkArguments(request) {
  var req_split = request.split('-');
  var args = [];
  for (j=1; j < req_split.length; j++) {
    args.push(req_split[j].replace(/ /g, ''));
  }
  return args;
}


function array_contains(haystack, needle) {
  for (k=0; k < haystack.length; k++) {
    if (haystack[k] === needle) {
      return true;
    }
  }
  return false;
}

//time to decide what data to return
function formatImageResponse(object, args) {
  var card_response = '';
  //check if regular or Gold image is requested
  if (array_contains(args, 'g')) {
    if (object.imgGold === undefined) {
      card_response = 'Seems like that card doesn\'t have a golden image available, or my closest search match was off. Try again with more specifics or without the -g flag';
    } else {
      card_response = object.imgGold;
    }
  } else {
    if (object.img === undefined) {
      card_response = 'Sorry I couldn\'t find that card.';
    } else {
      card_response = object.img;
    }
  }
  //check for Flavor text request
  if (array_contains(args, 'f')) {
    if (object.flavor === undefined) {
      card_response = card_response.concat('\n there\'s no flavor text available for this card.');
    } else {
      card_response = card_response.concat('\n "' + object.flavor + '"');
    }
  }
  //check for text-only response, and format output as needed
  //the API has some data holes and some cards do not have some fields, so
  //lots of "undefined" logic to help work around that
  if (array_contains(args, 't')) {
      card_response = '';
      card_response = card_response.concat('\n*Name:* ' + object.name + '');
      if (object.cardSet !== undefined) {
        card_response = card_response.concat('\n*Set:* ' + object.cardSet + '');
      }
      if (object.type !== undefined) {
        card_response = card_response.concat('\n*Type:* ' + object.type + '');
      }
      if (object.faction !== undefined) {
        card_response = card_response.concat('\n*Class:* ' + object.faction + '');
      }
      if (object.rarity !== undefined) {
        card_response = card_response.concat('\n*Rarity:* ' + object.rarity + '');
      }
      if (object.cost !== undefined) {
        card_response = card_response.concat('\n*Cost:* ' + object.cost + ' mana');
      }
      if (object.attack !== undefined) {
        card_response = card_response.concat('\n*Attk/Hp* ' + object.attack + '/'+ object.health +'');
      }
      if (object.text !== undefined) {
        card_response = card_response.concat('\n*Text:* ' + object.text + '');
      }
      if (object.flavor !== undefined) {
        card_response = card_response.concat('\n*Flavor:* ' + object.flavor + '');
      }
      
  }
  //check for the "help" flag
  if (array_contains(args, 'h')) {
    card_response = 'Format your requests like "Innkeeper [C\'Thun]". \nYou can also append *-g* for a Gold card, *-f* to add Flavor text, and *-t* for text-only details.';
  }
  // logic to convert <b> and <i> HTML to slack-friendly format
  card_response = card_response.replace("<b>", "*");
  card_response = card_response.replace("</b>", "*");
  card_response = card_response.replace("<i>", "_");
  card_response = card_response.replace("</i>", "_");
  //actually return the response
  return card_response;
}


module.exports = function (req, res, next) {
  // Handle initial data
  var random = true,
      random_array = [],
      request = require('request'),
      userName = req.body.user_name,
      command = req.body.text,
      card_response = '',
      args = checkArguments(command);

  // Start formatting data.
  // try-catch, because of the regex
  try {
    //uncomment out below if not using heroku
    //var config = require('./config.json');
    var re = /\[(.*?)\]/,
        card = re.exec(command)[1],
        formatted_card = card.replace(/ /g, "%20"),
        options = {
          url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/' + formatted_card,
          headers: {
            //uncomment out below if using heroku
            'X-Mashape-Key': ENV['API_KEY']
            //uncomment below if not using Heroku
            //'X-Mashape-Key': config.api_key
          }
        };
  } catch (err) {
    return res.status(200).json({
      text: 'Try formatting like "Innkeeper [C\'Thun]". Append -g for Gold card, -f to add Flavor text, and -t for text-only"'
    });
  }


  // Request response from external api
  request.get(options, function (e, r, b) {
    var json = JSON.parse(b);
    // console.log(r.statusCode);

    // This is just if it broke completely.
    if (e || r.statusCode !== 200) {
      return res.status(200).json({
        text: 'Sorry, I couldn\'t find that card.'
      });
    }

    // Check to see if we can find the exact card
    if (json.length > 1) {
      for (i = 0; i < json.length; i++) {
        if (json[i].name !== card || json[i].img === undefined) {
          // This is for fun, if someone enters a query that returns many responses,
          // but none are exactly it return a random result. this is fun.
          random_array.push(formatImageResponse(json[i], args));
        } else {
          random = false;
          card_response = "here you go: " + formatImageResponse(json[i], args);
          break;
        }
      }
    } else {
      random = false;
      card_response = formatImageResponse(json[0], args);
    }

    if (random) {
      card_response = "Random closest result: " + random_array[Math.floor(Math.random() * random_array.length)]
    }

    // Sanity check to prevent a bot from recursively calling itself
    if (userName !== 'slackbot') {
      return res.status(200).json({
        text: card_response
      });
    } else {
      return res.status(200).end();
    }
  });
}