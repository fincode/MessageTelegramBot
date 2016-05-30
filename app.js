var TelegramBot = require('node-telegram-bot-api');
var token = '<YOUR TELEGRAM BOT API TOKEN>';
var bot = new TelegramBot(token, { polling: true });

var users = [];

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.listen(3333);
app.use(bodyParser.json())

app.use(function (req, res, next) {
    console.log(req.body) 
    next()
})

app.post('/sendmessage', function (request, response) {
    var body = request.body;
    console.log(body);    
    response.send("{result: true}");
    for (var i = 0; i < users.length; ++i) {
        for (var j = 0; j < body.length; ++j) {
            var from = body[j].from != null && body[j].from != "" ? "from: " + body[j].from + "\n" : "";
            var date = body[j].timestamp != null ? timeConverter(body[j].timestamp)+ "\n" : "";
            var message = date + from + body[j].text;
            bot.sendMessage(users[i], message, { caption: "I'm a bot!" });
        }
    }
});

function timeConverter(unix_timestamp) {
    var date = new Date(unix_timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}


bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    console.log(msg);
    var inputMessage = msg.text;
    var outputMessage = "For subscribe send me /start\nFor unsubscribe send /stop";
    var index = users.indexOf(chatId);
    if (inputMessage == "/start") {
        if (index < 0) {
            users.push(chatId);
            outputMessage = "You subscribed!\nFor unsubscribe send /stop";
        } else {
            outputMessage = "You already subscribed!\nFor unsubscribe send /stop";
        }
    } else if (inputMessage == "/stop") {
        if (index > -1) {
            users.splice(index, 1);
        }
        outputMessage = "You unsubscribed!"; 
    }
    bot.sendMessage(chatId, outputMessage, { caption: "Yep man!" });
});