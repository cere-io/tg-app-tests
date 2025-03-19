import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";

export async function createDriver() {
  const userDataDir = path.join(
    path.resolve(),
    "user-data",
    Date.now().toString()
  );

  const options = new chrome.Options()
    .addArguments(`--user-data-dir=${userDataDir}`)
    .addArguments("--no-sandbox")
    .addArguments("--disable-dev-shm-usage");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}
