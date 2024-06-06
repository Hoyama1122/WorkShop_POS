const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use(require("./controllers/PackageController")); // Ensure these paths are correct
app.use(require("./controllers/MemberController"));
app.use(require('./controllers/ProductController'));
app.use(require('./controllers/ProductImageController'));
app.use(require('./controllers/UserController'))
app.use(require('./controllers/BillSaleController'))

app.listen(port, () => {
  console.log(`Example app listening on port `, port);
});