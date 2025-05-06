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

describe('Create new campaign old version', async function () {
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
  it('should create new campaign', async function () {
    this.timeout(20000);
    const userName = 'veronica';
    const userPassword = 'Test12345!';
    await driver.get('https://rob.stage.cere.io/EE/admin/login.php');
    await driver.findElement(By.name('login')).sendKeys(userName);
    await driver.findElement(By.name('password')).sendKeys(userPassword);
    await driver.findElement(By.id('adminLoginFormSubmit')).click();
    this.timeout(20000);

    const welcomeMessage = await driver
      .findElement(By.id('username'))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    const campaignsMenu = await driver.wait(
      until.elementLocated(By.css('#menu-campaign > a')),
      10000
    );

    const actions = driver.actions({ async: true });
    await actions.move({ origin: campaignsMenu }).perform();

    const campaignsOld = await driver.wait(
      until.elementLocated(
        By.css('a[href*="controller=campaign&action=index"]')
      ),
      5000
    );
    await campaignsOld.click();

    await driver.findElement(By.id('create-campaign')).click();

    const randomNumber = Math.floor(Math.random() * 100000);
    const campaignName = `Autotests campaign+${randomNumber}`;
    const campaignDescription = `Campaign Description test+${randomNumber}`;

    await driver.wait(
      until.elementLocated(By.id('campaign-cinfigurator-iframe')),
      30000
    );
    let configuratorFrame = await driver.findElement(
      By.id('campaign-cinfigurator-iframe')
    );
    driver.switchTo().frame(configuratorFrame);

    await driver.wait(
      until.elementLocated(By.xpath("//h2[text()='Create Campaign']")),
      10000
    );
    await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Select data services']")),
      10000
    );
    const dropdown = await driver.findElement(
      By.xpath("//span[text()='Select data services']")
    );
    await dropdown.click();

    const option = await driver.findElement(
      By.xpath("//div[text()='Telegram Supercharged Bot']")
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', option);
    await option.click();
    await driver.findElement(By.className('p-2')).click();

    await driver.findElement(By.id('name')).sendKeys(campaignName);
    await driver
      .findElement(By.id('description'))
      .sendKeys(campaignDescription);

    await driver.findElement(By.xpath("//option[text()='Draft']")).click();
    const optionStatus = await driver.findElement(
      By.xpath("//option[text()='Active']")
    );
    await driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      optionStatus
    );
    await optionStatus.click();

    await driver.findElement(By.xpath("//button[text()='Next']")).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[text()='Configure Campaign Engagement']")
      ),
      10000
    );

    await driver
      .findElement(By.xpath("//button[text()='Add Video Task']"))
      .click();
    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Create New Video Task']")),
      10000
    );
    const videoTitle = `Video title+${randomNumber}`;
    const videoDescription = `Video description+${randomNumber}`;
    const videoPoints = Math.floor(Math.random() * 100);
    const videoURL =
      'https://cdn.testnet.cere.network/573102/baear4igpors3habtmqvmvmbdeptiudifwvpw4rwdwjwvdqqpfpbao4obhu/19757067-uhd_3840_2160_30fps.mp4?source=developer-console';
    const thumbnailURL =
      'https://cdn.testnet.cere.network/573102/baear4ihj64wdrmhdxdgvmles3jteydd5mtrbyxp4xy4pdww45soj7hegf4/2.jpg?source=developer-console';

    await driver.findElement(By.name('title')).sendKeys(videoTitle);
    await driver.findElement(By.name('description')).sendKeys(videoDescription);
    await driver.findElement(By.name('points')).clear();
    await driver.findElement(By.name('points')).sendKeys(videoPoints);
    await driver.findElement(By.name('videoUrl')).sendKeys(videoURL);
    await driver.findElement(By.name('thumbnailUrl')).sendKeys(thumbnailURL);

    await driver
      .findElement(By.xpath("//button[text()='Create Task']"))
      .click();

    await driver.wait(until.elementLocated(By.className('video-task')), 10000);

    await driver
      .findElement(By.xpath("//button[text()='Add Social Task']"))
      .click();
    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Create New Social Task']")),
      10000
    );

    const socialTitle = `Social title+${randomNumber}`;
    const socialDescription = `Social description+${randomNumber}`;
    const linkToPost = 'https://x.com/cerenetwork/status/1662128009988435969';
    const socialPoints = Math.floor(Math.random() * 100);
    const socialImage =
      'https://cdn.testnet.cere.network/573102/baear4ig4gq5kpbtvscoo3fs47w3lvnasijooldqdh2dpv2iglpq2xhvonq/3.jpg?source=developer-console';
    const hashtag = `hashtag+${randomNumber}`;

    await driver.findElement(By.name('title')).sendKeys(socialTitle);
    await driver
      .findElement(By.name('description'))
      .sendKeys(socialDescription);
    await driver.findElement(By.name('tweetLink')).sendKeys(linkToPost);
    await driver.findElement(By.name('points')).clear();
    await driver.findElement(By.name('points')).sendKeys(socialPoints);
    await driver.findElement(By.name('questImage')).sendKeys(socialImage);
    await driver.findElement(By.css('.hashtag-input input')).sendKeys(hashtag);
    await driver.findElement(By.xpath("//button[text()='Add']")).click();
    await driver.wait(
      until.elementLocated(By.className('hashtag-item')),
      10000
    );
    await driver
      .findElement(By.xpath("//button[text()='Create Task']"))
      .click();

    await driver.wait(until.elementLocated(By.className('social-task')), 10000);

    await driver.executeScript('window.scrollTo(0, 0);');
    await driver
      .findElement(By.xpath("//button[text()='Add Referral Task']"))
      .click();
    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Create New Referral Task']")),
      10000
    );

    const referralTitle = `Referral title+${randomNumber}`;
    const referralDescription = `Referral description+${randomNumber}`;
    const referralPoints = Math.floor(Math.random() * 100);
    const referralInstructions = `Referral instructions+${randomNumber}`;
    const invitMessage = `Invitation message+${randomNumber}`;
    const referralImage =
      'https://cdn.testnet.cere.network/573102/baear4ig4gq5kpbtvscoo3fs47w3lvnasijooldqdh2dpv2iglpq2xhvonq/3.jpg?source=developer-console';

    await driver.findElement(By.name('title')).sendKeys(referralTitle);
    await driver
      .findElement(By.name('description'))
      .sendKeys(referralDescription);
    await driver.findElement(By.name('points')).clear();
    await driver.findElement(By.name('points')).sendKeys(referralPoints);
    await driver
      .findElement(By.name('instructions'))
      .sendKeys(referralInstructions);
    await driver.findElement(By.name('message')).sendKeys(invitMessage);
    await driver.findElement(By.name('questImage')).sendKeys(referralImage);
    await driver
      .findElement(By.xpath("//button[text()='Create Task']"))
      .click();

    await driver.wait(
      until.elementLocated(By.className('referral-task')),
      10000
    );

    await driver.executeScript('window.scrollTo(0, 0);');
    await driver
      .findElement(By.xpath("//button[text()='Add Quiz Task']"))
      .click();
    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Create New Quiz Task']")),
      10000
    );

    const quizTitle = `Quiz title+${randomNumber}`;
    const quizQuestionFirst = `Quiz question 1+${randomNumber}`;
    const quizQuestionSecond = `Quiz question 2+${randomNumber}`;
    const answerOptionFirst = `Option 1+${randomNumber}`;
    const answerOptionSecond = `Option 2+${randomNumber}`;
    const answerOptionThird = `Option 3+${randomNumber}`;
    const answerOption4 = `Option 4+${randomNumber}`;
    const answerOption5 = `Option 5+${randomNumber}`;
    const answerOption6 = `Option 6+${randomNumber}`;

    await driver.findElement(By.name('title')).sendKeys(quizTitle);
    await driver
      .findElement(By.css('input.w-full.p-2.border.rounded'))
      .sendKeys(quizQuestionFirst);
    await driver
      .findElement(By.css('textarea.flex-1.p-2.border.rounded'))
      .sendKeys(answerOptionFirst);
    await driver
      .findElement(
        By.xpath('(//textarea[@placeholder="Answer option text"])[2]')
      )
      .sendKeys(answerOptionSecond);
    await driver.findElement(By.xpath("//button[text()='Add option']")).click();
    await driver
      .findElement(
        By.xpath('(//textarea[@placeholder="Answer option text"])[3]')
      )
      .sendKeys(answerOptionThird);
    await driver
      .findElement(By.xpath("//button[text()='Add question']"))
      .click();

    await driver
      .findElement(By.css('input.w-full.p-2.border.rounded'))
      .sendKeys(quizQuestionSecond);
    await driver
      .findElement(By.css('textarea.flex-1.p-2.border.rounded'))
      .sendKeys(answerOption4);
    await driver
      .findElement(
        By.xpath('(//textarea[@placeholder="Answer option text"])[2]')
      )
      .sendKeys(answerOption5);
    await driver.findElement(By.xpath("//button[text()='Add option']")).click();
    await driver
      .findElement(
        By.xpath('(//textarea[@placeholder="Answer option text"])[3]')
      )
      .sendKeys(answerOption6);

    await driver
      .findElement(By.xpath("//button[text()='Create Task']"))
      .click();

    await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Type: Quiz']")),
      10000
    );

    await driver.findElement(By.xpath("//button[text()='Continue']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Engagement Tasks']")),
      10000
    );

    await driver
      .findElement(By.xpath("//button[text()='Create Campaign']"))
      .click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h3[text()='Campaign Submitted Successfully']")
      ),
      10000
    );
    await driver.wait(
      until.elementLocated(
        By.xpath("//p[text()='New campaign has been created successfully.']")
      ),
      10000
    );
    await driver.switchTo().defaultContent();

    await driver.findElement(By.id('menu-campaign')).click();

    console.log('Test Create new campaign passed');
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

