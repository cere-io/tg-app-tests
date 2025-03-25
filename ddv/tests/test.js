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

describe("Load data", function () {
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

  it("should show data using app public key", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otp = "555555";
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();

    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    await driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    await driver.switchTo().frame(embeddedFrame);

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
    await driver.executeScript("arguments[0].scrollIntoView();", verifyButton);
    await driver.wait(until.elementIsVisible(verifyButton), 10000);
    await verifyButton.click();

    await driver.switchTo().defaultContent();

    await driver.wait(until.elementLocated(By.className("smmmuj9")), 20000);
    const welcomeMessage = await driver
      .findElement(By.className("smmmuj9"))
      .getText();
    expect(welcomeMessage).to.equal(`Welcome, ${email}`);

    const appKey = "2106";
    await driver.findElement(By.name("appPubKey")).sendKeys(appKey);
    await driver.findElement(By.className("b4qcjlq")).click();

    await driver.wait(until.elementLocated(By.className("b138ry0w")), 200000);
    await driver.findElement(By.className("b138ry0w")).click();
    console.log("Test Load data passed");
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

describe("Load data negative case", async function () {
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
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();

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
    await driver.executeScript("arguments[0].scrollIntoView();", verifyButton);
    await driver.wait(until.elementIsVisible(verifyButton), 10000);
    await verifyButton.click();

    await driver.switchTo().defaultContent();

    await driver.wait(until.elementLocated(By.className("smmmuj9")), 20000);
    const welcomeMessage = await driver
      .findElement(By.className("smmmuj9"))
      .getText();
    expect(welcomeMessage).to.equal(`Welcome, ${email}`);

    const appKey = "0000";
    await driver.findElement(By.name("appPubKey")).sendKeys(appKey);
    await driver.findElement(By.className("b4qcjlq")).click();

    const errorLocator = By.className("text-red-300");
    await driver.wait(until.elementLocated(errorLocator), 10000);
    let errorElement = await driver.findElement(errorLocator);

    await driver.wait(
      async function () {
        const text = await errorElement.getText();
        return text.length > 0;
      },
      5000,
      "Error message did not load in time"
    );

    let errorMessage = await errorElement.getText();
    console.log("Found error message:", errorMessage);

    expect(errorMessage).to.include(
      "The request of loading data has failed, or no data found in the DDC"
    );
    console.log("Test Load data negative case passed");
  });
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
