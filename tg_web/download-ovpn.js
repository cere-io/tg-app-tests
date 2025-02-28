const fs = require("fs-extra");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const tesseract = require("tesseract.js");
const puppeteer = require("puppeteer");

const GITHUB_REPO = "https://api.github.com/repos/Zoult/.ovpn/contents";
const DOWNLOAD_DIR = path.join(process.cwd(), "vpn-config");
const ALLOWED_COUNTRIES = ["usa", "germany"];

// 🔎 Функция получения списка конфигов
async function getConfigUrls() {
  try {
    const response = await globalThis.fetch(GITHUB_REPO);
    if (!response.ok)
      throw new Error(`GitHub API error: ${response.statusText}`);

    const countries = await response.json();
    const filteredCountries = countries.filter((country) =>
      ALLOWED_COUNTRIES.some((filter) =>
        country.name.toLowerCase().includes(filter),
      ),
    );

    for (const country of filteredCountries) {
      console.log(`📌 Обрабатываю страну: ${country.name}`);
      await processCountryConfigs(country.git_url, country.name);
    }
  } catch (error) {
    console.error("❌ Ошибка при получении списка файлов:", error);
  }
}

// 🔥 Обрабатываем конфиги и пароли
async function processCountryConfigs(gitUrl, countryName) {
  try {
    const response = await globalThis.fetch(gitUrl);
    const countryConfig = await response.json();

    const config = countryConfig.tree.find(
      (file) =>
        file.type === "blob" &&
        file.path.startsWith("VBK") &&
        file.path.endsWith(".ovpn"),
    );
    const passwordFile = countryConfig.tree.find(
      (file) => file.type === "blob" && file.path.includes("VBK password.url"),
    );

    if (config) {
      console.log(`✅ Найден конфиг: ${config.path}`);
      await downloadConfig(config.url, config.path);
    } else {
      console.log(`⚠️ Нет конфигов для ${countryName}`);
    }

    if (passwordFile) {
      console.log(`🔑 Найден файл с паролем: ${passwordFile.path}`);
      await downloadAndExtractPassword(passwordFile.url, countryName);
    }
  } catch (error) {
    console.error("❌ Ошибка при обработке страны:", error);
  }
}

// 📥 Скачиваем конфиг
async function downloadConfig(configUrl, fileName) {
  try {
    const response = await globalThis.fetch(configUrl);
    const configData = await response.json();

    await fs.ensureDir(DOWNLOAD_DIR);
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    fs.writeFileSync(
      filePath,
      Buffer.from(configData.content, "base64"),
      "utf-8",
    );
    console.log(`📂 Конфиг сохранен: ${fileName}`);
  } catch (error) {
    console.error("❌ Ошибка при скачивании конфига:", error);
  }
}

// 🔓 Извлекаем URL пароля и парсим страницу
async function downloadAndExtractPassword(passwordUrl, countryName) {
  try {
    const response = await globalThis.fetch(passwordUrl);
    const passwordData = await response.json();
    const decodedContent = Buffer.from(passwordData.content, "base64").toString(
      "utf-8",
    );

    const match = decodedContent.match(/URL=(.+)/);
    if (!match) {
      console.log(`⚠️ Не удалось найти ссылку на пароль для ${countryName}`);
      return;
    }

    const passwordPageUrl = match[1];
    console.log(`🌐 Загружаю страницу пароля: ${passwordPageUrl}`);

    const password = await parsePasswordFromPage(passwordPageUrl);
    if (password) {
      console.log(`🔑 Найден пароль для ${countryName}: ${password}`);
    } else {
      console.log(`❌ Не удалось извлечь пароль.`);
    }
  } catch (error) {
    console.error("❌ Ошибка при скачивании пароля:", error);
  }
}

// 🕵️‍♂️ Парсим страницу с помощью Puppeteer
async function parsePasswordFromPage(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // Ждем появления картинки с паролем
    await page.waitForSelector("li img.pwdimg", { timeout: 5000 });

    // Получаем URL изображения
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector("li img.pwdimg");
      return img ? img.src : null;
    });

    await browser.close();

    if (!imageUrl) {
      console.log("❌ Картинка с паролем не найдена.");
      return null;
    }

    const fullImageUrl = new URL(imageUrl, url).href;
    console.log(`📷 Скачиваю изображение пароля: ${fullImageUrl}`);

    return await extractTextFromImage(fullImageUrl);
  } catch (error) {
    console.error("❌ Ошибка при парсинге страницы:", error);
    await browser.close();
    return null;
  }
}

// 🧠 Распознаем текст с изображения (OCR)
async function extractTextFromImage(imageUrl) {
  try {
    const { data } = await tesseract.recognize(imageUrl);
    return data.text.trim();
  } catch (error) {
    console.error("❌ Ошибка при распознавании пароля:", error);
    return null;
  }
}

// 🚀 Запуск
(async function main() {
  await getConfigUrls();
})();
