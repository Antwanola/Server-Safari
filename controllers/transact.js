const asyncWrapper = require("../helpers/async");
const { createCustomError } = require("../errors/custom-error");
const PaymentSchema = require("../model/paymentSchema");
const axios = require("axios");
const stripe = require("stripe")(
  "sk_test_51LTmH2HKDFx0rty5D8k1K9teO4maftBr5sqjvBYy8lDkfswmowHH5chHeNrCyn0nFVzqQp37h66oTaSjkNipGYwF00LQawJsL2"
);
const https = require("https");

//User endpoints

//Get payment into stripe wallet
const getPayment = asyncWrapper(async (req, res) => {
  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  const charge = await stripe.charges.create({
    amount: 2000,
    currency: "usd",
    source: "tok_visa",
    description:
      "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)",
  });
  console.log(charge);
  // const {amount, currency} = req.body;
  // console.log(amount)

  // const paymentIntent = await stripe.paymentIntents.create({
  //     amount: amount,
  //     currency: currency,
  //     automatic_payment_methods: {
  //       enabled: true,
  //     },
  //   });
  //  if(!paymentIntent){
  //   throw new Error('No payment made')
  //  }
  //    const pay = await PaymentSchema.create(amount, currency, walletAddress, description )
  //    res.status(200).send({paymentIntent})
  // if(res.status(200)){
  //     res.status(200).send({
  //         clientSecret: paymentIntent.client_secret,
  //       });
  //     }
});

//Wallet balance
const getBalance = asyncWrapper(async (req, res) => {
  // const agent = new https.Agent({
  //   rejectUnauthorized: false
  // });
  const { user_email, user_token } = req.body;
  // console.log(process.env.CLIENT_ID)
  const userDetail = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://rgw.k8s.apis.ng/centric-platforms/uat/GetBalance",
    data: { user_email, user_token, user_type: "USER", channel_code: "APISNG" },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache",
      ClientId: process.env.CLIENT_ID,
      // httpsAgent: agent
    },
  });

  if (userDetail.statusText === "OK") {
    res.status(200).json({ result: userDetail.data });
  } else {
    throw Error("Invalid...");
  }

  // if(!balance.data){
  //   return next(createCustomError(`payment not  suucessful` , 404))
  // }
});
//Create Enaira user
const createCustomer = asyncWrapper(async (req, res) => {
  const threeDigRand = "NXG253648348939" + Math.floor(Math.random() * 660);
  
  let {
    uidType,
    title,
    firstName,
    middleName,
    lastName,
    userName,
    phone,
    emailId,
    postalCode,
    city,
    address,
    countryOfResidence,
    accountNumber,
    dateOfBirth,
    countryOfBirth,
    password,
  } = req.body;
  // function isNumeric(n) {
  //   return !isNaN(parseFloat(n)) && isFinite(n);
  // }
  // function customTier(nin, bvn, custom) {
  //   if (isNumeric(nin) == true) {
  //     custom = "1";
  //     console.log(custom);
  //   } else if (isNumeric(bvn) == true) {
  //     custom = "2";
  //     console.log(custom);
  //   } else {
  //     return (custom = "");
  //   }
  // }
  // customTier();

  const customer = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://rgw.k8s.apis.ng/centric-platforms/uat/enaira-user/CreateConsumerV2",

    data: {
      uid: "2214297660969",
      uidType,
      title,
      firstName,
      middleName,
      lastName,
      userName,
      phone,
      emailId,
      postalCode,
      city,
      address,
      countryOfResidence,
      accountNumber,
      dateOfBirth,
      countryOfBirth,
      password,
      tier:"2",
      remarks:"Passed",
      referralCode:"@imbah.01",
      reference: threeDigRand,
      channelCode: "APISNG",
    },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache",
      ClientId: process.env.CLIENT_ID,
      // httpsAgent: agent
    },
  });

  if (customer.statusText === "OK") {
    res.status(200).json({ result: customer.data });
  } else {
    return next(createCustomError(`payment not  suucessful`, 404));
  }
});

//E-naira Login --ok
const userLogin = asyncWrapper(async (req, res) => {
  const { user_id, password } = req.body;
  const details = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://rgw.k8s.apis.ng/centric-platforms/uat/CAMLLogin",
    data: {
      user_id,
      password,
      allow_tokenization: "Y",
      user_type: "USER",
      channel_code: "APISNG",
    },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache",
      ClientId: process.env.CLIENT_ID,
      // httpsAgent: agent
    },
  });

  if (details.statusText === "OK") {
    if (details.data.response_data.token !== "") {
      req.user = details.data.response_data.token;
      res.status(200).json({ result: details.data });
    }
  } else {
    return next(
      createCustomError(
        `Sorry the User with the phone number ${phone_number} wasn't retrieved`,
        404
      )
    );
  }
});

//Retrieve User by phone {enaira user} -ok
const getUserByPhone = asyncWrapper(async (req, res) => {
  const { phone_number } = req.body;
  const userDetail = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://rgw.k8s.apis.ng/centric-platforms/uat/enaira-user/GetUserDetailsByPhone",
    data: { phone_number, user_type: "USER", channel_code: "APISNG" },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache",
      ClientId: process.env.CLIENT_ID,
      // httpsAgent: agent
    },
  });

  if (userDetail.statusText === "OK") {
    res.status(200).json({ result: userDetail.data });
  } else {
    return next(
      createCustomError(
        `Sorry the User with the phone number ${phone_number} wasn't retrieved`,
        404
      )
    );
  }
});

//Transfer to wallet
const sendToWallet = asyncWrapper(async (req, res) => {
  const threeDigRand = "NXG253648348939" + Math.floor(Math.random() * 660);
  const {
    destination_wallet_alias,
    amount,
    user_email,
    narration,
    user_token,
  } = req.body;
  const details = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://rgw.k8s.apis.ng/centric-platforms/uat/PaymentFromWallet",
    data: {
      destination_wallet_alias,
      amount,
      user_email,
      user_type: "USER",
      narration,
      user_token,
      reference: threeDigRand,
      channel_code: "APISNG",
    },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache",
      ClientId: process.env.CLIENT_ID,
      // httpsAgent: agent
    },
  });
  if (details.statusText === "OK") {
    res.status(200).json({ result: details.data });
  } else {
    throw Error;
  }
});

//Admin endpoints

module.exports = {
  getPayment,
  sendToWallet,
  getBalance,
  createCustomer,
  getUserByPhone,
  userLogin,
};
