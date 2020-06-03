require('chromedriver');
let fs = require('fs');
let swd = require('selenium-webdriver');
let objkeys = [];
let objValues = [];
let strkeys = [];
let strValues = [];
let data = {};

let setLocalStorage = async function (driver) { 
    console.log("Setting Local Storage".bgYellow);
    let myobj = await fs.promises.readFile('./ls.json');
    myobj = JSON.parse(myobj);
    strkeys = JSON.stringify(Object.keys(myobj));
    strValues = JSON.stringify(Object.values(myobj));
    objkeys = JSON.parse(strkeys);
    objValues = JSON.parse(strValues);
    for (let i = 0; i < objkeys.length; i++) {
    await driver.executeScript(`localStorage.setItem( '${objkeys[i]}' , '${objValues[i]}' )`);
    }

   }



module.exports = setLocalStorage;

      
