const express = require("express");
const app = express();
const port = 3300;
const routers = require("./routers/index.js");
const session = require("express-session");
const mysql = require("mysql2/promise");
app.use(express.static('public'));

const engine = require("ejs-locals");
app.engine("ejs", engine);
app.set("views", "./views");
app.set('view engine', 'ejs')
const cors = require('cors');
app.use(cors());
const morgan = require('morgan');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,      // 如果你使用HTTPS，則此選項應設置為true
        httpOnly: true,     // 這樣設置將cookie設為httpOnly
        maxAge: 100000 * 60,
    },
    name: "session_ID",
}));

const dbConfig = {
    user: "root",
    password: "",
    host: "localhost",
    database: "for_interview"
};

app.use(express.urlencoded({ extended: true }));  // 解析POST請求的資料

app.use("/", routers);
app.set('views', path.join(__dirname, 'views'));
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    if (process.send) {
        process.send('server-started');
    }
})


















