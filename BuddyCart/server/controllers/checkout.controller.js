const axios = require("axios");

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  PAYPAL_ENV = "sandbox",
  CLIENT_BASE_URL = "http://localhost:5173",
} = process.env;

const PAYPAL_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const url = `${PAYPAL_BASE}/v1/oauth2/token`;
  const body = "grant_type=client_credentials";

  const { data } = await axios.post(url, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
  });

  return data.access_token;
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const { products = [] } = req.body;

    const total = products.reduce((sum, p) => {
      const price = Number(p?.price || 0);
      const qty = Number(p?.quantity || 1);
      return sum + price * qty;
    }, 0);

    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const accessToken = await getPayPalAccessToken();

    const { data: order } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: total.toFixed(2) },
          },
        ],
        application_context: {
          brand_name: "BuddyCart",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${CLIENT_BASE_URL}/paypal-return`,
          cancel_url: `${CLIENT_BASE_URL}/cart`,
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const approve = order.links?.find((l) => l.rel === "approve")?.href;
    if (!approve) return res.status(500).json({ error: "No approve link" });

    res.json({ url: approve, id: order.id });
  } catch (e) {
    console.error(e);
    const msg =
      e.response?.data?.message ||
      e.response?.data?.details?.[0]?.issue ||
      e.message ||
      "Server error";
    res.status(500).json({ error: msg });
  }
};

exports.captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: "Missing orderID" });

    const accessToken = await getPayPalAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json({ status: "captured", data });
  } catch (e) {
    console.error(e);
    const msg =
      e.response?.data?.message ||
      e.response?.data?.details?.[0]?.issue ||
      e.message ||
      "Server error";
    res.status(500).json({ error: msg });
  }
};
