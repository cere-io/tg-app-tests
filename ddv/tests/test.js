import { expect } from "chai";
import { Builder, By } from "selenium-webdriver";
import "chromedriver";

describe("Load data", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show data using app public key", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otpCode = "555555";
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();
    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otpCode);
    await driver.findElement(By.id(":r3:")).click();

    const welcomeMessage = await driver
      .findElement(By.className("smmmuj9"))
      .getText();
    expect(welcomeMessage).to.equal(`Welcome, ${email}`);

    const appKey = "2106";
    await driver.findElement(By.name("appPubKey")).sendKeys(appKey);
    await driver.findElement(By.id("load_data")).click();
    await driver.findElement(By.id("decrypt_all")).click();
  });
  after(async function () {
    await driver.quit();
  });
});

describe("Load data negative case", async function () {
  let driver;
  this.timeout(20000);
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });
  it("should show an error", async function () {
    this.timeout(20000);
    const email = "veronika.filipenko@cere.io";
    const otpCode = "555555";
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();
    await driver.findElement(By.id("sign_in")).click();
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id("otp")).sendKeys(otpCode);
    await driver.findElement(By.id(":r3:")).click();

    const welcomeMessage = await driver
      .findElement(By.className("smmmuj9"))
      .getText();
    expect(welcomeMessage).to.equal(`Welcome, ${email}`);

    const appKey = "0000";
    await driver.findElement(By.name("appPubKey")).sendKeys(appKey);
    await driver.findElement(By.id("load_data")).click();

    const errorMessage = await driver
      .findElement(By.className("text-red-300"))
      .getText();
    expect(errorMessage).to.equal(
      "The request of loading data has failed, or no data found in the DDC"
    );
  });
  after(async function () {
    await driver.quit();
  });
});
