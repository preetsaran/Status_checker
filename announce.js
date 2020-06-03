require('chromedriver');
let fs = require('fs');
let swd = require('selenium-webdriver');

let announce = async function (driver,status,names,enterText) { 
    
    try{
        let selectAll = await enterText.sendKeys(swd.Key.CONTROL + 'a');
        await enterText.sendKeys(swd.Key.DELETE);

        await enterText.sendKeys(`${status}`);
        let textArea = await driver.findElements(
          swd.By.css('div[data-tooltip=Listen]')
        );
        await textArea[1].click();

        if (status.includes('online')) {
          console.log(`${status}`.bgGreen);
        } else if (status.includes('last seen')) {
          console.log(`${status}`.bgCyan);
        } else {
          console.log(`${status}`.bgRed);
        }
    }
    catch (error) {
        console.log(`Can't get status`.red);
    }
    
   }



module.exports = announce;

      