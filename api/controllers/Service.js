module.exports = {
  getToken: (req) => {
    return req.headers.authorization.split(" ")[1]
  },
  isLogin: (req, res, next) => {
    require("dotenv").config();
    const jwt = require("jsonwebtoken");

    if (req.headers.authorization != null) {
      const token = req.headers.authorization.split(" ")[1]
      const secret = process.env.secret;
      try {
        const verify = jwt.verify(token, secret);
        if (verify != null) {
          return next();
        }
      } catch (e) {
        res.ststus(401).send("Error");
      }
    }
  },
  getMemberId: (req) => {
    const jwt = require("jsonwebtoken");
    const token = req.headers.authorization.split(" ")[1]
    const payload = jwt.decode(token);
    return payload.id;
  },
};
