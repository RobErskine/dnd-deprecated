const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda')

const config = require('~/dnd.json')
const characters = config.characters
let charData = []

async function getCharacters() {
  const executablePath = await chromium.executablePath

  const browser = await chromium.puppeteer.launch({
    args: await chromium.args,
    executablePath: executablePath,
    headless: true,
  })

  const page = await browser.newPage()

  for(i=0;i < characters.length; i++){
    console.log(characters[i])
    await page.goto(characters[i], {
      waitUntil: 'networkidle2'
    })

    const charName =  await page.$eval('.ddbc-character-name', el => el.innerText)
    const charInfo = await page.$eval('.ddbc-character-summary__classes', el => el.innerText)
    const charClassLevel = charInfo.split(' ')
    const charClass = charClassLevel[0]
    const charLevel = parseInt(charClassLevel[1])
    const charRace = await page.$eval('.ddbc-character-summary__race', el => el.innerText)

    let char = {}

    char['name'] = charName;
    char['race'] = charRace
    char['class'] = charClass;
    char['level'] = charLevel;

    charData.push(char);
  }

  await browser.close();
  return charData;
}

exports.handler = async (event, context) => {

  let data = await getCharacters()

  return {
    statusCode: 200,
    body: await JSON.stringify({
      urls: characters,
      characterData: data
    })
  }
}
