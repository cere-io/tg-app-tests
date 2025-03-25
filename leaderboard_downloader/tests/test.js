import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { path as chromedriverPath } from "chromedriver";

console.log("Use chromedriver:", chromedriverPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Download csv file for existing campaign", async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log("Create folder...");
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log("Set up ChromeOptions...");

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--remote-debugging-port=9222");
    options.addArguments("--disable-blink-features=AutomationControlled");
    console.log("Launch WebDriver...");

    try {
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
      console.log("WebDriver launched!");
    } catch (error) {
      console.error("Failed to launch WebDriver:", error);
      console.error(error.stack);
      throw error;
    }
  });
  it("should download csv file", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get(
      "https://cdn.ddcdragon.com/81/leaderboard-downloader-stage/"
    );

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

    await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(), 'I already have a wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await signInButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@aria-label='OTP input']")),
      20000
    );
    let otpInput = await driver.findElement(
      By.xpath("//input[@aria-label='OTP input']")
    );
    await driver.wait(until.elementIsVisible(otpInput), 10000);
    await otpInput.sendKeys(otp);

    let verifyButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Verify')]")
    );
    await verifyButton.click();

    this.timeout(60000);
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Continue')]")),
      60000
    );
    let continueButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Continue')]")
    );
    await driver.executeScript("arguments[0].click();", continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h4[contains(text(), 'Please, enter campaign id')]")
      ),
      60000
    );
    const campaignId = "120";
    await driver.findElement(By.css("input")).sendKeys(campaignId);

    let downloadButton = await driver.findElement(By.css("button"));
    downloadButton.click();

    console.log("Test Download csv file for existing campaign passed");
  });
  after(async function () {
    await driver.quit();

    setTimeout(() => {
      if (fs.existsSync(userDataDir)) {
        fs.rmSync(userDataDir, { recursive: true, force: true });
        console.log(`Deleted Chrome profile: ${userDataDir}`);
      }
    }, 5000);
  });
});

describe("Download csv file for NOT existing campaign", async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log("Create folder...");
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log("Set up ChromeOptions...");

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--remote-debugging-port=9222");
    options.addArguments("--disable-blink-features=AutomationControlled");
    console.log("Launch WebDriver...");

    try {
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
      console.log("WebDriver launched!");
    } catch (error) {
      console.error("Failed to launch WebDriver:", error);
      console.error(error.stack);
      throw error;
    }
  });
  it("should show an error", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get(
      "https://cdn.ddcdragon.com/81/leaderboard-downloader-stage/"
    );

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

    await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(), 'I already have a wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await signInButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@aria-label='OTP input']")),
      20000
    );
    let otpInput = await driver.findElement(
      By.xpath("//input[@aria-label='OTP input']")
    );
    await driver.wait(until.elementIsVisible(otpInput), 10000);
    await otpInput.sendKeys(otp);

    let verifyButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Verify')]")
    );
    await verifyButton.click();

    this.timeout(60000);
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Continue')]")),
      60000
    );
    let continueButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Continue')]")
    );
    await driver.executeScript("arguments[0].click();", continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h4[contains(text(), 'Please, enter campaign id')]")
      ),
      60000
    );

    const campaignId = "0";
    await driver.findElement(By.css("input")).sendKeys(campaignId);

    let downloadButton = await driver.findElement(By.css("button"));
    downloadButton.click();

    const errorMessage = await driver
      .findElement(By.className("error_text"))
      .getText();
    expect(errorMessage).to.equal("Please, enter valid campaign id");
    console.log("Test Download csv file for NOT existing campaign passed");
  });
  after(async function () {
    await driver.quit();

    setTimeout(() => {
      if (fs.existsSync(userDataDir)) {
        fs.rmSync(userDataDir, { recursive: true, force: true });
        console.log(`Deleted Chrome profile: ${userDataDir}`);
      }
    }, 5000);
  });
});
