# slackHSBot
A webserver that supplies data to a Slack outgoing webhook for a hearthstone-themed slack bots.
Currently used for finding cards in hearthstone and linking their image or text into chat. 
I've forked https://github.com/skeltont/slackHSBot and made a fair bit of improvements and modifications for my own slack server.
(If you make use of my own app, please make sure to give him due credit for all the initial heavy lifting!)

## Install & Run
- git clone repo
- npm install
- node app.js

### Production deploy
Everything should be set in place to work on Heroku or a similar production platform.

## Usage
Configure an outgoing webhook in slack to send a POST request to the server (http://example.com/get_card) when it identifies your trigger (we use 'inkeeper' for ours).
<br /> *Example:* <br />
``` inkeeper [C'Thun] ```
This should return 
>"here you go: http://wow.zamimg.com/images/hearthstone/cards/enus/original/OG_279.png"

##### Options
Three additional options are available:
- **-g**: ```inkeeper [C'Thun] -g``` Will link a .gif of the *golden* card image into chat. 
- **-f**: ```inkeeper [C'Thun] -f``` Will add the flavor text for the card into chat after the image. 
- **-t**: ```inkeeper [C'Thun] -t``` Will return only all of the card data (skipping undefined sections) with no image into chat. 

## Testing your server's response directly
```curl -X POST --data "text=inkeeper [C'Thun]" http://localhost:3000/get_card```

should return

```{"text":"here you go: http://wow.zamimg.com/images/hearthstone/cards/enus/original/OG_279.png"}```

## API dependency
This bot makes use of an external api called [hearthstoneapi](http://hearthstoneapi.com/). You'll need to obtain your own API key for it, from Mashape (linked to from the API's site).