const chromium = require('chrome-aws-lambda');

const config = require('./dnd.json')
const characters = config.characters
let charData = []

async function getCharacters() {
  const executablePath = await chromium.executablePath

  const browser = await chromium.puppeteer.launch({
    args: await chromium.args,
    executablePath: executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  for(i=0;i < characters.length; i++){
    await page.goto(characters[i], {
      waitUntil: 'networkidle2'
    })

    const charName =  await page.$eval('.ddbc-character-name', el => el.innerText);
    const charInfo = await page.$eval('.ddbc-character-summary__classes', el => el.innerText);
    const charClassLevel = charInfo.split(' ');
    const charClass = charClassLevel[0];
    const charLevel = parseInt(charClassLevel[1]);

    let char = {}

    char['name'] = charName;
    char['class'] = charClass;
    char['level'] = charLevel;

    charData.push(char);
  }

  await browser.close();
  console.log(charData);
  return charData;
}

return {
  statusCode: 200,
  body: JSON.stringify({
    data: characters,
    characterData: getCharacters()
  })
}
