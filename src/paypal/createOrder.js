const base = 'https://api-m.sandbox.paypal.com'

const generateAccessToken = async () => {
    try {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = btoa(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET);
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
};

async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
}

const createOrderPaypal = async (orderType) => {
    return new Promise(async (resolve, reject) => {
        const accessToken = await generateAccessToken();
        try {
          console.log(orderType)
            const url = `${base}/v2/checkout/orders`;
            const payload = {
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                    //   value: "25.00",
                      value: "0.01",
                    },
                  },
                ],
            };


            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
              },
              body: JSON.stringify(payload),
            });

            resolve(handleResponse(response))
        } catch (err) {
          Loading.hide()
          Notify.create({
            type: 'negative',
            message: err.message
          })
          reject(err.message)
        }
    })
    
};

export default createOrderPaypal