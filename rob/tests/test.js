import { expect } from "chai";
import { Builder, By } from "selenium-webdriver";
import "chromedriver";

describe("Create new campaign", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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

    // add here check that campaign was created
    // add archive created campaign
  });
  after(async function () {
    await driver.quit();
  });
});

describe("Create new template", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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
    await driver
      .findElement(
        By.id("add_new_template") //doesn't work, need to add id for this button
      )
      .click();

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

    await driver.findElement(By.name("name")).sendKeys(templateName);
    await driver
      .findElement(By.className(" CodeMirror-line "))
      .sendKeys(htmlRaw);

    await driver.findElement(By.className("create_new")).click(); //doesn't work, need to add id for this button

    // add here check that template was created
    // add delete created template
  });
  after(async function () {
    await driver.quit();
  });
});

describe("Create new event trigger", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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

    // add here check that trigger was created
    // add here delete trigger
  });
  after(async function () {
    await driver.quit();
  });
});

describe("Create new engagement", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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

    // add here check that engagement was created
    // add here delete engagement
  });
  after(async function () {
    await driver.quit();
  });
});
