const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

module.exports = {
  URIS: process.env.URIS,
  PORT: process.env.PORT,
};
