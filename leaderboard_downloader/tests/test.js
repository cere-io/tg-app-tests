import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Download csv file for existing campaign", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    const userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });
  it("should download csv file", async function () {
    this.timeout(20000);
    const userName = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get(
      "https://cdn.ddcdragon.com/81/leaderboard-downloader-stage/"
    );

    await driver.findElement(By.css("button")).click();
    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);
    console.log("opened 1 iframe");

    let embeddedFrame = await driver.findElement(
      By.css('iframe[title="Embedded browser"]', 30000)
    );
    driver.switchTo().frame(embeddedFrame);
    console.log("opened 2 iframe");

    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", buttonLogin);
    await driver.wait(until.elementIsVisible(buttonLogin), 10000);
    await buttonLogin.click();

    let emailInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='Email']")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", emailInput);
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys(userName);

    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", signInButton);
    await driver.wait(until.elementIsVisible(signInButton), 10000);
    await signInButton.click();

    let otpInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='OTP input']")
    );
    await driver.wait(until.elementIsVisible(otpInput), 10000);
    await otpInput.sendKeys(otp);

    let verifyButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Verify')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", verifyButton);
    await driver.wait(until.elementIsVisible(verifyButton), 10000);
    await verifyButton.click();

    await driver.switchTo().defaultContent();

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

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});

describe("Download csv file for NOT existing campaign", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    const userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });
  it("should show an error", async function () {
    this.timeout(20000);
    const userName = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get(
      "https://cdn.ddcdragon.com/81/leaderboard-downloader-stage/"
    );

    await driver.findElement(By.css("button")).click();
    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);
    console.log("opened 1 iframe");

    let embeddedFrame = await driver.findElement(
      By.css('iframe[title="Embedded browser"]', 30000)
    );
    driver.switchTo().frame(embeddedFrame);
    console.log("opened 2 iframe");

    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", buttonLogin);
    await driver.wait(until.elementIsVisible(buttonLogin), 10000);
    await buttonLogin.click();

    let emailInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='Email']")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", emailInput);
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys(userName);

    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", signInButton);
    await driver.wait(until.elementIsVisible(signInButton), 10000);
    await signInButton.click();

    let otpInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='OTP input']")
    );
    await driver.wait(until.elementIsVisible(otpInput), 10000);
    await otpInput.sendKeys(otp);

    let verifyButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Verify')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", verifyButton);
    await driver.wait(until.elementIsVisible(verifyButton), 10000);
    await verifyButton.click();

    await driver.switchTo().defaultContent();

    const welcomeMessage = await driver.findElement(By.css("h4")).getText();
    expect(welcomeMessage).to.equal("Please, enter campaign id");

    const campaignId = "105";
    await driver.findElement(By.css("input")).sendKeys(campaignId);

    let downloadButton = await driver.findElement(By.css("button"));
    downloadButton.click();

    const errorMessage = await driver
      .findElement(By.className("error_text"))
      .getText();
    expect(errorMessage).to.equal("Please, enter valid campaign id");
  });
  after(async function () {
    await driver.quit();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});
