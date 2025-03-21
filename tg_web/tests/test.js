import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Open active quests screen", async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log("Create folder...");
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log("Set up ChromeOptions...");

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    console.log("Launch WebDriver...");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .addArguments("--verbose")
          .addArguments("--log-path=chromedriver.log")
      )
      .build();
    console.log("WebDriver launched!");
  });

  it("should show active quests screen", async function () {
    this.timeout(20000);
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";

    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=120"
    );

    await driver.wait(until.elementLocated(By.className("hero-title")), 10000);
    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

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
        By.xpath("//button[contains(text(), 'Create a new wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'Create a new wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign Up')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign Up')]")
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

    let continueButton = await driver.findElement(
      By.xpath("//button[contains(@class, 'MuiButtonBase-root')]")
    );
    await driver.executeScript("arguments[0].click();", continueButton);
    console.log("clicked");
    await driver.switchTo().defaultContent();

    await driver.wait(until.elementLocated(By.className("t1uqjrzu")), 10000);
    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    await driver.wait(
      until.elementLocated(By.className("tgui-e6658d0b8927f95e")),
      10000
    );
    const questTab = await driver
      .findElement(By.className("tgui-e6658d0b8927f95e"))
      .getText();
    expect(questTab).to.equal("Active Quests");
  });

  after(async function () {
    await driver.quit();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});

describe("Answer on quiz questions", async function () {
  let driver;
  let userDataDir;
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
  it("should answer on quiz questions", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=120"
    );

    await driver.wait(until.elementLocated(By.className("hero-title")), 10000);
    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

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
        By.xpath("//button[contains(text(), 'Create a new wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'Create a new wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign Up')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign Up')]")
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

    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    const questTab = await driver
      .findElement(By.className("tgui-e6658d0b8927f95e"))
      .getText();
    expect(questTab).to.equal("Active Quests");

    const quizTitle = await driver
      .findElement(
        By.xpath("/html/body/div/main/div/div[2]/div/div[5]/div/div/div[1]/h2")
      )
      .getText();
    expect(quizTitle).to.equal("Crypto Knowledge Check");
  });

  after(async function () {
    await driver.quit();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});

describe("Open leaderboard screen", async function () {
  let driver;
  let userDataDir;
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
  it("should show leaderboard screen", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=120"
    );

    await driver.wait(until.elementLocated(By.className("hero-title")), 10000);
    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

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
        By.xpath("//button[contains(text(), 'Create a new wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'Create a new wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign Up')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign Up')]")
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

    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    await driver
      .findElement(By.xpath("/html/body/div[1]/div/div/div[2]/button[2]"))
      .click();

    const leaderboardTab = await driver
      .findElement(By.className("tgui-e6658d0b8927f95e"))
      .getText();
    expect(leaderboardTab).to.equal("Leaderboard");

    const leaderboardTitle = await driver
      .findElement(By.className("jss1"))
      .getText();
    expect(leaderboardTitle).to.equal("Leaderboard");

    await driver.findElement(By.className("l1shii3t")).click();

    const leaderboardResult = await driver
      .findElement(By.className("p1kqqlhg"))
      .getText();
    expect(leaderboardResult).to.equal(
      "1 out of 3 tasks completed – Could do better"
    );
  });
  after(async function () {
    await driver.quit();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});

describe("Open library screen", async function () {
  let driver;
  let userDataDir;
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
  it("should show library screen", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=120"
    );

    await driver.wait(until.elementLocated(By.className("hero-title")), 10000);
    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

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
        By.xpath("//button[contains(text(), 'Create a new wallet')]")
      ),
      10000
    );
    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'Create a new wallet')]")
    );
    await buttonLogin.click();

    await driver.wait(until.elementLocated(By.name("email")), 20000);
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign Up')]")),
      20000
    );
    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign Up')]")
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

    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    await driver
      .findElement(By.xpath("/html/body/div[1]/div/div/div[2]/button[3]"))
      .click();

    const libraryTitle = await driver
      .findElement(By.className("tgui-72c2a480384c4fb1"))
      .getText();
    expect(libraryTitle).to.equal("Library");
  });
  after(async function () {
    await driver.quit();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      console.log(`Deleted Chrome profile: ${userDataDir}`);
    }
  });
});
