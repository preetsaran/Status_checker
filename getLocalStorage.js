require('chromedriver');
require("colors");
let fs = require('fs');
let swd = require('selenium-webdriver');
let data = {};

let getLocalStorage = async function (driver, whatsappMain) {
    console.log("Getting Local Storage".bgBlue);
    await driver.executeScript(" keys = [], values = []");

    keys = await driver.executeScript("for(let i = 0; i < localStorage.length; i++) { keys[i] = localStorage.key(i)} return keys");

    values = await driver.executeScript("for(let i = 0; i < localStorage.length; i++){values[i]=localStorage.getItem(keys[i])} return values");

    for (let i = 0; i < keys.length; i++) { data[keys[i]] = values[i] ; }

    let checkData = JSON.stringify(data);

    if (checkData.includes("WAToken1")) {
        await fs.promises.writeFile('./ls.json', JSON.stringify(data));
        whatsappMain();
    } else {
        console.log("loop".bgRed)
        getLocalStorage(driver, whatsappMain);
    }
}

module.exports = getLocalStorage;
