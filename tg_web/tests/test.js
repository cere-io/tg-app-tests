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

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otp);
    await driver.findElement(By.id(":r3:")).click();

    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    const questTab = await driver
      .findElement(By.className("tgui-e6658d0b8927f95e"))
      .getText();
    expect(questTab).to.equal("Active Quests");
  });
  after(async function () {
    await driver.quit();
  });
});
