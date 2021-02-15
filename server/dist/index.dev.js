"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var FormData = require("form-data");

var fetch = require("node-fetch");

var _require = require("./config"),
    client_id = _require.client_id,
    redirect_uri = _require.redirect_uri,
    client_secret = _require.client_secret;

var config = require("./config");

var app = express();
var acc;
var page = -1;
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: "text/*"
}));
app.use(bodyParser.urlencoded({
  extended: false
})); // Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.post("/authenticate", function (req, res) {
  var code = req.body.code;
  var data = new FormData();
  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);
  data.append("redirect_uri", redirect_uri); // Request to exchange code for an access token

  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (paramsString) {
    var params = new URLSearchParams(paramsString);
    var access_token = params.get("access_token");
    acc = params.get("access_token"); // Request to return data of a user that has been authenticated

    return fetch("https://api.github.com/user", {
      headers: {
        Authorization: "token ".concat(access_token)
      }
    });
  }).then(function (response) {
    return response.json();
  }).then(function _callee(response) {
    var events;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("https://api.github.com/events"); //users/${response.login}/

            page = page + 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(fetch("https://api.github.com/events?page=".concat(page), {
              headers: {
                Authorization: "token ".concat(acc)
              }
            }).then(function (response) {
              return response.json();
            }).then(function (response) {
              console.log(response);
              return response;
            }));

          case 4:
            events = _context.sent;
            console.log({
              res: response,
              ev: events
            });
            return _context.abrupt("return", res.status(200).json({
              res: response,
              ev: events
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  })["catch"](function (error) {
    return res.status(400).json(error);
  });
});
app.get("/", function (req, res) {
  res.end('app running');
});
var PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});