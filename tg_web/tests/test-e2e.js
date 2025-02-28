const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Прокси-серверы для разных стран
const proxies = {
  US: "socks5://127.0.0.1:1080",
  JP: "socks5://127.0.0.1:1081",
  NL: "socks5://127.0.0.1:1082",
};

async function checkIp(proxy) {
  const options = new chrome.Options();
  options.addArguments(`--proxy-server=${proxy}`);

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Переход на сайт для проверки IP
    await driver.get("https://ipinfo.io");

    // Ожидаем, пока не появится IP-адрес
    await driver.wait(until.elementLocated(By.tagName("pre")), 10000);

    // Извлекаем текст с элементом, содержащим IP
    let ipInfo = await driver.findElement(By.tagName("pre")).getText();

    console.log(`IP Info for ${proxy}:`, ipInfo); // Выводим информацию о IP для этого прокси
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Закрываем браузер
    await driver.quit();
  }
}

// Запуск проверки для всех прокси
async function checkAllProxies() {
  for (let country in proxies) {
    console.log(`\nChecking proxy for ${country}...`);
    await checkIp(proxies[country]);
  }
}

// Запуск проверки всех прокси
checkAllProxies();
