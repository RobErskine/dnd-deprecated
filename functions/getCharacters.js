const chromium = require('chrome-aws-lambda');

const config = require('../dnd.json')
const characters = config.characters;

exports.handler = async (event, context) => {

  let charData = []

  ;(async function() {
    const executablePath = await chromium.executablePath
  
    const browser = await chromium.puppeteer.launch({
        args: await chromium.args,
        executablePath: executablePath,
        headless: true,
    });

  
    for(i=0;i < characters.length; i++){
      let state = pages[i];

      const page = await browser.newPage();
  
      await page.goto(characters[i]);
      await page.evaluateHandle('document.fonts.ready');

      const name = await content.$(".ddbc-character-name ");
      const gameName = await page.evaluate(name => name.innerText, name);

      console.log(gameName);

      await page.close();
    }
  
    await browser.close();
  })().catch(console.error)

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: characters
    })
  }
}