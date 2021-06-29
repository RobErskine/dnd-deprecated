const chromium = require('chrome-aws-lambda')

const config = require('../dnd.json')
const characters = config.characters
const charData = []

async function getCharacters () {
  const executablePath = await chromium.executablePath

  const browser = await chromium.puppeteer.launch({
    args: await chromium.args,
    executablePath,
    headless: true
  })

  const page = await browser.newPage()

  let i = 0
  for (i = 0; i < characters.length; i++) {
    await page.goto(characters[i], {
      waitUntil: 'networkidle2'
    })

    const charName = await page.$eval('.ddbc-character-name', el => el.innerText)
    const charInfo = await page.$eval('.ddbc-character-summary__classes', el => el.innerText)
    const charClassLevel = charInfo.split(' ')
    const charClass = charClassLevel[0]
    const charLevel = parseInt(charClassLevel[1])
    const charRace = await page.$eval('.ddbc-character-summary__race', el => el.innerText)

    const char = {}

    char.name = charName
    char.racce = charRace
    char.class = charClass
    char.level = charLevel

    charData.push(char)
  }

  await browser.close()
  return charData
}

exports.handler = async (event, context) => {
  const data = await getCharacters()

  return {
    statusCode: 200,
    body: await JSON.stringify({
      urls: characters,
      characterData: data
    })
  }
}
