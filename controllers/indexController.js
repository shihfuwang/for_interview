const multer = require('multer');
const fs = require('fs');
const sqlModels = require("../models/sqlModels");
const loginModels = require("../models/loginModels");
const registerModels = require("../models/registerModels");
const path = require('path');

const { log } = require('console');

async function login(req, res) {
    res.render("login", { "title": "Login" });
}

async function register(req, res) {
    res.render("register", { "title": "Register" });
}

async function playerMenu(req, res) {
    res.render("playerMenu", { "title": "playerMenu" });
}

async function logout(req, res) {
    let result = await loginModels.clearSessionID(req);
    res.send('<script>alert("成功登出"); window.location.href="/";</script>');
}

async function checkMatch(req, res) {
    let reqPostAccount = req.body.account;
    let resPostPassword = req.body.password;

    let compareResult = await loginModels.loginCompare(reqPostAccount, resPostPassword);
    if (compareResult) {
        await loginModels.loginUpdate(req);
        let isLogin = await loginModels.checkLogin(req);
        if (isLogin) {
            return res.send('<script>alert("登入成功"); window.location.href = "/playerMenu";</script>');
        }
    } else {
        return res.send('<script>alert("登入失敗"); window.location.href = "/";</script>');
    }
}

async function registerAccount(req, res) {
    let reqPost = req.body;
    let reqPostAccount = req.body.account;
    let reqPostPassword = req.body.password;
    let reqPostSecPassword = req.body.secPassword;
    let reqPostBirthday = req.body.birthday;
    let reqPostGender = req.body.gender;

    let registerResult = await registerModels.registerUser(reqPostAccount, reqPostPassword, reqPostSecPassword, reqPostBirthday, reqPostGender);

    if (registerResult.success) {
        return res.send(`<script>alert("${registerResult.message}"); window.location.href = "/";</script>`);
    } else {
        return res.send(`<script>alert("${registerResult.message}"); window.history.back();</script>`);
    }
}

async function createPlayer(req, res) {
    let playerName = req.body.playerName;
    let member_ID = req.session.memberID;

    let checkResult = await sqlModels.checkPlayerName(playerName);
    if (!checkResult.success) {
        return res.send(`<script>alert("${checkResult.message}"); window.history.back();</script>`);
    }

    let createResult = await sqlModels.createNewPlayer(playerName, member_ID);
    if (createResult.success) {
        return res.send(`<script>alert("${createResult.message}"); window.location.href = "/playerMenu";</script>`);
    } else {
        return res.send(`<script>alert("${createResult.message}"); window.history.back();</script>`);
    }
}

async function showPlayerMenu(req, res) {
    const memberID = req.session.memberID;
    if (!memberID) {
        return res.redirect('/');
    }

    const rows = await sqlModels.getPlayerDataByMemberID(memberID);

    return res.render('playerMenu', { players: rows, "title": "角色選單" });
}

async function receivePlayerName(req, res) {
    const playerName = req.body.playerName;

    let searchResult = await sqlModels.getPlayerData(playerName);
    console.log("searchResult----------------------");
    console.log(searchResult);
    if (searchResult.length > 0) {
        return res.json({ message: 'Player data found!', data: searchResult });
    } else {
        return res.json({ message: 'No player data found for the given player name.' });
    }
}

async function receivePlayerLogoutData(req, res) {
    let name = req.body.name;
    let level = req.body.level;
    let money = req.body.money;
    let currentExp = req.body.currentExp;
    let maxExp = req.body.maxExp;
    let currentHp = req.body.currentHp;
    let maxHp = req.body.maxHp;
    let sceneKey = req.body.sceneKey;
    let position_x = req.body.position_x;
    let position_y = req.body.position_y;
    let lastDirection = req.body.lastDirection;
    let dartCount = req.body.dartCount;

    let result = req.body;
    console.log("receivePlayerLogoutData-------------");
    console.log(result);

    let updateResult = await sqlModels.updatePlayerData(name, level, money, dartCount, currentExp, maxExp, currentHp, maxHp, sceneKey, position_x, position_y, lastDirection);

    if (updateResult.success) {
        return res.json({ success: true, message: updateResult.message });
    } else {
        return res.json({ success: false, message: updateResult.message });
    }
}

function game(req, res) {
    res.sendFile('game.html', { root: path.join(__dirname, '../views') });
}

async function gameOverData(req, res) {
    let playerName = req.body.name;
    let updateResult = await sqlModels.updatePlayerDefaultData(playerName);

    if (updateResult.success) {
        return res.json({ success: true, message: updateResult.message });
    } else {
        return res.json({ success: false, message: updateResult.message });
    }

}




module.exports = {
    login,
    logout,
    checkMatch,
    register,
    registerAccount,
    playerMenu,
    createPlayer,
    showPlayerMenu,
    receivePlayerName,
    receivePlayerLogoutData,
    game,
    gameOverData
}