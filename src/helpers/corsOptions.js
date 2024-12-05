const whiteList = ["http://localhost:3000","https://casval.org"];

const corsOptions = (req, callback) => {
  let corsOptions;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true};
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports = corsOptions;