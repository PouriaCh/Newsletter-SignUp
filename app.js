const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();
const portNumber = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //static folder for static files

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  // REPLACE WITH YOUR OWN mailchimp ACCOUNT INFO
  const apiKey = ""; //from mailchimp
  const listID = ""; //from mailchimp audience section
  //////////////////////////////////////////////////////////////////////

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;

  const data = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/" + listID;
  const options = {
    method: "POST",
    // update this field
    auth: "pouria:" + apiKey
  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

    })
  });
    request.write(jsonData);
    request.end();
});

// post request for /failure route

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || portNumber , function() {
  console.log("server is running on port " + portNumber + ".");
});
