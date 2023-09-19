const express = require("express");
const router = express.Router();
const indexController = require('../controllers/indexController');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", indexController.login);
router.get("/register", indexController.register);
router.get('/playerMenu', indexController.showPlayerMenu);
router.get('/logout', indexController.logout);
router.get('/game', indexController.game);

router.post("/loginPost", indexController.checkMatch);
router.post("/registerPost", indexController.registerAccount);
router.post("/createPlayerPost", indexController.createPlayer);
router.post('/playerNamePost', indexController.receivePlayerName);
router.post('/playerLogoutPost', indexController.receivePlayerLogoutData);
router.post('/gameOverPost', indexController.gameOverData);

module.exports = router;



