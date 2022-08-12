const express = require('express')
const router = express.Router();
const {
    getPayment,
    getBalance,
    createCustomer,
    getUserByPhone,
    userLogin,
    sendToWallet

}  = require('../controllers/transact')


router.post('/payment', getPayment);
router.post('/balance', getBalance);
router.post('/createcustomer', createCustomer);
router.post('/getuserbyphone', getUserByPhone);
router.post('/userlogin', userLogin);
router.post('/sendtowallet', sendToWallet);



module.exports = router;