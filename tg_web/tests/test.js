import { expect } from "chai";
import { Builder, By } from "selenium-webdriver";
import "chromedriver";

describe("Open active quests screen", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show active quests screen", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const userName = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=114"
    );

    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(userName);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otp);
    await driver.findElement(By.id(":r3:")).click();

    const questTitle = await driver
      .findElement(By.className("t1uqjrzu"))
      .getText();
    expect(questTitle).to.equal("Complete Quests to Earn!");

    const questTab = await driver
      .findElement(By.className("tgui-e6658d0b8927f95e"))
      .getText();
    expect(questTab).to.equal("Active Quests");
  });
  after(async function () {
    await driver.quit();
  });
});

describe.only("Answer on quiz questions", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should answer on quiz questions", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const userName = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=120"
    );

    const welcomeTitle = await driver
      .findElement(By.className("hero-title"))
      .getText();
    expect(welcomeTitle).to.equal("Sit back, Enjoy, and Earn!");

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(userName);
    await driver.findElement(By.id(":r7:")).click();
    await driver.findElement(By.className("css-6f6728")).sendKeys(otp);
    await driver.findElement(By.id(":r3:")).click();

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
  });
});

describe("Open leaderboard screen", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show leaderboard screen", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const userName = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=114"
    );

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(userName);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otp);
    await driver.findElement(By.id(":r3:")).click();

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
  });
});

describe("Open library screen", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show library screen", async function () {
    const randomNumber = Math.floor(Math.random() * 100000);
    const userName = `veronika.filipenko+${randomNumber}@cere.io`;
    const otp = "555555";
    await driver.get(
      "https://telegram-viewer-app.stage.cere.io/?campaignId=114"
    );

    await driver.findElement(By.className("tgui-bca5056bf34297b0")).click();
    await driver.findElement(By.className("welcom-cta-text")).click();

    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(userName);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otp);
    await driver.findElement(By.id(":r3:")).click();

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
  });
});
