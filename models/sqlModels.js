const mysql = require("mysql2/promise");

let con = null;

//連接資料庫
async function connectToMySQL() {
    con = await mysql.createConnection({
        user: "root",
        password: "skw53903718",
        host: "localhost",
        database: "for_interview"
    });
    return con;
}

async function ensureConnection() {
    if (!con) {
        await connectToMySQL();
    }
}

//查詢特定ID資料
async function getPlayerDataByMemberID(memberID) {
   await ensureConnection();

    const [rows] = await con.execute("SELECT * FROM account_player WHERE member_ID = ?", [memberID]);
    return rows;
}

//查詢ID是否重複
async function checkPlayerName(playerName) {
   await ensureConnection();

    const [result] = await con.execute("SELECT player_name FROM account_player WHERE player_name = ?;", [playerName]);
    if (result.length > 0) {
        return { success: false, message: "此名子已有人使用" };
    } else {
        return { success: true };
    }
}

//創建新腳色
async function createNewPlayer(playerName, member_ID) {
   await ensureConnection();

    let scene_key = "scene";
    // console.log(`playerName: ${playerName}`);
    // console.log(`member_ID: ${member_ID}`);
    try {
        const [result] = await con.execute("insert into account_player (player_name,member_ID,scene_key) VALUES (?,?,?) ;", [playerName, member_ID,scene_key]);
        console.log("create player success");
        return { success: true, message: "創建腳色成功" };
    } catch (error) {
        console.error("create error:", error);
        return { success: false, message: "創建腳色失敗" };
    }
}

//尋找某ID資料
async function getPlayerData(playerName) {
   await ensureConnection();

    try {
        const [result] = await con.execute("SELECT * FROM account_player ap left join scene_data sd on sd.scene_key = ap.scene_key  WHERE player_name = ?;", [playerName]);
        return result;
    } catch (error) {
        console.error("create error:", error);
        return [];
    }
}

//更新某ID資料
async function updatePlayerData(name, level, money, dartCount, currentExp, maxExp, currentHp, maxHp, sceneKey, position_x, position_y, lastDirection) {
   await ensureConnection();

    try {
        const [result] = await con.execute("UPDATE account_player SET level = ?,current_hp=?, max_hp =?,current_exp=?,max_exp=?,money =? ,dart_count= ?,scene_key = ?,position_x=?,position_y =?,last_direction=? where player_name = ?;", [level, currentHp, maxHp, currentExp, maxExp, money, dartCount, sceneKey, position_x, position_y, lastDirection, name]);

        return { success: true, message: "已儲存遊戲資料" };
    } catch (error) {
        console.error("update error:", error);
        return { success: false, message: "儲存遊戲資料失敗" };
    }
}

async function updatePlayerDefaultData(playerName) {
   await ensureConnection();

    try {
        const [result] = await con.execute("UPDATE account_player SET level = ?,current_hp=?, max_hp =?,current_exp=?,max_exp=?,money =? ,dart_count= ?,scene_key = ?,position_x=?,position_y =?,last_direction=? where player_name = ?;", [1, 5, 5, 0, 20, 0, 5, "scene", 73, 520, "right", playerName]);
        return { success: true, message: "遊戲資料已刷新" };
    } catch (error) {
        console.error("update error:", error);
        return { success: false, message: "遊戲資料刷新失敗" };
    }0
}

module.exports = {
    connectToMySQL,
    getPlayerDataByMemberID,
    checkPlayerName,
    createNewPlayer,
    getPlayerData,
    updatePlayerData,
    updatePlayerDefaultData,
    ensureConnection
}
