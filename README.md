# slackHSBot
A webserver that supplies data to a Slack outgoing webhook for a hearthstone-themed slack bots.
Currently used for finding cards in hearthstone and linking their image or text into chat. 
I've forked https://github.com/skeltont/slackHSBot and made a fair bit of improvements and modifications for my own slack server.
(If you make use of my own bot, please make sure to give him due credit for the initial heavy lifting!)

## Install & Run 
- git clone repo
- npm install
- node app.js

## Usage
Configure an outgoing webhook in slack to send a GET request to the server's hostname (http://example.com/get_card) when it identifies your trigger (we use 'inkeeper' for ours)
<br /> *Example:* <br />
``` inkeeper [Druid of the Claw] ```

##### Options
Three options are available:
- **g**: ```inkeeper [C'Thun] -g``` Will link a .gif of the *golden* card image into chat. 
- **f**: ```inkeeper [C'Thun] -f``` Will add the flavor text for the card into chat after the image. 
- **t**: ```inkeeper [C'Thun] -t``` Will return only all of the card data (skipping undefined sections) with no image into chat. 

## Testing your server's response directly in development
```curl -X POST --data "text=inkeeper [C'Thun]" http://localhost:3000/get_card```

## API
This bot makes use of an external api called [hearthstoneapi](http://hearthstoneapi.com/). You'll need to obtain your own API key there.