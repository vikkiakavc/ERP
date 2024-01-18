
const CC = require('currency-converter-lt')

// let currencyConverter = new CC({ from: "USD", to: "JPY", amount: 100, isDecimalComma: true })


// currencyConverter.convert().then((response) => {
//   console.log(response) //or do something else
// })

async function convertCurrency(amount, fromCurrency, toCurrency) {
  // amount = parseFloat(amount)
  // console.log(parseFloat(amount))
  // console.log(fromCurrency)
  // console.log(toCurrency)
  if (fromCurrency === toCurrency) {
    return parseFloat(amount)
  }
  try {
    let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: parseFloat(amount) })
    let convertedAmount = await currencyConverter.convert();
    // console.log(convertedAmount)
    // console.log('--------------')
    return convertedAmount;
  } catch (error) {
    throw error;
  }
}

module.exports = convertCurrency;