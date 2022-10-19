const paymentService = require("../services/PaymentService");

exports.checkout = async (req, res) => {
  try {
    let result = await paymentService.checkout(req, res);

    if (result.error == 1) {
      res.json({
        error: 1,
        message: result.message,
      });
    } else {
      res.json({
        url: result.data,
      });
    }
  } catch (error) {
    res.json({
      error: 1,
      message: error.message,
    });
  }
};
