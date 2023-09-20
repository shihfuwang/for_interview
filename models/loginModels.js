const mysql = require("mysql2/promise");
const sqlModels =require("./sqlModels");
const bcrypt = require('bcrypt');
const saltRounds = 10; //是用來指定生成雜湊時的工作因子（work factor）的。它實際上表示的是對密碼進行雜湊的迭代次數。這個數字越大，生成雜湊所需的時間就越長。
let con = null;

//查詢資料庫
async function selectMySQL(req, res) {
    await sqlModels.ensureConnection();
    
    let [selectResults] = await con.execute("select account,password from member_info;");
    return selectResults;
}

//比對帳號
async function loginCompare(account, providedPassword) {
    await sqlModels.ensureConnection();
    let [results] = await con.execute("SELECT password FROM member_info WHERE account = ?;", [account]);

    if (results.length === 0) {
        return false; 
    }

    const storedHashedPassword = results[0].password;

    // 比對資料庫中的雜湊密碼和用戶提供的密碼
    const match = await bcrypt.compare(providedPassword, storedHashedPassword);

    return match;
}

async function loginUpdate(req, res) {
    await sqlModels.ensureConnection();

    let [results] = await con.execute("SELECT member_ID FROM member_info WHERE account = ?;", [req.body.account]);
    if (results.length > 0) {
        req.session.memberID = results[0].member_ID;
    }
}

// //檢查登入狀況
async function checkLogin(req, res) {
    if (req.session.memberID) {
        return true;
    } else {
        return false;
    }
}

//清除登入狀態
async function clearSessionID(req, res) {
    req.session.destroy();
}



module.exports = {
    selectMySQL,
    loginCompare,
    loginUpdate,
    checkLogin,
    clearSessionID
}
