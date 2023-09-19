# for_interview
README: 

這是由Phaser3及js所開發的小遊戲。


###########環境依賴


bcrypt: 5.1.1

body-parser: 1.20.2

cors: 2.8.5

ejs: 3.1.9

ejs-locals: 1.0.2

express: 4.18.2

express-session: 1.17.3

morgan: 1.10.0

mysql2: 3.6.0

electron: 26.2.1

electron-packager: 17.1.2

###########部署步驟

(一)克隆倉庫到本地:

git clone https://github.com/shihfuwang/for_interview.git

(二)進入項目目錄:
cd for_interview

(三)安裝套件:
npm install

(四)資料庫設置:

1. 在資料庫管理系統中，建立一個新的資料庫。
   
3. 使用此專案中的 `for_interview_create.sql` 檔案來建立所需的資料表及預設環境參數。

(五)備置環境設定:

打開sqlModels.js根據您的資料庫設定，修改以下參數:

user: "用戶名",

password: "資料庫名稱",

host: "主機名稱或IP地址",

database: "資料庫名稱

(六) 打包成應用程式:

在終端機中執行以下命令：

npx electron-packager . [YourAppName] --platform=win32,linux --arch=x64 --overwrite

**[YourAppName] 是應用程式的名稱，可根據需求做替換。



###########目錄結構描述


│  app.js                 > 主應用程式入口


│  main.js                > Electron 的主進程


│  package-lock.json      > NPM 的鎖定版本文件


│  package.json           > NPM 的配置文件


│  


├─.vscode


│      settings.json      > VSCode 的設定文件

│      


├─controllers


│      indexController.js > 控制器，處理主頁面的邏輯


│      


├─models


│      loginModels.js     > 登入功能的數據模型


│      registerModels.js  > 註冊功能的數據模型


│      sqlModels.js       > 數據庫連接和配置


│      


├─public


│  │  enemy.js            > 敵人的遊戲設定


│  │  player.js           > 玩家的遊戲設定


│  │  playerHead.png      > 玩家選單角色的頭像圖片


│  │  scene.js            > 遊戲場景及遊戲邏輯


│  │  


│  ├─images               > 存放遊戲內的圖片


│  │   


│  └─music                > 存放遊戲背景音樂和效果音


│        


├─routers


│      index.js           > 主路由配置


│      


├─views


│  │  game.html           > 遊戲的主頁面


│  │  login.ejs           > 登入頁面模板


│  │  playerMenu.ejs      > 玩家菜單頁面模板


│  └─  register.ejs       > 註冊頁面模板


└──node_modules           > 存放所有 NPM 套件的目錄



###########使用說明


左右鍵 - 角色移動

空白鍵 - 角色跳躍

ctrl鍵 - 角色攻擊
