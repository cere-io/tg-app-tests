import { expect } from "chai";
import { Builder, By } from "selenium-webdriver";
import "chromedriver";

describe("Download csv file for existing campaign", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should download csv file", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otpCode = "555555";
    await driver.get(
      "https://cdn.ddcdragon.com/81/leaderboard-downloader-stage/"
    );

    await driver.findElement(By.css("button")).click();
    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.id(":r5:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otpCode);
    await driver.findElement(By.id(":r7:")).click();
    await driver.findElement(By.id(":r8:")).click();

    const welcomeMessage = await driver.findElement(By.css("h4")).getText();
    expect(welcomeMessage).to.equal("Please, enter campaign id");

    const campaignId = "105";
    await driver.findElement(By.css("input")).sendKeys(campaignId);

    let downloadButton = await driver.findElement(By.css("button"));
    downloadButton.click();

    const fs = require("fs");
    const path = require("path");

    let downloadDir = "C://Users//Dzmit//Downloads";
    let expectedFileName = "leaderboard_105.csv";

    let filePath = path.join(downloadDir, expectedFileName);
    while (!fs.existsSync(filePath)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("File was downloaded!");
  });
  after(async function () {
    await driver.quit();
  });
});
