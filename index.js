// index.js
// where your node app starts
// init project
var express = require('express');
var app = express();

app.set('trust proxy', true);


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", function (req, res) {
  const dateParam = req.params.date;

  // No date provided — return current time
  if (!dateParam) {
    const now = new Date();
    return res.json({
      unix: now.getTime(),
      utc: now.toUTCString()
    });
  }

  let date;

  // Check if it's a valid UNIX timestamp (e.g. 1451001600000)
  if (!isNaN(dateParam) && /^\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});


app.get("/api/whoami", function (req, res) {
  let ip = req.header('x-forwarded-for') || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  if (ip && ip.indexOf(',') > -1) {
    ip = ip.slice(0, ip.indexOf(','));
  }

  let lang = req.header('accept-language');
  let sysInfo = req.get('user-agent');

  res.json({
    ipaddress: ip,
    language: lang,
    software: sysInfo
  });
});




// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});