let express = require("express");

let app = express();
let devPort = 8080;

app.use("/", express.static("dist"));
app.listen(devPort, () => console.log("Listening on port " + devPort));
