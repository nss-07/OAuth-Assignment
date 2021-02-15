const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { client_id, redirect_uri, client_secret } = require("./config");

const config = require("./config");

const app = express();
var acc;
var page=-1;
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);
  data.append("redirect_uri", redirect_uri);

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
        acc = params.get("access_token");
      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then(async (response) => {
        console.log(`https://api.github.com/events`); //users/${response.login}/
        page=page+1;
        var events=await fetch(`https://api.github.com/users/${response.login}/events?page=${page}`,{headers: {
            Authorization: `token ${acc}`,}
          }).then(response=>response.json()).then((response)=>{
            console.log(response);
            return response
        })
        console.log({res:response,ev:events});
      return res.status(200).json({res:response,ev:events});
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.get("/", (req, res) => {
  res.end('app running');
})

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));