class scene extends Phaser.Scene {
    constructor() {
        super({ key: "scene" });
        this.playerName = "",
            this.player = null;
        this.platforms = null;
        this.gameOverButton = null;
        this.stones = null;
        this.enemy = null;
        this.playerStopped = false;
        this.leftButtonShown = false;
        this.rightButtonShown = false;
        this.XBiggerThan200 = false;
        this.XBiggerThan658 = false;
        this.XBiggerThan250 = false;
        this.gameOver = false;
        this.store = false;
        this.enemyStop = false;
        this.level = 1;
        this.currentHp = 5;
        this.maxHp = 5;
        this.previousHp = this.currentHp; // 來跟踪上一次的血量
        this.hpImages = []; // 保存血量圖像
        this.lastDirection = "right";
        this.movingRight = false;
        this.currentExp = 0;
        this.maxExp = 100;
        this.expBar = null;
        this.expText = null;
        this.previousExp = this.currentExp; //跟踪上一次的經驗值
        this.playerInvincible = false; // 無敵狀態
        this.dartCount = 10;
        this.monsterDropMoney = 1;
        this.monsterDropExp = 1;
        this.hangUpMoneyMin = 0;
        this.hangUpMoneyMax = 0;
        this.hangUpDart = 1;
        this.storeForDart = 1;
        this.storeForHeart = 1;
        this.spawnEnemyTime = 100;
        this.playerInvincibleTime = 1;
        this.bMushroomPunish = 0;
        this.bMushroomAward = 0;
        this.gMushroomAward = 0;
        this.boxCanHitTime = 1000000;
        this.getResourceTime = 100000;
        this.dartFlyTime = 1;
        this.minusBlood = 1000;
    }