describe('Create new template', async function () {
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
  it('should create new template', async function () {
    this.timeout(20000);
    const userName = 'veronica';
    const userPassword = 'Test12345!';
    await driver.get('https://rob.stage.cere.io/EE/admin/login.php');
    await driver.findElement(By.name('login')).sendKeys(userName);
    await driver.findElement(By.name('password')).sendKeys(userPassword);
    await driver.findElement(By.id('adminLoginFormSubmit')).click();

    const welcomeMessage = await driver
      .findElement(By.id('username'))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id('menu-WidgetTemplate')).click();
    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(), 'Add new')]")),
      10000
    );

    let addNew = await driver.findElement(
      By.xpath("//span[contains(text(), 'Add new')]")
    );

    await addNew.click();

    const templateName = 'Autotests template';
    await driver.wait(until.elementLocated(By.name('name')), 10000);
    let nameField = await driver.findElement(By.name('name'));
    await nameField.sendKeys(templateName);

    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(), 'Create')]")),
      10000
    );
    let createNew = await driver.findElement(
      By.xpath("//span[contains(text(), 'Create')]")
    );
    await createNew.click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//td[contains(text(), 'Autotests template')]")
      ),
      10000
    );

    let deleteButton = await driver.findElement(
      By.xpath(
        '//tr[td[contains(text(),"Autotests template")]]//span[contains(text(),"Delete")]'
      )
    );
    await deleteButton.click();

    await driver.switchTo().alert().accept();

    console.log('Test Create new template passed');
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

