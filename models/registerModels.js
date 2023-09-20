const mysql = require("mysql2/promise");
const loginModels = require("../models/loginModels");
const sqlModels = require("./sqlModels");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//註冊帳號
async function registerUser(account, password,secPassword, birthday, gender) {
    const con = await sqlModels.ensureConnection();
  
    const currentDate = new Date();
    const birthDate = new Date(birthday);
    if (birthDate > currentDate) {
        return { success: false, message: "生日日期有誤" };
    }

    let [selectResults] = await con.execute("SELECT account FROM member_info WHERE account = ?;", [account]);
    if (selectResults.length > 0) {
        return { success: false, message: "帳號已有人使用" };
    }
    if (password !== secPassword) {
        return { success: false, message: "輸入的密碼不符合" };
    }

    let genderID = "";
    if (gender == "女") {
        genderID = 0;
    }
    if (gender == "男") {
        genderID = 1;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let [Results] = await con.execute("INSERT INTO member_info (account,password,birthday,gender) VALUES (?, ?, ?, ?);", [account, hashedPassword, birthday, genderID]);
        console.error("create success");
        return { success: true, message: "註冊帳號成功" };
    } catch (error) {
        console.error("create error:", error);
        return { success: false, message: "註冊帳號失敗" };
    }
}


module.exports = {
    registerUser
}
