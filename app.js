/// require state
const express = require('express');
const app = express();
const request = require('request');
require('dotenv').config();
const axios = require('axios')

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

console.log(`${process.env.LIST_ID_MC} :token: ${process.env.API_KEY_MC}`);


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

//
// try{
//   if (!process.env.API_KEY_MC){
//     throw new Error (`You forgot to set the API KEY`);}
//   };//end of try
//   catch(err){next(err);};

  /// mailchimp
mailchimp.setConfig({
  apiKey: process.env.API_KEY_MC,
  server: "us11"
});

const listId = process.env.LIST_ID_MC;
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
