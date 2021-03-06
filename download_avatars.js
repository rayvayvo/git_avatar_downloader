var request = require('request');
var fs = require('fs');
var GITHUB_USER = "rayvayvo";
var GITHUB_TOKEN = "429ecee99249ff0283a5659df205e8ccc3c2864b";

console.log('Welcome to the GitHub Avatar Downloader!');

//function that pulls up a list of contributors, pulls out the first 3 keys of each object,
//the third being a URL, and downloads all the images from the  URLs
function downloadAvatars(repoOwner, repoName, cb) {

    var requestURL = 'https://' + GITHUB_USER + ":" + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

    var options = {
      url: requestURL,
      headers: {
        'User-Agent': "GitHub Avatar Downloader"
      }
    };

    request.get(options, function(error, response, body) {

      if (error) {
        console.log('error, error. danger will robinson!');

      } else {
          var info = JSON.parse(response.body);
          console.log('Response status code: ', response.statusCode);

          for (let avatarURL in info) {
            request.get(info[avatarURL].avatar_url)
            .pipe(fs.createWriteStream(`./downloaded/${info[avatarURL].login}.png`));
          }
      }

    });
};

//check if there's input, if not return error, if so, run the downloading function.
if (!process.argv[2] || !process.argv[3]) {
  console.log("Not enough info. please retry with: <owner> <repo> ")
} else {
  downloadAvatars(process.argv[2], process.argv[3], function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
  });
};


