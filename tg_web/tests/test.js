import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { path as chromedriverPath } from 'chromedriver';

console.log('Use chromedriver:', chromedriverPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Open active quests screen', async function () {
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
  it('should show active quests screen', async function () {
    this.timeout(20000);
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';

    await driver.get(
      'https://telegram-viewer-app.stage.cere.io/?campaignId=120'
    );

    await driver.wait(until.elementLocated(By.className('hero-title')), 10000);
    const welcomeTitle = await driver
      .findElement(By.className('hero-title'))
      .getText();
    expect(welcomeTitle).to.equal('Sit back, Enjoy, and Earn!');

    await driver.findElement(By.className('tgui-bca5056bf34297b0')).click();
    await driver.findElement(By.className('welcom-cta-text')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
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

    await driver.wait(until.elementLocated(By.name('email')), 20000);
    const emailInput = await driver.findElement(By.name('email'));
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
      until.elementLocated(By.xpath("//span[text()='Active Quests']")),
      10000
    );

    let activeQuestsIframe = await driver.findElement(
      By.xpath("//iframe[@title='Active Quests']")
    );
    driver.switchTo().frame(activeQuestsIframe);

    await driver.wait(
      until.elementLocated(By.xpath("//h1[text()='Complete Quests to Earn!']")),
      10000
    );

    console.log('Test Open active quests screen passed');
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

describe('Answer on quiz questions', async function () {
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
  it('should answer on quiz questions', async function () {
    this.timeout(60000);
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';
    await driver.get(
      'https://telegram-viewer-app.stage.cere.io/?campaignId=120'
    );

    await driver.wait(until.elementLocated(By.className('hero-title')), 10000);
    const welcomeTitle = await driver
      .findElement(By.className('hero-title'))
      .getText();
    expect(welcomeTitle).to.equal('Sit back, Enjoy, and Earn!');

    await driver.findElement(By.className('tgui-bca5056bf34297b0')).click();
    await driver.findElement(By.className('welcom-cta-text')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
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

    await driver.wait(until.elementLocated(By.name('email')), 20000);
    const emailInput = await driver.findElement(By.name('email'));
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
    await driver.executeScript('arguments[0].scrollIntoView();', verifyButton);
    await driver.wait(until.elementIsVisible(verifyButton), 10000);
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
      until.elementLocated(By.xpath("//span[text()='Active Quests']")),
      10000
    );

    let activeQuestsIframe = await driver.findElement(
      By.xpath("//iframe[@title='Active Quests']")
    );
    driver.switchTo().frame(activeQuestsIframe);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[@id='active_quests_v2']//h2[text()='Crypto Knowledge Check']"
        )
      ),
      10000
    );

    console.log('Test Answer on quiz questions passed');
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

describe('Open leaderboard screen', async function () {
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

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log('WebDriver launched!');
  });
  it('should show leaderboard screen', async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';
    await driver.get(
      'https://telegram-viewer-app.stage.cere.io/?campaignId=120'
    );

    this.timeout(60000);
    await driver.wait(until.elementLocated(By.className('hero-title')), 10000);
    const welcomeTitle = await driver
      .findElement(By.className('hero-title'))
      .getText();
    expect(welcomeTitle).to.equal('Sit back, Enjoy, and Earn!');

    await driver.findElement(By.className('tgui-bca5056bf34297b0')).click();
    await driver.findElement(By.className('welcom-cta-text')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
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

    await driver.wait(until.elementLocated(By.name('email')), 20000);
    const emailInput = await driver.findElement(By.name('email'));
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

    let leaderboard = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Leaderboard']")),
      10000
    );
    await leaderboard.click();

    await driver.wait(
      until.elementLocated(By.xpath("//iframe[@title='Leaderboard']")),
      60000
    );
    let leaderboardIframe = await driver.findElement(
      By.xpath("//iframe[@title='Leaderboard']")
    );
    driver.switchTo().frame(leaderboardIframe);

    await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Place')]")),
      60000
    );

    await driver.findElement(By.xpath("//div[contains(text(), 'Users')]"));

    await driver.findElement(By.xpath("//div[contains(text(), 'Points')]"));

    let profileIcon = await driver.findElement(By.className('ug3n9qx'));
    profileIcon.click();

    await driver.wait(until.elementLocated(By.className('t1bxs9xw')), 60000);
    const resultsText = await driver.findElement(By.className('p1kqqlhg'));
    await driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      resultsText
    );

    console.log('Test Open leaderboard screen passed');
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

describe('Open library screen', async function () {
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

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log('WebDriver launched!');
  });
  it('should show library screen', async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';
    await driver.get(
      'https://telegram-viewer-app.stage.cere.io/?campaignId=120'
    );

    this.timeout(60000);
    await driver.wait(until.elementLocated(By.className('hero-title')), 10000);
    const welcomeTitle = await driver
      .findElement(By.className('hero-title'))
      .getText();
    expect(welcomeTitle).to.equal('Sit back, Enjoy, and Earn!');

    await driver.findElement(By.className('tgui-bca5056bf34297b0')).click();
    await driver.findElement(By.className('welcom-cta-text')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
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

    await driver.wait(until.elementLocated(By.name('email')), 20000);
    const emailInput = await driver.findElement(By.name('email'));
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

    let library = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Library']")),
      10000
    );
    await library.click();

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[text()='Explore our growing collection of community videos and earn rewards for watching! Each video watched brings you closer to unlocking exclusive prizes!']"
        )
      ),
      10000
    );

    console.log('Test Open library screen passed');
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

describe('Open video', async function () {
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

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log('WebDriver launched!');
  });
  it('should show video', async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const email = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = '555555';
    await driver.get(
      'https://telegram-viewer-app.stage.cere.io/?campaignId=120'
    );

    this.timeout(60000);
    await driver.wait(until.elementLocated(By.className('hero-title')), 10000);
    const welcomeTitle = await driver
      .findElement(By.className('hero-title'))
      .getText();
    expect(welcomeTitle).to.equal('Sit back, Enjoy, and Earn!');

    await driver.findElement(By.className('tgui-bca5056bf34297b0')).click();
    await driver.findElement(By.className('welcom-cta-text')).click();

    await driver.wait(until.elementLocated(By.id('torusIframe')), 30000);
    let torusFrame = await driver.findElement(By.id('torusIframe'));
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

    await driver.wait(until.elementLocated(By.name('email')), 20000);
    const emailInput = await driver.findElement(By.name('email'));
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

    let library = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Library']")),
      10000
    );
    await library.click();

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[text()='Explore our growing collection of community videos and earn rewards for watching! Each video watched brings you closer to unlocking exclusive prizes!']"
        )
      ),
      10000
    );

    let firstVideo = await driver.findElement(
      By.xpath("//span[contains(text(), 'first video')]")
    );
    await firstVideo.click();

    await driver.wait(
      until.elementLocated(By.xpath("//h5[text()='🎉 Congratulations!']")),
      60000
    );

    console.log('Test Open library screen passed');
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
