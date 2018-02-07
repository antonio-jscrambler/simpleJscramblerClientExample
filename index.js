// Lib for  http calls
var request = require('request');
// Jscrambler code to produce the signature and the payload
var gsp = require("./generate-signed-params");

// Params for generate-signed-params
var method = "POST";
var path = "/application";
var host = "api4.jscrambler.com";
var keys = {
	"accessKey":"CHANGE_ME",
	"secretKey":"CHANGE_ME"
}; 
// GraphQL params and query to create an APP.
var graphiQuery = {
  params:{
    data:{
      name:"Hello world",
      //languageSpecifications: {es6:true}, // optional
      //parameters: [{ "name": "stringSplitting", "status": 1 }] // optional
    }
  },
  query:`mutation createApplication ($data: ApplicationCreate!) {
    createApplication (data: $data) {
      _id, createdAt, name, parameters
    }
  }`
};
var mySignedParams = gsp(method, path, host, keys, graphiQuery); // build signature from params 

// Simple POST to API
request({
    url: "https://"+host+path,
    method: "POST",
    headers: {
    'jscramblerVersion': '5.2' // if omitted will pick the stable version
    },
    json: true,   // <-- important! Make sure body will be send as JSON
    body: mySignedParams
}, function (error, response, body){
    // print response body or error
    if(error) {
      console.log("error:",error);
      return;
    } 
    console.log("body result:",JSON.stringify(body));
});