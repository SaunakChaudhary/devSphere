const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const bcryptedPassword = async (password, hashedPsw) => {
  return bcrypt.compare(password, hashedPsw);
};

const getToken = async (email, id) => {
  return await jwt.sign(
    {
      email: email,
      id: id,
    },
    process.env.JWT_Token,
    { expiresIn: "24h" }
  );
};


module.exports = { hashedPassword, bcryptedPassword , getToken};
