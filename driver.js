const { remote } = require("webdriverio");
const path = require("path");

async function createDriver() {
  const userDataDir = path.join(__dirname, "user-data", Date.now().toString());

  const options = {
    capabilities: {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [`--user-data-dir=${userDataDir}`, "--no-sandbox"],
      },
    },
  };

  return await remote(options);
}

module.exports = { createDriver };
