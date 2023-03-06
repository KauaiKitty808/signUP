/// require state
const express = require('express');
const app = express();
const request = require('request');

const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true});

app.use(bodyParser.urlencoded({extended: true}));
// needed to parse code like from an api
app.use(express.static("public"));
// make a folder static so we can access images and files

const https = require('node:https');

const port=3000;

const mailchimp = require("@mailchimp/mailchimp_marketing");
// const client = require("@mailchimp/mailchimp_marketing");

const apiKey='1456b5ac8ff20d5b66f6ec3b7636550c-us11'


  /// Root Page /

app.get ('/',(req, res) => {
  res.sendFile(__dirname + '/signup.html');
})

app.post ('/',(req, res) => {
  console.log( req.body.name + req.body.email );
  const name = req.body.name;
  const email = req.body.email;
  const chkbx = req.body.chkbx;

  console.log( `aloha ${name} your email is ${email} and you over 18? ${chkbx}`);

/// mailchimp
mailchimp.setConfig({
  apiKey: "1456b5ac8ff20d5b66f6ec3b7636550c-us11",
  server: "us11"
});

const listId = "6bd600877f";
const subscribingUser = {
  firstName: name,
  email: email,
  over18: chkbx
};

async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      OVER18: subscribingUser.over18
    }
  });
   console.log(response.status +" and " +response.statusCode);

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${response.id}.`);

    var codee = response.status;

  if (response.status == 'subscribed') {
    res.sendFile(__dirname + "/success.html")
  } else {
      res.sendFile(__dirname + "/failure.html")
    }

    // run.on("data", (data) => {
    // console.log(JSON.parse(Data) + "<-- HERE IT SHOULD BE");
    // });




} //end async function

run(); /////Mailchimp end

// const run2 = async () => {
//   const response = await mailchimp.root.getRoot();
//   console.log(response);
//   res.write(`hello`);
//   res.send(`Should be it`);
// };
//
//  works except the write part
// run2();

}) /// end of app.post
app.get('/success', (req, res) => {
  res.sendFile(__dirname + "/success.html")
});

app.get('/failure', (req, res) => {
  res.sendFile(__dirname + "/failure.html")
});

  /// Listinging spinning the servers

app.listen(port,()=>{
  console.log(`Server Listing on ${port}`);
  console.log(`http://localhost:${port}`);
})
