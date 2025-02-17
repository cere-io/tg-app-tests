import { expect } from "chai";
import { Builder, By } from "selenium-webdriver";
import "chromedriver";

describe("Open active quests screen", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show active quests screen", async function () {
    this.timeout(20000);
    const userName = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=114"
    );

    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(otp);
  });
  after(async function () {
    await driver.quit();
  });
});
