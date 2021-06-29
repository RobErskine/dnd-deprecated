const rp = require('request-promise')
const cheerio = require('cheerio')

exports.handler = async function (event, context) {
  const getDetails = async function (url) {
    const data = rp(url, { timeout: 2000000 }).then(function (htmlString) {
      const $ = cheerio.load(htmlString)

      const name = $('head > title').text()
      const description = $('meta[name="description"]').attr('content')
      const currentHealth = $('.ct-health-summary__hp-number').text()
      const totalHealth = $('.ct-health-summary__hp-number').text()

      return {
        name,
        description,
        currentHealth,
        totalHealth
      }
    })
    return data
  }

  try {
    // if (event.queryStringParameters.apiKey != process.env.API_KEY) throw "Not Authorized";

    const url = event.queryStringParameters.url

    const details = await getDetails(url)
    // const savedResponse = await saveBookmark ({url, ...details})

    return { statusCode: 200, body: JSON.stringify({ details }) }
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err}` }
  }
}
