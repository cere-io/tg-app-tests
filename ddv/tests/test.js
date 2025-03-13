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
    const otp = "555555";
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();
    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);
    console.log("opened 1 iframe");

    let embeddedFrame = await driver.findElement(
      By.css('iframe[title="Embedded browser"]', 30000)
    );
    driver.switchTo().frame(embeddedFrame);
    console.log("opened 2 iframe");

    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", buttonLogin);
    await driver.wait(until.elementIsVisible(buttonLogin), 10000);
    await buttonLogin.click();

    let emailInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='Email']")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", emailInput);
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys(userName);

    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", signInButton);
    await driver.wait(until.elementIsVisible(signInButton), 10000);
    await signInButton.click();

    let otpInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='OTP input']")
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
    const otp = "555555";
    await driver.get("https://ddc.stage.cere.network/#/");

    await driver.findElement(By.className("nvg2rd8")).click();
    await driver.wait(until.elementLocated(By.id("torusIframe")), 30000);
    let torusFrame = await driver.findElement(By.id("torusIframe"));
    driver.switchTo().frame(torusFrame);
    console.log("opened 1 iframe");

    let embeddedFrame = await driver.findElement(
      By.css('iframe[title="Embedded browser"]', 30000)
    );
    driver.switchTo().frame(embeddedFrame);
    console.log("opened 2 iframe");

    let buttonLogin = await driver.findElement(
      By.xpath("//button[contains(text(), 'I already have a wallet')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", buttonLogin);
    await driver.wait(until.elementIsVisible(buttonLogin), 10000);
    await buttonLogin.click();

    let emailInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='Email']")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", emailInput);
    await driver.wait(until.elementIsVisible(emailInput), 10000);
    await emailInput.sendKeys(userName);

    let signInButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign In')]")
    );
    await driver.executeScript("arguments[0].scrollIntoView();", signInButton);
    await driver.wait(until.elementIsVisible(signInButton), 10000);
    await signInButton.click();

    let otpInput = await driver.findElement(
      By.xpath("//input[@type='text' and @name='OTP input']")
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
