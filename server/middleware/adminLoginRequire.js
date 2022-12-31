const jwt = require("jsonwebtoken");
const db = require("../database");
const { JWT_SECREAT_KEY } = require("../keys");

const adminLoginRequire = (req, res, next) => {

    const { authorization } = req.headers;

    // console.log(authorization);

    if(!authorization)
    {
        return res.status(401).json({ error: "authorization failed !! please log in !" });
    }
    else{
        // authorization = Bearer (SECREAT KEY)
        const token = authorization.replace("Bearer ", "");

        jwt.verify(token, JWT_SECREAT_KEY, (err, payload) => {
            if(err)
            {
                return res.status(401).json({ error: "You must be logged in" })
            }
            else{
                // console.log(payload);
                const { idadmin, iat } = payload;
                db.query("SELECT * FROM admin WHERE idadmin = ?", [idadmin], (err, userdata) => {
                    if(err)
                    {
                        return console.log(err);
                    }
                    else{
                        req.user = userdata;
                        next();
                    }
                });
                // Admin.findById(_id)
                // .then((userdata) => {
                //     req.user = userdata;
                //     next();
                // })
                // .catch((err) => {
                //     console.log(err);
                // });
            }
        });
    }
};

module.exports = adminLoginRequire;