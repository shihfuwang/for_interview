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
2. 使用此專案中的 `for_interview_create.sql` 檔案來建立所需的資料表及預設環境參數。

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


