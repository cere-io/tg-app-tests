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

describe("Create new campaign", async function () {
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
  it("should create new campaign", async function () {
    this.timeout(20000);
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-campaign")).click();
    await driver.findElement(By.id("create-campaign")).click();

    const campaignName = "Autotests campaign";
    const dateFrom = "01/01/2025";
    const timeFrom = "09:00";
    const dateTo = "01/01/2026";
    const timeTo = "09:00";
    await driver.findElement(By.name("campaign_name")).sendKeys(campaignName);
    await driver.findElement(By.name("dateFrom")).sendKeys(dateFrom);
    await driver.findElement(By.id("timeFrom")).sendKeys(timeFrom);
    await driver.findElement(By.name("dateTo")).sendKeys(dateTo);
    await driver.findElement(By.id("timeTo")).sendKeys(timeTo);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[2]/div[1]/div/div/form/fieldset[7]/div/select/option"
        )
      )
      .click();
    await driver.findElement(By.id("status")).click();
    await driver.findElement(By.id("appCreateButton")).click();
    console.log("Test Create new campaign passed");
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

describe("Create new template", async function () {
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
  it("should create new template", async function () {
    this.timeout(20000);
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-WidgetTemplate")).click();
    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(), 'Add new')]")),
      10000
    );

    let addNew = await driver.findElement(
      By.xpath("//span[contains(text(), 'Add new')]")
    );

    await addNew.click();

    const templateName = "Autotests template";
    const htmlRaw = `<!DOCTYPE html>
    <html lang="en"><head><meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
  <meta
      name="description"
      content="Web site created using create-react-app"
  />
<script>
  var TEMPLATE_DATA = JSON.stringify({ quests: {{{json data.0.quests}}}, campaignId: "{{data.0.campaignId}}", accountId: "{{data.0.accountId}}", theme: "{{data.0.theme}}", templateTitle: "Complete Quests to Earn!", campaignDescription: "{{data.0.campaignDescription}}", remainingTime: {{{json data.0.remainingTime}}}, campaignName: "{{data.0.campaignName}}", startDate: "{{data.0.startDate}}", endDate: "{{data.0.endDate}}" });
  </script>
  
  <style>
    body { background: transparent; }
    html::-webkit-scrollbar {
      display: none;
    }
    #active_quests_v2 {
            background: linear-gradient(135deg, #0EDD8D 0%, #15F6CB 100%);
            padding: 20px;
            min-height: 100vh;
        }
        #active_quests_v2 h1,
        #active_quests_v2 h2,
        #active_quests_v2 h3,
        #active_quests_v2 h4,
        #active_quests_v2 h5,
        #active_quests_v2 h6 {
            font-weight: 700;
            letter-spacing: 0.5px;
        }
  </style>
  <title>Active quests</title>
</head>
<body>
<div id="active_quests_v2"></div>

  
<script src="https://rxb.components.stage.cere.io/v2.32.0/static/js/bundle.js"></script>
<link rel="stylesheet" href="https://rxb.components.stage.cere.io/v2.32.0/static/css/bundle.css" />
</body>
</html>`;

    await driver.wait(until.elementLocated(By.name("name")), 10000);
    let nameField = await driver.findElement(By.name("name"));
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

    console.log("Test Create new template passed");
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

describe("Create new event trigger", async function () {
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
  it("should create new event trigger", async function () {
    this.timeout(20000);
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-placement")).click();
    await driver.findElement(By.id("create-placement")).click();

    const triggerName = "autotests_trigger";
    const eventName = "autotests_trigger";

    await driver.findElement(By.id("trigger_name")).sendKeys(triggerName);
    await driver.findElement(By.id("placement_name")).sendKeys(eventName);
    await driver.findElement(By.id("app_id")).sendKeys("Veronicas test app");
    await driver.findElement(By.id("submit")).click();

    console.log("Test Create new event trigger passed");
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

describe("Create new engagement", async function () {
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
  it("should create new engagement", async function () {
    this.timeout(20000);
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-engagement")).click();
    await driver.findElement(By.id("add_new_engagement")).click();

    const engagementName = "autotests engagement";

    await driver.findElement(By.id("name")).sendKeys(engagementName); //doesn't work, need to add id for this button
    await driver
      .findElement(By.id("mui-component-select-campaign"))
      .sendKeys("Autotests campaign");
    await driver
      .findElement(By.id("mui-component-select-selectedApps"))
      .sendKeys("Veronicas test app");
    await driver
      .findElement(By.id("mui-component-select-template"))
      .sendKeys("AUTOTESTS_TEMPLATE");
    await driver.findElement(By.name("enabled")).click();

    await driver.findElement(By.id("app_event_triggers")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.id("add_trigger")).click(); //doesn't work, need to add id for this button
    const triggerPopUp = await driver
      .findElement(By.id("trigger_pop_up"))
      .getText();
    expect(triggerPopUp).to.equal("Define event triggers"); //doesn't work, need to add id for this button
    await driver
      .findElement(By.id("mui-component-select-eventTrigger"))
      .sendKeys("autotests_trigger");
    await driver.findElement(By.id("save_trigger_changes")).click(); //doesn't work, need to add id for this button

    await driver.findElement(By.id("targeting")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.id("configure_targeting")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.id("select_targeting")).click(); //doesn't work, need to add id for this button
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[5]/div[3]/div/div[2]/div/div/ul/div[1]/span/span[1]/svg/path"
        )
      )
      .click();
    await driver.findElement(By.id("ok_target")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.id("cross_target")).click(); //doesn't work, need to add id for this button
    const activeTargeting = await driver.findElement(By.id("active")).getText(); //doesn't work, need to add id for this button
    expect(activeTargeting).to.equal("active");

    await driver.findElement(By.id("integration_scripts")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.id("select_script")).click(); //doesn't work, need to add id for this button
    await driver.findElement(By.name("scripts.id-15-3")).click();
    await driver.findElement(By.id("save_script")).click(); //doesn't work, need to add id for this button

    await driver.findElement(By.id("save_and_exit")).click(); //doesn't work, need to add id for this button

    console.log("Test Create new engagement passed");
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

describe("Create new campaign negative case", async function () {
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
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-campaign")).click();
    await driver.findElement(By.id("create-campaign")).click();
    await driver.findElement(By.id("appCreateButton")).click();

    const errorMessage = await driver
      .findElement(By.className("error"))
      .getText();
    expect(errorMessage).to.equal("This field is required.");

    console.log("Test Create new campaign negative case passed");
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

describe("Create new event trigger negative case", async function () {
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
    const userName = "veronica";
    const userPassword = "Test12345!";
    await driver.get("https://rob.stage.cere.io/EE/admin/login.php");
    await driver.findElement(By.name("login")).sendKeys(userName);
    await driver.findElement(By.name("password")).sendKeys(userPassword);
    await driver.findElement(By.id("adminLoginFormSubmit")).click();

    const welcomeMessage = await driver
      .findElement(By.id("username"))
      .getText();
    expect(welcomeMessage).to.equal(`Hello ${userName}`);

    await driver.findElement(By.id("menu-placement")).click();
    await driver.findElement(By.id("create-placement")).click();
    await driver.findElement(By.id("submit")).click();

    const errorMessage = await driver
      .findElement(By.className("error"))
      .getText();
    expect(errorMessage).to.equal("This field is required.");

    console.log("Test Create new event trigger negative case passed");
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
