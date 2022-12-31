const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database");
const jwt = require("jsonwebtoken");
const { JWT_SECREAT_KEY } = require("../keys");
const transporter = require("../SendEmail");

router.get("/verify", (req, res) => {
  let verificationToken = req.query?.token;
  if (verificationToken) {
    db.query(
      "UPDATE users SET is_verified=1 WHERE password=?;",
      [verificationToken],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({ msg: "email address verified!!" });
        }
      }
    );
  }
});

router.post("/register", (req, res) => {
  const {
    firstname: first_name,
    lastname: last_name,
    email,
    password,
  } = req.body;
  const is_admin = req.body?.role === "Admin" ? 1 : 0;
  if (!email || !first_name || !last_name || !password) {
    return res.status(422).json({ error: "please fill all field" });
  } else {
    // res.json({msg: "Successful posted !!"});

    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return console.log(err);
        }
        if (result.length > 0) {
          return res.status(422).json({ error: "Email id already exist" });
        } else {
          let hashedpassword = await bcrypt.hash(password, 11);

          // console.log(hashedpassword);
          db.query(
            "INSERT INTO users (first_name, last_name, email, password, is_admin ) values (?,?,?,?,?)",
            [first_name, last_name, email, hashedpassword, is_admin],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const mailOptions = {
                  from: transporter.options.auth.user,
                  to: email,
                  subject: "confirm your email address",
                  html: `<div></div><h2>confirm your email address</h2><a href="http://localhost:5000/verify?token=${hashedpassword}">http://localhost:5000/verify?token=${hashedpassword}</a></div>`,
                };
                transporter.sendMail(mailOptions, function (err, res) {
                  if (err) {
                    console.error("there was an error: ", err);
                  } else {
                    console.log("here is the res: ", res);
                  }
                });

                return res
                  .status(200)
                  .json({ msg: "Verify your email address !!" });
              }
            }
          );
        }
      }
    );
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "please fill all fields" });
  } else {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          return console.log(err);
        } else {
          if (result.length <= 0) {
            return res
              .status(422)
              .json({ emailerror: "Invalid username or password" });
          } else {
            db.query(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  if (result[0].is_verified === 0)
                    res.status(401).json({
                      msg: "please verify you email address from inbox",
                    });
                  else if (result[0].is_admin === 0)
                    res
                      .status(401)
                      .json({ msg: "You are not allowed to login from here" });
                  else {
                    bcrypt
                      .compare(password, result[0].password)
                      .then((doMatch) => {
                        if (doMatch) {
                          const token = jwt.sign(
                            { is_admin: result[0].is_admin },
                            JWT_SECREAT_KEY
                          );
                          const { is_admin, first_name, last_name, email } =
                            result[0];

                          res.status(200).json({
                            token,
                            user: { is_admin, first_name, last_name, email },
                          });
                          // return res.status(200).json({ msg: "Login Successful !!" });
                        } else {
                          return res
                            .status(422)
                            .json({ error: "Invalid Username or Password" });
                        }
                      });
                  }
                }
              }
            );
          }
        }
      }
    );
  }
});

module.exports = router;
