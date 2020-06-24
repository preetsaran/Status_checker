require('chromedriver');
require('colors');
let fs = require('fs');
let swd = require('selenium-webdriver');
let driver = new swd.Builder().forBrowser('chrome').build();

let getLocalStorage = require('./getLocalStorage.js');
let setLocalStorage = require('./setLocalStorage.js');
let announce = require('./announce.js');

(async function () {
  let statusArr = [];
  try {
    await driver.manage().setTimeouts({
      implicit: 20000,
      pageLoad: 20000,
    });

    await driver.get('https://web.whatsapp.com/');

    async function whatsappMain() {
      
      let flag = true;
      await setLocalStorage(driver);
      await driver.get('https://web.whatsapp.com/');
      
      try {
        let uel = await driver.findElement(swd.By.css('._3e4VU')); // c1
        await uel.click();
        await getLocalStorage(driver,()=>{});
        flag = true;
      } catch (error) {
        flag = false;
        getLocalStorage(driver, whatsappMain);
        return;
      }


      if (flag) {

        console.log("Logged in successfully".bgGreen);

        let search = await driver.findElement(swd.By.css('._3FRCZ'));  //c2
         
        let names = await fs.promises.readFile('./response.json');
        names = JSON.parse(names);

        async function statusChecker(name,idx) {
          try {
                await search.sendKeys(`${name}` + '\n');
                let sdata;
                let status;

                try {
                    status = await driver.findElement(
                    swd.By.css('._2ruUq > span') //c3
                  );
                  sdata = await status.getText();
                  console.log("Y".bgYellow);
                  
                }
                catch (error)
                {
                  sdata = `${name} is not in your contacts`;
                  let cross = await driver.findElement(swd.By.css('.MfAhJ > span'));  
                  await cross.click();
                  console.log("X clicked".bgYellow);
                }
                
                finally {

                  if (sdata.includes('is not in your contacts'))
                  {
                    statusArr.push(sdata);
                    names[idx].status = sdata;
                    return sdata;
                  }
                  
                  let i = 0;

                  while (sdata == 'click here for contact info' || i <= 2) {
                    sdata = await status.getText();
                    i++;
                  }

                  if (sdata.includes('online')) {
                    statusArr.push(` ${name} is ${sdata}`);
                    names[idx].status = sdata;
                  } else {
                    statusArr.push(` ${name}  ${sdata}`);
                    names[idx].status = sdata;
                  }

                  return sdata;
              }
           

          } catch (error) {
            statusArr.push(` ${name}'s Status is hidden`);
            names[idx].status = ` ${name}'s Status is hidden`;
          }
        }

        for (let i = 0; i < names.length; i++) {
          let sdata = await statusChecker(names[i].name,i);
        }

        await driver.get(
          'https://translate.google.co.in/#view=home&op=translate&sl=auto&tl=hi'
        );
        
        
        await fs.promises.writeFile('./response.json',JSON.stringify(names));

        let enterText = await driver.findElement(swd.By.css('textarea#source'));

        for (let i = 0; i < statusArr.length; i++) {
          setTimeout(async function () {
            await announce(driver,statusArr[i],names,enterText);
          }, i * 7000);
        }

      }
    }

    whatsappMain();

  } catch (error) {
    console.log(error);
  }
})();