    preload() {   // 載入資源
        this.load.audio('lose', 'music/lose.mp3');
        this.load.audio('jump', 'music/jump.mp3');
        this.load.audio('bgMusic', 'music/bgMusic.mp3');
        this.load.audio('hurt', 'music/hurt.mp3');

        this.load.image("platform", 'images/n_platform.png');
        this.load.image('background', 'images/background.png');
        this.load.image('cloud', 'images/cloud.png');
        this.load.image('s_mountain', 'images/s_mountain.png');
        this.load.image('logoutButton', 'images/out.png');
        this.load.image('storeButton', 'images/store.png');
        this.load.image('showCoin', 'images/showCoin.png');
        this.load.image('gMushroom', 'images/gMushroom.png');
        this.load.image('bMushroom', 'images/bMushroom.png');
        this.load.image('hp', 'images/heart.png');
        this.load.image('lostHp', 'images/lostHeart.png');
        this.load.image("stone", 'images/stone.png');
        this.load.image('ctrlButton', 'images/ctrlButton.png');
        this.load.image('ZButton', 'images/ZButton.png');
        this.load.image('spaceButton', 'images/spaceButton.png');
        this.load.image('rightButton', 'images/rightButton.png');
        this.load.image('leftButton', 'images/leftButton.png');
        this.load.image('attack_right', 'images/4.png');
        this.load.image('attack_left', 'images/2.png');
        this.load.image('dart', 'images/dart.png');
        this.load.image("button", "images/6.png");

        this.load.image('footer', 'images/footer.png');

        this.load.spritesheet('enemy', 'images/monster.png', { frameWidth: 20, frameHeight: 14 });
        this.load.spritesheet('player', 'images/s_all.png', { frameWidth: 18, frameHeight: 14 });
        this.load.spritesheet('box', 'images/all_box.png', { frameWidth: 33, frameHeight: 33 });
    }
    create(data) {   // 資源載入完成，加入遊戲物件及相關設定
        this.dartCount = data.dart_count;
        this.lastDirection = data.last_direction;
        this.level = data.level;
        this.currentHp = data.current_hp;
        this.maxHp = data.max_hp;

        this.minusBlood = data.minus_blood;
        this.playerName = data.player_name;
        this.dartFlyTime = data.dart_fly_time;
        this.playerInvincibleTime = data.player_invincible_time;
        this.spawnEnemyTime = data.spawn_enemy_time;
        this.storeForDart = data.store_for_dart;
        this.storeForHeart = data.store_for_heart;
        this.monsterDropMoney = data.monster_drop_money;
        this.monsterDropExp = data.monster_drop_exp;
        this.getResourceTime = data.get_resource_time;
        this.hangUpMoneyMin = data.hang_up_money_min;
        this.hangUpMoneyMax = data.hang_up_money_max;
        this.hangUpDart = data.hang_up_dart;
        this.bMushroomPunish = data.b_mushroom_punish;
        this.bMushroomAward = data.b_mushroom_award;
        this.gMushroomAward = data.g_mushroom_award;
        this.boxCanHitTime = data.box_can_hit_time;

        this.currentExp = data.current_exp;
        this.maxExp = data.max_exp;

        this.displayExperience(this.currentExp, this.maxExp);
        this.expBar = this.add.graphics();

        //設定邊界
        this.physics.world.bounds.width = 850;
        this.physics.world.bounds.height = this.sys.game.config.height;

        //畫面背景
        this.bg = this.add.tileSprite(400, 300, 6000, this.sys.game.config.height, 'background');
        this.bgMusic = this.sound.add('bgMusic', { loop: true });
        this.bgMusic.play();

        //footer設定
        const footerHeight = 50;
        const footerYPosition = this.sys.game.config.height - (footerHeight / 2);
        this.footer = this.physics.add.staticSprite(400, footerYPosition, 'footer');

        //固定背景
        this.cloud = this.add.image(300, 100, 'cloud');
        this.cloud = this.add.image(700, 80, 'cloud');
        this.cloud = this.add.image(1050, 120, 'cloud');
        this.s_mountain = this.add.image(100, 500, 's_mountain').setScale(2);

        //玩家設定
        this.player = this.physics.add.sprite(data.position_x, data.position_y, 'player');
        this.player.setBounce(0); //玩家的彈性為 0
        this.player.setScale(3);
        this.player.setFrame(5);
        this.player.setCollideWorldBounds(true);  // 確保玩家不會掉出邊界

        this.physics.add.collider(this.player, this.footer);

        //box動畫
        this.anims.create({
            key: 'box_change',
            frames: this.anims.generateFrameNumbers('box', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        //box位置
        this.boxs = this.physics.add.staticGroup();

        const boxPositions = [
            { x: 110, y: 100 }
        ];

        this.createBox(boxPositions);

        //石頭位置
        this.stones = this.physics.add.staticGroup();
        this.createStone(700, 525, 6);
        this.createStone(732, 490, 5);
        this.createStone(764, 455, 4);
        this.createStone(796, 420, 3);
        // this.stone.create(500, 525, 'stone');

        //平台位置
        this.platforms = this.physics.add.staticGroup();  //平台加入物理群組
        this.mushrooms = this.physics.add.group();
        this.createPlatform(120, 250, 1);
        this.createPlatform(77, 100, 1);
        this.createPlatform(143, 100, 1);
        this.createPlatform(310, 250, 3);
        this.createPlatform(483, 350, 5);
        this.createPlatform(550, 180, 6);

        //敵人
        this.enemys = this.physics.add.group();
        this.enemy1 = new Enemy(this, 796, 300).setScale(3);
        this.enemys.add(this.enemy1);
        this.physics.add.collider(this.enemys, this.platforms);
        this.physics.add.collider(this.enemys, this.footer);
        this.physics.add.collider(this.enemys, this.stones);
        this.physics.add.overlap(this.player, this.enemys, this.handlePlayerEnemyCollision, null, this);

        //定時器

        this.time.addEvent({
            delay: this.spawnEnemyTime,
            callback: this.spawnEnemy,
            callbackScope: this,  // 函數的上下文
            loop: true  // 無限循環
        });

        //掛機資源
        this.time.addEvent({
            delay: this.getResourceTime,
            callback: this.getResource,
            callbackScope: this,
            loop: true
        });


        //初始化飛鏢
        this.darts = this.physics.add.group({
            defaultKey: 'dart',
            maxSize: this.dartCount
        });

        //碰撞事件
        this.physics.add.collider(this.mushrooms, this.platforms);
        this.physics.add.collider(this.mushrooms, this.footer);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.stones);
        this.physics.add.collider(this.player, this.boxs);
        this.physics.add.collider(this.mushrooms, this.stones, this.handleMushroomStoneCollision, null, this);
        this.physics.add.overlap(this.darts, this.enemys, this.handleDartEnemyCollision, null, this);

        // 創建LEVEL
        this.playerLevelText = this.add.text(data.position_x, data.position_y - 60, "LV :" + data.level, {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center'
        });
        this.playerLevelText.setDepth(1).setOrigin(0.5, 0.5);

        // 創建ID
        this.playerNameText = this.add.text(data.position_x, data.position_y + 40, data.player_name, {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center'
        });
        this.playerNameText.setDepth(1).setOrigin(0.5, 0.5);

        // 血量顯示
        this.displayHealth(this.maxHp, this.currentHp);

        // 計算背景寬度
        const padding = 10;
        this.backgroundWidth = this.playerNameText.width + padding;

        // 繪製背景
        this.backgroundHeight = 20;
        this.nameBackground = this.add.graphics();
        this.nameBackground.fillStyle(0x808080, 1);
        this.nameBackground.fillRect(data.position_x - this.backgroundWidth / 2, data.position_y - 50, this.backgroundWidth, this.backgroundHeight);

        //logoutButton
        let button = this.add.sprite(this.sys.game.config.width - 30, 30, 'logoutButton').setScale(0.5).setInteractive();
        button.setScrollFactor(0);

        button.on('pointerdown', () => {
            this.bgMusic.stop();
            this.tweens.killAll();
            if (!this.gameOver) {
                let result = window.confirm("確定要登出？");
                if (result) {
                    let playerData = {
                        name: data.player_name,
                        level: this.level,
                        currentHp: this.currentHp,
                        maxHp: this.maxHp,
                        currentExp: this.currentExp,
                        maxExp: this.maxExp,
                        money: this.money,
                        dartCount: this.dartCount,
                        sceneKey: this.scene.key,
                        position_x: this.player.x,
                        position_y: this.player.y,
                        lastDirection: this.lastDirection
                    };

                    fetch('/playerLogoutPost', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(playerData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            if (data.success) {
                                window.location.href = "/playerMenu";
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    this.bgMusic.play();
                    this.tweens.resumeAll();
                }
            }

        });

        //商店
        let store = this.add.sprite(this.sys.game.config.width - 60, 28, 'storeButton').setScale(0.5).setInteractive();
        store.setScrollFactor(0);
        store.on('pointerdown', () => {
            if (this.gameOver) {
                return;
            }
            if (!this.store) {
                this.openStore();
            }
        });

        // 錢
        this.coinImage = this.add.sprite(30, 30, 'showCoin').setScale(3);
        this.coinImage.setScrollFactor(0);
        this.coinImage.setDepth(10);

        this.money = data.money;;
        this.moneyText = this.add.text(50, 15, this.money.toString(), {
            fontSize: 30,
            fill: "white"
        });
        this.moneyText.setDepth(10);

        // 飛鏢
        this.dartImage = this.add.sprite(30, 70, 'dart').setScale(1.5);
        this.dartImage.setScrollFactor(0);
        this.dartImage.setDepth(10);

        this.dartCountText = this.add.text(50, 50, this.dartCount.toString(), {
            fontSize: 30,
            fill: "white"
        });
        this.dartCountText.setDepth(10);
        this.dartCountText.setScrollFactor(0);

        //鏡頭
        this.cameras.main.setBounds(0, 0, 850, 304);
        this.cameras.main.startFollow(this.player);
        this.moneyText.setScrollFactor(0);

        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 4 }),
            frameRate: 15,
        });

        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 9 }),
            frameRate: 15,
        });

        this.anims.create({
            key: 'enemy_move',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        // //重疊事件
        this.physics.add.overlap(
            this.player,
            this.mushrooms,
            this.player_touch_mushrooms,
            null,
            this
        );

        //攻擊
        this.attacks = this.physics.add.group();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

        this.cursors = this.input.keyboard.createCursorKeys();  //匯入鍵盤設定
    }

    showLeftButton(x, y, z) {
        if (this.leftButtonShown) return;

        this.leftButtonReference = this.add.image(x, y, 'leftButton').setDepth(10).setScale(z);
        this.tweens.add({
            targets: this.leftButtonReference,
            alpha: 0,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
        this.leftButtonShown = true;
    }

    hideLeftButton() {
        if (this.leftButtonReference) {
            this.leftButtonReference.destroy();
            this.leftButtonReference = null;
            this.leftButtonShown = false;
        }
    }

    showRightButton(x, y, z) {
        if (this.rightButtonShown) return;

        this.rightButtonReference = this.add.image(x, y, 'rightButton').setDepth(10).setScale(z);
        this.tweens.add({
            targets: this.rightButtonReference,
            alpha: 0,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
        this.rightButtonShown = true;
    }

    hideRightButton() {
        if (this.rightButtonReference) {
            this.rightButtonReference.destroy();
            this.rightButtonReference = null;
            this.rightButtonShown = false;
        }
    }

    //產出平台
    createPlatform(startX, startY, length) {
        const platformWidth = 30;
        let currentX = startX;

        for (let i = 0; i < length; i++) {
            this.platforms.create(currentX, startY, 'platform');
            currentX += platformWidth;
        }
    }

    //產出石頭
    createStone(startX, startY, length) {
        const stoneWidth = 32;
        let currentX = startX;

        for (let i = 0; i < length; i++) {
            this.stones.create(currentX, startY, 'stone');
            currentX += stoneWidth;
        }
    }
    //產生香菇
    createMushroom(x, y, mushroomType) {
        let mushroom = this.mushrooms.create(x, y, mushroomType);
        mushroom.setVisible(false);  // 隱藏香菇
        mushroom.setDepth(5);

        this.tweens.add({
            targets: mushroom,
            y: y - 32,
            ease: 'Linear',  // 動畫效果
            duration: 500,
            repeat: 0,
            yoyo: false,
            onStart: () => {
                mushroom.setVisible(true);
            },
            onComplete: () => {
                mushroom.setVelocityX(100);
            }
        });
    }

    //產生box
    createBox(boxPositions) {
        for (let position of boxPositions) {
            let box = this.boxs.create(position.x, position.y, 'box');
            box.body.allowGravity = false;  // 不受重力影響
            box.play('box_change');
            box.originalY = position.y;
            box.setDepth(10);
            box.mushroomCreated = false;
        }
    }
    player_touch_mushrooms(player, mushroom) {
        let effectText;
        if (mushroom.texture.key === 'bMushroom') {
            this.currentHp -= this.bMushroomPunish;
            this.money += this.bMushroomAward;
            effectText = this.add.text(player.x, player.y - 50, 'HP - ' + this.bMushroomPunish + '\n$ + ' + this.bMushroomAward, {
                fontSize: '32px',
                fill: '#ff0000'
            });
        } else if (mushroom.texture.key === 'gMushroom') {
            this.money += this.gMushroomAward;
            effectText = this.add.text(player.x, player.y - 50, '$ + ' + this.gMushroomAward, {
                fontSize: '32px',
                fill: '#00FF00'
            });
        }

        mushroom.disableBody(true, true);

        this.tweens.add({
            targets: effectText,
            y: player.y - 100,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                effectText.destroy();
            }
        });
    }

    //顯示經驗值
    displayExperience(currentExp, maxExp) {
        // 定義經驗條的寬度和高度
        const barWidth = 200;
        const barHeight = 20;

        // 計算經驗條的起始位置，這將使其固定在鏡頭的右下角
        const startPositionX = this.sys.game.config.width - barWidth - 20;
        const startPositionY = this.sys.game.config.height - barHeight - 20;

        // 繪製背景條
        let backgroundBar = this.add.graphics().setDepth(5);
        backgroundBar.fillStyle(0x000000, 1);
        backgroundBar.fillRect(startPositionX, startPositionY, barWidth, barHeight);

        // 更新經驗文字
        if (this.expText) {
            this.expText.destroy();
        }

        this.expText = this.add.text(startPositionX + barWidth / 2, startPositionY + barHeight / 2, `${currentExp} / ${maxExp}`, {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5).setDepth(10);

        // 確保背景條和文字都固定在鏡頭上，不隨鏡頭移動
        backgroundBar.setScrollFactor(0);
        this.expText.setScrollFactor(0);
    }

    handleMushroomStoneCollision(mushroom, stone) {
        if (mushroom.body.velocity.x == 0 || mushroom.body.velocity.x < 0) {
            mushroom.setVelocityX(-100);
        }
    }

    displayHealth(maxHp, currentHp) {
        const hpWidth = 30;
        const hpHeight = 24;
        const maxPerRow = 10;
        const totalRows = Math.ceil(maxHp / maxPerRow);
        const totalWidth = hpWidth * Math.min(maxHp, maxPerRow);
        const startPositionX = ((this.sys.game.config.width - totalWidth) / 2) + 30;
        const startPositionY = 15;

        // 清除之前的血量顯示
        this.clearHealthDisplay();

        for (let i = 0; i < maxHp; i++) {
            let row = Math.floor(i / maxPerRow);
            let col = i % maxPerRow;
            let x = startPositionX + col * hpWidth;
            let y = startPositionY + row * hpHeight;

            let hpImage;
            if (i < currentHp) {
                hpImage = this.add.image(x, y, 'hp').setDepth(1).setScrollFactor(0);
            } else {
                hpImage = this.add.image(x, y, 'lostHp').setScrollFactor(0);
            }
            this.hpImages.push(hpImage); // 將每個血量圖像的引用保存起來
        }
    }

    clearHealthDisplay() {
        for (let image of this.hpImages) {
            image.destroy();
        }
        this.hpImages = [];
    }

    update() {   // 遊戲狀態更新
        // console.log(this.player.x, this.player.y);

        // 敵人移動
        if (this.enemyStop) {
            for (let enemy of this.enemys.getChildren()) {
                enemy.setVelocity(0, 0);
                enemy.anims.stop();
            }
            return;
        } else {
            for (let enemy of this.enemys.getChildren()) {
                if (enemy.stopped) {
                    enemy.setVelocity(0, 0);
                    enemy.anims.stop();
                    continue;
                }
                if (!enemy || !enemy.body) continue;

                if (!enemy.movingRight) {
                    enemy.setVelocity(-50, 0);
                    if (enemy.x <= 30) {
                        enemy.movingRight = true;
                    }
                }
                else if (enemy.movingRight) {
                    enemy.setVelocity(50, 0);
                    if (enemy.x >= 650) {
                        enemy.movingRight = false;
                    }
                }
                enemy.anims.play("enemy_move", true);
            }
        }

        // 更新等級和玩家名稱的位置
        this.playerNameText.setPosition(this.player.x, this.player.y + 40);
        this.playerLevelText.setPosition(this.player.x, this.player.y - 60);

        // 玩家名稱背景和文本刷新位置
        this.nameBackground.clear();  // 清除先前的繪圖
        this.nameBackground.fillStyle(0x808080, 1);
        this.nameBackground.fillRect(
            this.player.x - this.backgroundWidth / 2,
            this.player.y + 30,
            this.backgroundWidth,
            this.backgroundHeight
        );

        //射飛鏢
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.shootDart();
        }

        //刷新經驗值
        if (this.currentExp !== this.previousExp) {
            this.displayExperience(this.currentExp, this.maxExp);
            this.previousExp = this.currentExp;
        }

        //升級邏輯
        if (this.currentExp >= this.maxExp) {
            this.level++;
            this.currentExp = 0;
            this.maxExp *= 2;
            this.currentHp = this.maxHp;

            if (this.level % 5 === 0) {
                this.maxHp += 1;
                this.currentHp = this.maxHp;
            }

            // 更新顯示的等級和血量文字
            this.playerLevelText.setText("LV :" + this.level);
            this.displayHealth(this.maxHp, this.currentHp);

            let levelUpText = this.add.text(this.player.x, this.player.y - 50, 'LEVEL UP', {
                font: '24px Arial',
                fill: '#FFFF00',
                align: 'center'
            });
            this.tweens.add({
                targets: levelUpText,
                alpha: 0,
                y: this.player.y - 80,
                duration: 2000,
                onComplete: function () {
                    levelUpText.destroy();
                }
            });
        }

        //start show left right
        if (this.player.x > 200 && this.XBiggerThan200) {
            this.hideRightButton();
            this.hideLeftButton();
            this.XBiggerThan200 = false;
        }
        if (this.player.x < 200 && !this.XBiggerThan200 && this.player.y == 520) {
            this.showLeftButton(50, 430, 1);
            this.showRightButton(100, 430, 1);
            this.XBiggerThan200 = true;
        }

        //start show space
        if (this.player.x > 658 && this.XBiggerThan658 || this.player.x < 450) {
            if (this.spaceButton) {
                this.spaceButton.destroy();
                this.XBiggerThan658 = false;
            }
        }
        if (this.player.x < 658 && this.player.x > 550 && this.player.y >= 520 && !this.XBiggerThan658) {
            this.spaceButton = this.add.image(600, 430, 'spaceButton').setDepth(10);
            this.tweens.add({
                targets: this.spaceButton,
                alpha: 0,
                duration: 300,
                yoyo: true,
                repeat: -1
            });
            this.XBiggerThan658 = true;
        }

        //showCtrl
        if (this.player.x > 400 && this.XBiggerThan250 || this.player.x < 250) {
            if (this.ctrlButton) {
                this.ctrlButton.destroy();
                this.XBiggerThan250 = false;
            }
        }
        if (this.player.x < 400 && this.player.x > 250 && this.player.y >= 520 && !this.XBiggerThan250) {
            this.ctrlButton = this.add.image(330, 430, 'ctrlButton').setDepth(4);
            this.tweens.add({
                targets: this.ctrlButton,
                alpha: 0,
                duration: 300,
                yoyo: true,
                repeat: -1
            });
            this.XBiggerThan250 = true;
        }

        //檢查血量
        if (this.currentHp <= 0) {
            this.time.delayedCall(100, () => {
                this.triggerGameOver();
            })
        }

        //錢
        this.moneyText.setText(this.money.toString());

        if (this.gameOver) {
            this.player.anims.stop();
            this.player.setFrame(10);
            return;
        }

        //刷新飛鏢數量
        this.dartCountText.setText(this.dartCount.toString());

        //刷新血量
        if (this.currentHp !== this.previousHp) {
            this.displayHealth(this.maxHp, this.currentHp);
            this.previousHp = this.currentHp;
        }

        //重力
        this.player.body.gravity.y = 1000
        this.enemys.getChildren().forEach((enemy) => {
            enemy.body.gravity.y = 10000;
        });

        // 跟隨玩家的速度滾動背景
        this.footer.tilePositionX += this.player.body.velocity.x * 0.015;
        this.bg.tilePositionX += this.player.body.velocity.x * 0.015;  // 0.015 是滾動速度的調整值。

        if (this.playerStopped) {
            this.player.setVelocity(0, 0);
            this.player.setFrame(5);
            return;
        }

        if (!this.playerStopped) {
            // 處理方向
            if (this.cursors.left.isDown) {
                this.lastDirection = 'left';
            } else if (this.cursors.right.isDown) {
                this.lastDirection = 'right';
            }

            // 處理跳躍
            if (this.cursors.space.isDown && this.player.body.onFloor()) {
                if (this.lastDirection === 'left') {
                    this.player.setFrame(1);
                    this.player.setVelocityY(-500);
                    this.sound.play('jump');
                } else if (this.lastDirection === 'right') {
                    this.player.setFrame(6);
                    this.player.setVelocityY(-500);
                    this.sound.play('jump');
                }
            }

            // 如果玩家在空中
            if (!this.player.body.onFloor()) {
                this.player.anims.stop();
                if (this.lastDirection === 'left') {
                    this.player.setFrame(1);
                } else if (this.lastDirection === 'right') {
                    this.player.setFrame(6);
                }
            } else {
                // 玩家在地上，顯示站立的圖片框
                if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                    if (this.lastDirection === 'left') {
                        this.player.setFrame(0);
                    } else if (this.lastDirection === 'right') {
                        this.player.setFrame(5);
                    }
                }
            }

            // 處理移動
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-200);
                if (this.player.body.onFloor()) {
                    this.player.anims.play("walk_left", true);
                }
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(200);
                if (this.player.body.onFloor()) {
                    this.player.anims.play("walk_right", true);
                }
            } else {
                if (this.player.body.onFloor()) {
                    this.player.setVelocityX(0);
                }
            }

            this.boxs.getChildren().forEach(box => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), box.getBounds())) {
                    // 確保該箱子可以撞
                    if (box.canBeHit !== false) {
                        // 玩家的頂部碰到箱子的底部
                        if (this.player.y - this.player.height / 2 > box.y + box.height / 2 && !box.mushroomCreated) {
                            // 隨機生成蘑菇
                            const mushroomType = Phaser.Math.Between(1, 2) === 1 ? 'gMushroom' : 'bMushroom';
                            this.createMushroom(box.x, box.y, mushroomType);

                            box.mushroomCreated = true;
                            box.anims.stop();
                            box.setFrame(3);
                            box.canBeHit = false;

                            this.time.delayedCall(this.boxCanHitTime, () => {
                                box.mushroomCreated = false;
                                box.play('box_change');
                                box.canBeHit = true;
                            });
                        }
                    }
                }
            });
        }
    }
    triggerGameOver() {
        if (!this.gameOver) {
            this.sound.play('lose');
            this.gameOver = true;
        }

        this.playerStopped = true;
        this.player.setDepth(1000);
        this.player.setFrame(10);
        this.player.setVelocity(0, -600); // 僅垂直上下移動，水平速度為 0

        this.player.body.gravity.y = 3000;

        // 停止所有敵人的動畫
        this.enemys.getChildren().forEach(enemy => {
            enemy.anims.stop();
            enemy.setVelocity(0, 0);
        });

        // 移除所有與玩家相關的碰撞
        this.physics.world.colliders.getActive().forEach(function (collider) {
            if (collider.object1 === this.player || collider.object2 === this.player) {
                collider.destroy();
            }
        }, this);

        this.player.body.setCollideWorldBounds(false);
        this.bgMusic.stop();
        this.tweens.killAll();

        if (!this.gameOverBackground) {
            this.gameOverBackground = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'button')
                .setScale(2)
                .setDepth(9)
                .setScrollFactor(0)
                .setOrigin(0.5, 0.5);
        }

        if (!this.gameOverText) {
            this.gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
                fontSize: '50px',
                fill: '#ff0000',
                align: 'center'
            })
                .setDepth(10)
                .setScrollFactor(0)
                .setInteractive({ useHandCursor: true })
                .setOrigin(0.5, 0.5);

            this.gameOverText.on('pointerdown', () => {
                let playerData = {
                    name: this.playerName,
                };

                fetch('/gameOverPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(playerData)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = "/playerMenu";
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
    }
    shootDart() {
        let dart;
        if (this.dartCount <= 0) {
            let alertText = this.add.text(this.player.x, this.player.y - 20, 'Not enough dart!', {
                fontSize: '24px',
                fill: '#ff0000',
                align: 'center'
            });
            this.tweens.add({
                targets: alertText,
                alpha: 0,
                y: this.player.y - 40,
                duration: 1000,
                onComplete: () => {
                    alertText.destroy();
                }
            });
            return;
        }
        if (this.lastDirection === "right") {
            dart = this.darts.create(this.player.x, this.player.y, 'attack_right');
            dart.setVelocityX(300);
        } else if (this.lastDirection === "left") {
            dart = this.darts.create(this.player.x, this.player.y, 'attack_left');
            dart.setVelocityX(-300);
        }
        this.dartCount--;
        if (dart) {
            dart.body.allowGravity = false;
            dart.setScale(1);
            this.time.delayedCall(1000, () => {
                dart.destroy();
            });
        }
    }
    openStore() {
        this.store = true;
        this.playerStopped = true;
        this.enemyStop = true;
        // 創建一個半透明的背景
        this.storeBackground = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.75 } });
        this.storeBackground.fillRect(150, 150, this.sys.game.config.width - 300, this.sys.game.config.height - 300);
        this.storeBackground.setScrollFactor(0).setDepth(5);

        // 創建購買飛鏢的按鈕和文本
        let buyDartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 50, '      Dart $' + this.storeForDart + '   ', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#00ff00',
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
            align: 'center',
        })
            .setDepth(5)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScrollFactor(0);
        let dartImage = this.add.image(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2 - 50, 'dart');
        dartImage.setScale(1).setScrollFactor(0).setDepth(6); // 調整大小，根據需要

        // 點擊購買飛鏢的事件
        buyDartButton.on('pointerdown', () => {
            if (this.money >= this.storeForDart) {
                this.money -= this.storeForDart;
                this.dartCount++;
                this.moneyText.setText(this.money.toString());
                this.dartCountText.setText(this.dartCount.toString());
                let alertText = this.add.text(this.sys.game.config.width / 2 - 50, this.sys.game.config.height / 2 - 10, 'success!', {
                    fontSize: '24px',
                    fill: '#ff0000',
                    align: 'center'
                })
                    .setScrollFactor(0)
                    .setDepth(5);
                this.tweens.add({
                    targets: alertText,
                    alpha: 0,
                    y: this.sys.game.config.height / 2 - 10,
                    duration: 1000,
                    onComplete: () => {
                        alertText.destroy();
                    }
                });
            } else {
                let alertText = this.add.text(this.sys.game.config.width / 2 - 115, this.sys.game.config.height / 2 - 10, 'Not enough coins!', {
                    fontSize: '24px',
                    fill: '#ff0000',
                    align: 'center'
                })
                    .setScrollFactor(0)
                    .setDepth(5);
                this.tweens.add({
                    targets: alertText,
                    alpha: 0,
                    y: this.sys.game.config.height / 2 - 10,
                    duration: 1000,
                    onComplete: () => {
                        alertText.destroy();
                    }
                });
            }
        });


        let heartImage = this.add.image(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2 + 50, 'hp');
        heartImage.setDepth(6).setScrollFactor(0);
        const healthPrice = this.storeForHeart;

        let buyHealthButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, '      HP $' + healthPrice + '    ', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#00ff00',
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
            align: 'center'
        })
            .setDepth(5)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScrollFactor(0);

        buyHealthButton.on('pointerdown', () => {

            if (this.money >= healthPrice) {
                this.money -= healthPrice;
                this.currentHp = Math.min(this.currentHp + 1, this.maxHp);
                this.moneyText.setText(this.money.toString());
                this.displayHealth(this.maxHp, this.currentHp);
                let alertText = this.add.text(this.sys.game.config.width / 2 - 50, this.sys.game.config.height / 2 - 10, 'success!', {
                    fontSize: '24px',
                    fill: '#ff0000',
                    align: 'center'
                })
                    .setScrollFactor(0)
                    .setDepth(5);
                this.tweens.add({
                    targets: alertText,
                    alpha: 0,
                    y: this.sys.game.config.height / 2 - 10,
                    duration: 1000,
                    onComplete: () => {
                        alertText.destroy();
                    }
                })
            } else {
                let alertText = this.add.text(this.sys.game.config.width / 2 - 115, this.sys.game.config.height / 2 - 10, 'Not enough coins!', {
                    fontSize: '24px',
                    fill: '#ff0000',
                    align: 'center'
                })
                    .setScrollFactor(0)
                    .setDepth(5);
                this.tweens.add({
                    targets: alertText,
                    alpha: 0,
                    y: this.sys.game.config.height / 2 - 10,
                    duration: 1000,
                    onComplete: () => {
                        alertText.destroy();
                    }
                });
            }
        });

        // 閉店的按鈕
        let closeButton = this.add.text(this.sys.game.config.width - 180, 180, 'X', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            align: 'center'
        })
            .setDepth(5)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScrollFactor(0);

        closeButton.on('pointerdown', () => {
            this.storeBackground.clear();
            buyDartButton.destroy();
            closeButton.destroy();
            buyHealthButton.destroy();
            dartImage.destroy();
            heartImage.destroy();
            this.store = false;
            this.playerStopped = false;
            this.enemyStop = false;
        });
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!this.playerInvincible) {
            this.currentHp -= this.minusBlood;

            let damageText = this.add.text(this.player.x, this.player.y - 20, '-' + this.minusBlood, {
                fontSize: '24px',
                fill: '#ff0000',
                align: 'center'
            });
            this.tweens.add({
                targets: damageText,
                alpha: 0,
                y: this.player.y - 40,
                duration: 2000,
                onComplete: () => {
                    damageText.destroy();
                }
            });

            if (this.currentHp <= 0) {
                this.triggerGameOver();
            } else {
                // 無敵狀態
                this.playerInvincible = true;

                this.tweens.add({
                    targets: this.player,
                    alpha: 0.5,
                    duration: 200,
                    yoyo: true,  // 使其在達到目標後返回原始狀態
                    repeat: 5,
                    onComplete: () => {
                        this.player.alpha = 1;
                    }
                });

                // 2秒後取消無敵狀態
                this.time.delayedCall(this.playerInvincibleTime, () => {
                    this.playerInvincible = false;
                }, [], this);
            }
        }
        this.displayHealth(this.maxHp, this.currentHp);
    }
    handleDartEnemyCollision(dart, enemy) {
        // 確保敵人和飛鏢都是有效的
        if (!enemy || !dart) {
            return;
        }

        // 立即停止該敵人的移動和動畫
        enemy.setVelocity(0, 0);
        enemy.anims.stop();
        enemy.stopped = true;
        this.time.delayedCall(1, () => {
            enemy.setFrame(2);
        });

        // 一秒後，敵人和飛鏢消失
        this.time.delayedCall(this.dartFlyTime, () => {
            if (this.enemys.contains(enemy)) {
                dart.destroy();
                enemy.destroy();
                this.enemyStop = false;
                this.money += this.monsterDropMoney;
                this.currentExp += this.monsterDropExp;

                // 顯示 $+20 文字
                let moneyText = this.add.text(enemy.x, enemy.y - 20, '$ +' + this.monsterDropMoney, {
                    font: '24px Arial',
                    fill: '#00FF00',
                    align: 'center'
                });
                this.tweens.add({
                    targets: moneyText,
                    alpha: 0,
                    y: enemy.y - 50,
                    duration: 2000,
                    onComplete: function () {
                        moneyText.destroy();
                    }
                });

                // 顯示 EXP+10 文字
                let expText = this.add.text(enemy.x, enemy.y, 'EXP + ' + this.monsterDropExp, {
                    font: '24px Arial',
                    fill: '#0000FF',
                    align: 'center'
                });
                this.tweens.add({
                    targets: expText,
                    alpha: 0,
                    y: enemy.y - 50,
                    duration: 2000,
                    onComplete: function () {
                        expText.destroy();
                    }
                });
            }
        });
    }
    // 用於創建敵人的函數
    spawnEnemy() {
        let randomX = Phaser.Math.Between(0, 796);
        let randomY = Phaser.Math.Between(0, 520);
        if (!this.playerStopped) {
            let enemy = new Enemy(this, randomX, randomY).setScale(3);
            enemy.movingRight = true;
            this.enemys.add(enemy);  // 使用 Group 的 add 方法
            this.physics.add.collider(enemy, this.platforms);
            this.physics.add.collider(enemy, this.footer);
            this.physics.add.collider(enemy, this.stones);
            this.physics.add.overlap(this.player, enemy, this.handlePlayerEnemyCollision, null, this);
        }
    }
    getResource() {
        let hangUpMoney = Phaser.Math.Between(this.hangUpMoneyMin, this.hangUpMoneyMax);
        // console.log(hangUpMoney);
        if (!this.playerStopped) {
            this.money += hangUpMoney;
            this.dartCount += this.hangUpDart;
            let moneyText = this.add.text(this.player.x, this.player.y - 80, '$ + ' + hangUpMoney, {
                font: '24px Arial',
                fill: '#FFFF00',
                align: 'center'
            });
            this.tweens.add({
                targets: moneyText,
                alpha: 0,
                y: this.player.y - 120,
                duration: 2000,
                onComplete: function () {
                    moneyText.destroy();
                }
            });
            let dartText = this.add.text(this.player.x, this.player.y - 50, 'Dart + ' + this.hangUpDart, {
                font: '24px Arial',
                fill: '#FFFF00',
                align: 'center'
            });
            this.tweens.add({
                targets: dartText,
                alpha: 0,
                y: this.player.y - 120,
                duration: 2000,
                onComplete: function () {
                    dartText.destroy();
                }
            });
        }
    }
}
