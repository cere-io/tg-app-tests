import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { path as chromedriverPath } from 'chromedriver';

console.log('Use chromedriver:', chromedriverPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sign up with new account', async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log('Create folder...');
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log('Set up ChromeOptions...');

    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--disable-blink-features=AutomationControlled');
    console.log('Launch WebDriver...');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('WebDriver launched!');
    } catch (error) {
      console.error('Failed to launch WebDriver:', error);
      console.error(error.stack);
      throw error;
    }
  });
  it('should log in using new account', async function () {
    this.timeout(20000);
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';
    await driver.get('https://stage.developer.console.cere.network/#/');

    await driver
      .findElement(By.css('input[placeholder="Enter your email"]'))
      .sendKeys(email);
    await driver.findElement(By.id(':r1:')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

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
    await driver.executeScript('arguments[0].click();', continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h6[contains(text(), 'Let’s get started!')]")
      ),
      60000
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//p[contains(text(), 'Top up your Cere Wallet and transfer tokens to your DDC account to keep your buckets running.')]"
        )
      ),
      60000
    );

    let nextStepButton = await driver.findElement(
      By.xpath("//button[@aria-label='Go to next step']")
    );
    await driver.executeScript('arguments[0].click();', nextStepButton);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//h6[contains(text(), 'Start with creation of your first bucket')]"
        )
      ),
      20000
    );

    let backStepButton = await driver.findElement(
      By.xpath("//button[@aria-label='Go to prev step']")
    );
    await driver.executeScript('arguments[0].click();', backStepButton);

    let accountButton = await driver.findElement(
      By.xpath("//p[contains(text(), 'Account')]")
    );
    await driver.executeScript('arguments[0].click();', accountButton);

    let topUpbutton = await driver.findElement(
      By.xpath("//a[contains(text(), 'Top Up')]")
    );
    await driver.executeScript('arguments[0].click();', topUpbutton);

    await driver.wait(
      until.elementLocated(
        By.xpath("//h4[contains(text(), 'Top up your account')]")
      ),
      60000
    );

    console.log('Test Sign up with new account passed');
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

describe('Sign in with an old account', async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log('Create folder...');
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log('Set up ChromeOptions...');

    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--disable-blink-features=AutomationControlled');
    console.log('Launch WebDriver...');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('WebDriver launched!');
    } catch (error) {
      console.error('Failed to launch WebDriver:', error);
      console.error(error.stack);
      throw error;
    }
  });
  it('should log in using an old account', async function () {
    this.timeout(60000);

    const email = `veronika.filipenko@cere.io`;
    const otp = '555555';
    await driver.get('https://stage.developer.console.cere.network/#/');

    await driver
      .findElement(By.css('input[placeholder="Enter your email"]'))
      .sendKeys(email);
    await driver.findElement(By.id(':r1:')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

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
    await driver.executeScript('arguments[0].click();', continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h3[contains(text(), 'Content Storage')]")
      ),
      40000
    );
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(), 'Create New Bucket')]")
      ),
      40000
    );
    await driver.wait(
      until.elementLocated(By.xpath("//h6[contains(text(), '226315')]")),
      100000
    );

    console.log('Test Sign in with an old account passed');
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

describe('Top up DDC account', async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log('Create folder...');
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log('Set up ChromeOptions...');

    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--disable-blink-features=AutomationControlled');
    console.log('Launch WebDriver...');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('WebDriver launched!');
    } catch (error) {
      console.error('Failed to launch WebDriver:', error);
      console.error(error.stack);
      throw error;
    }
  });
  it('should successfully top up account', async function () {
    this.timeout(60000);

    const email = `veronika.filipenko@cere.io`;
    const otp = '555555';
    await driver.get('https://stage.developer.console.cere.network/#/');

    await driver
      .findElement(By.css('input[placeholder="Enter your email"]'))
      .sendKeys(email);
    await driver.findElement(By.id(':r1:')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

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
    await driver.executeScript('arguments[0].click();', continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h3[contains(text(), 'Content Storage')]")
      ),
      40000
    );
    let accountButton = await driver.findElement(
      By.xpath("//p[contains(text(), 'Account')]")
    );
    await driver.executeScript('arguments[0].click();', accountButton);
    let topUpbutton = await driver.findElement(
      By.xpath("//a[contains(text(), 'Top Up')]")
    );
    await driver.executeScript('arguments[0].click();', topUpbutton);

    await driver.wait(
      until.elementLocated(
        By.xpath("//h4[contains(text(), 'Top up your account')]")
      ),
      60000
    );

    let amount = 2;
    await driver
      .findElement(By.css('input[placeholder="0.00"]'))
      .sendKeys(amount);
    await driver.findElement(By.id(':rr:')).click();

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[contains(text(), 'Congrats! You topped up your DDC Account with 2 tokens')]"
        )
      ),
      70000
    );

    console.log('Test Top up DDC account passed');
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

describe('Log in log out', async function () {
  let driver;
  let userDataDir;
  before(async function () {
    this.timeout(60000);
    console.log('Create folder...');
    userDataDir = path.join(__dirname, `chrome-profile-${Date.now()}`);
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log('Set up ChromeOptions...');

    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--disable-blink-features=AutomationControlled');
    console.log('Launch WebDriver...');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('WebDriver launched!');
    } catch (error) {
      console.error('Failed to launch WebDriver:', error);
      console.error(error.stack);
      throw error;
    }
  });
  it('should log in an log out', async function () {
    this.timeout(60000);

    const email = `veronika.filipenko@cere.io`;
    const otp = '555555';
    await driver.get('https://stage.developer.console.cere.network/#/');

    await driver
      .findElement(By.css('input[placeholder="Enter your email"]'))
      .sendKeys(email);
    await driver.findElement(By.id(':r1:')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
    driver.switchTo().frame(torusFrame);

    let embeddedFrame = await driver.wait(
      until.elementLocated(By.css('iframe[title="Embedded browser"]')),
      30000
    );
    driver.switchTo().frame(embeddedFrame);

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
    await driver.executeScript('arguments[0].click();', continueButton);

    await driver.switchTo().defaultContent();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h3[contains(text(), 'Content Storage')]")
      ),
      40000
    );
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(), 'Create New Bucket')]")
      ),
      40000
    );

    let accountButton = await driver.findElement(
      By.xpath("//p[contains(text(), 'Account')]")
    );
    await driver.executeScript('arguments[0].click();', accountButton);

    let logOutButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Log Out')]")
    );
    await driver.executeScript('arguments[0].click();', logOutButton);

    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Welcome to ')]")),
      40000
    );

    console.log('Test Log in log out passed');
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
