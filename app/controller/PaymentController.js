const { StatusCodes } = require("http-status-codes")
const paymentService = require("../services/PaymentService")

exports.checkout = async (req, res) => {

  try {

    const { items } = req.body
    let result = await paymentService.checkout({ items })

    if (result.error == 1) {
      res.json({ error: 1, message: result.message })
    } else {
      res.status(StatusCodes.OK).json({ url: result.data })
    }

  } catch (error) {

    res.json({ error: 1, message: error.message })
  }
}
