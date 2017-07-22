// Grab API Keys...
var keys = require("./keys.js");

// Store user command and data...
var command = process.argv[2];
var data = process.argv.splice(3).join(" ");
console.log(data);

// Init twitter package
var twitter = require("twitter");

var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});
 
// Init spotify package
var Spotify = require("node-spotify-api");

var spotify = new Spotify({
  id: keys.spotifyKeys.consumer_key,
  secret: keys.spotifyKeys.consumer_secret
});

// Init request
var request = require("request");

// Init fs
var fs = require("fs");

// Do stuff on command
function executeCommand(command, data) {
    
    if (command === "my-tweets") {

        // Show your last 20 tweets and when they were created
        var params = {screen_name: 'ajschleic'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (error)
                return console.log(error)
            
            // Log tweets
            for (var i=0; i<tweets.length; i++) {
                console.log(params.screen_name + " [" + tweets[i].created_at + "]: " + tweets[i].text);
            }
        });

    } else if (command === "spotify-this-song") {

        // Look up song info in spotify if provided, else default to "The Sign" by Ace of Base
        if (!data)
            data = "The Sign Ace of Base";

        spotify.search({ type: 'track', query: data }, function(error, response) {
        if (error)
            return console.log(error);

        // Log results...
        console.log("\nSong Name: " + response.tracks.items[0].name);
        console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
        console.log("Album: " + response.tracks.items[0].album.name);
        if (response.tracks.items[0].preview_url) 
            console.log("Preview: " + response.tracks.items[0].preview_url + "\n");
        else
            console.log("Preview: No preview available\n");
        });
        
    } else if (command === "movie-this") {
    
        // Look up movie info in OMDb if provided, else default to "Mr. Nobody"
        if (!data)
            data = "Mr. Nobody";
        var queryURL = "http://www.omdbapi.com/?apikey=" + keys.omdbKeys.api_key + "&t=" + data;
        request(queryURL, function (error, response, body) {
            if (error)
                return console.log(error);
            
            var response = JSON.parse(body);
            // Log results
            console.log("\nTitle: " + response["Title"]);
            console.log("Release Year: " + response["Year"]);
            console.log("IMDB: " + response["Ratings"][0]["Value"]);
            console.log("Rotten Tomatoes: " + response["Ratings"][1]["Value"]);
            console.log("Filmed in: " + response["Country"]);
            console.log("Language: " + response["Language"]);
            console.log("Plot: " + response["Plot"]);
            console.log("Actors: " + response["Actors"] + "\n");
        });

    } else if (command === "do-what-it-says") {

        // Read text from random.txt file
        fs.readFile("./random.txt", "utf-8", function(error, data) {
            if (error)
                return console.log(error);

            var newCommand = data.split(",");
            executeCommand(newCommand[0], newCommand[1]);
        });
   } else {
        // Log the correct commands if an incorrect one is put in
       console.log("\nPlease enter a valid command.")
       console.log("1. my-tweets");
       console.log("2. spotify-this-song <query>");
       console.log("2. movie-this <query>");
       console.log("2. do-what-it-says\n");
   }
}

executeCommand(command, data);