import { Builder } from "selenium-webdriver";
import path from "path";

export async function createDriver() {
  const userDataDir = path.join(
    process.cwd(),
    "user-data",
    Date.now().toString()
  );

  return await new Builder().forBrowser("chrome").build();
}