describe('Create new event trigger', async function () {
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
  it('should create new event trigger', async function () {
    this.timeout(20000);
    const userName = 'veronica';
    const userPassword = 'Test12345!';
    await driver.get('https://rob.stage.cere.io/EE/admin/login.php');
    await driver.findElement(By.name('login')).sendKeys(userName);
    await driver.findElement(By.name('password')).sendKeys(userPassword);
    await driver.findElement(By.id('adminLoginFormSubmit')).click();

    const welcomeMessage = await driver
      .findElement(By.id('username'))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id('menu-placement')).click();
    await driver.findElement(By.id('create-placement')).click();

    const triggerName = 'autotests_trigger';
    const eventName = 'autotests_trigger';

    await driver.findElement(By.id('trigger_name')).sendKeys(triggerName);
    await driver.findElement(By.id('placement_name')).sendKeys(eventName);
    await driver.findElement(By.id('app_id')).sendKeys('Veronicas test app');
    await driver.findElement(By.id('submit')).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//td[contains(text(), 'autotests_trigger')]")
      ),
      10000
    );

    await driver.findElement(By.id('placementDeleteButton')).click();

    console.log('Test Create new event trigger passed');
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

describe('Create new engagement', async function () {
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
  it('should create new engagement', async function () {
    this.timeout(20000);
    const userName = 'veronica';
    const userPassword = 'Test12345!';
    await driver.get('https://rob.stage.cere.io/EE/admin/login.php');
    await driver.findElement(By.name('login')).sendKeys(userName);
    await driver.findElement(By.name('password')).sendKeys(userPassword);
    await driver.findElement(By.id('adminLoginFormSubmit')).click();

    const welcomeMessage = await driver
      .findElement(By.id('username'))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id('menu-engagement')).click();
    await driver.findElement(By.className('button_left')).click();

    await driver.wait(
      until.elementLocated(By.xpath("//h3[text()='Engagement settings']")),
      50000
    );
    await driver.findElement(By.id('mui-component-select-campaign')).click();
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//li[contains(@class, "MuiMenuItem-root") and normalize-space(.)="Main Nightingale"]'
        )
      ),
      10000
    );
    const testCampaign = await driver.findElement(
      By.xpath(
        '//li[contains(@class, "MuiMenuItem-root") and normalize-space(.)="Main Nightingale"]'
      )
    );
    await testCampaign.click();

    await driver.wait(
      until.elementLocated(By.id('mui-component-select-selectedApps')),
      10000
    );
    await driver
      .findElement(By.id('mui-component-select-selectedApps'))
      .click();
    const testApp = await driver.findElement(
      By.xpath(
        '//li[contains(@class, "MuiMenuItem-root") and normalize-space(.)="Veronicas test app"]'
      )
    );
    await testApp.click();
    await driver.findElement(By.css('body')).click();

    await driver.wait(
      until.elementLocated(By.id('mui-component-select-template')),
      10000
    );
    await driver.findElement(By.id('mui-component-select-template')).click();
    const testTemplate = await driver.findElement(
      By.xpath(
        '//li[contains(@class, "MuiMenuItem-root") and normalize-space(.)="GET_LEADERBOARD"]'
      )
    );
    await testTemplate.click();

    const engagementName = 'autotests engagement';
    const nameInput = await driver.findElement(
      By.xpath('//input[@name="name" and @type="text"]')
    );
    await nameInput.sendKeys(engagementName);
    this.timeout(10000);
    await driver.findElement(By.name('enabled')).click();
    let nextButton = await driver.findElement(
      By.xpath("//span[text()='Next']")
    );
    await driver.executeScript('arguments[0].click();', nextButton);

    await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Add new']")),
      10000
    );

    let addTrigger = await driver.findElement(
      By.xpath("//span[text()='Add new']")
    );
    await driver.executeScript('arguments[0].click();', addTrigger);
    await driver.wait(
      until.elementLocated(By.xpath("//h4[text()='Define event triggers']")),
      20000
    );
    await driver
      .findElement(By.id('mui-component-select-eventTrigger'))
      .click();
    const testTrigger = await driver.findElement(
      By.xpath(
        '//li[contains(@class, "MuiMenuItem-root") and normalize-space(.)="GET_LEADERBOARD"]'
      )
    );
    await testTrigger.click();
    await driver.findElement(By.xpath("//span[text()='Save changes']")).click();
    await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Next']")),
      10000
    );
    await driver.executeScript('arguments[0].click();', nextButton);

    await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Configure']")),
      10000
    );
    await driver.wait(until.elementLocated(By.xpath("//p[text()='0']")), 1000);
    let addTargeting = await driver.findElement(
      By.xpath("//span[text()='Configure']")
    );
    await driver.executeScript('arguments[0].click();', addTargeting);
    await driver.wait(
      until.elementLocated(By.xpath("//h4[text()='Rules Editor']")),
      10000
    );
    await driver.wait(
      until.elementLocated(By.xpath("//h6[text()='Engagement Targeting']")),
      10000
    );

    console.log('Test Create new engagement passed');
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
