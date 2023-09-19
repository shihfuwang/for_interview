use for_interview;

-- ↓ add member_Info ↓ --------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE member_Info (
    member_ID CHAR(5) PRIMARY KEY,
    account VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
    birthday DATE,
    gender boolean,
    account_status BOOLEAN DEFAULT 0,
    point int DEFAULT 0,
    administer boolean DEFAULT 0,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastUpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lastLoginDate DATETIME
);

DELIMITER //
CREATE TRIGGER BeforeInsertTrigger
BEFORE INSERT ON member_Info
FOR EACH ROW
BEGIN
    DECLARE new_ID VARCHAR(5);
    DECLARE newS_ID INT;
    DECLARE newA_ID INT;
    
    -- 计算 S 类型的尾数
    IF NEW.administer = 1 THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(member_ID, 2) AS UNSIGNED)), 0) + 1 INTO newS_ID FROM member_Info WHERE SUBSTRING(member_ID, 1, 1) = 'S';
    ELSE
        SELECT IFNULL(MAX(CAST(SUBSTRING(member_ID, 2) AS UNSIGNED)), 0) + 1 INTO newA_ID FROM member_Info WHERE SUBSTRING(member_ID, 1, 1) = 'A';
    END IF;

    -- 设置新的 memberID
    IF NEW.administer = 1 THEN
        SET new_ID = CONCAT('S', LPAD(newS_ID, 4, '0'));
    ELSE
        SET new_ID = CONCAT('A', LPAD(newA_ID, 4, '0'));
    END IF;

    SET NEW.member_ID = new_ID;
END;
//
DELIMITER ;

-- ↑ add member_Info ↑ --------------------------------------------------------------------------------------------------------------------------------------

-- ↓ add scene_data ↓ --------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE scene_data (
id INT AUTO_INCREMENT PRIMARY KEY,
scene_key varchar(255) not null,
monster_drop_money int not null,
monster_drop_exp int not null,
get_resource_time int not null,
hang_up_money_min int not null,
hang_up_money_max int not null,
hang_up_dart int not null,
store_for_dart int not null,
store_for_heart int not null,
spawn_enemy_time int not null,
player_invincible_time int not null,
b_mushroom_punish int not null,
b_mushroom_award int not null,
g_mushroom_award int not null,
box_can_hit_time int not null,
dart_fly_time int not null,
minus_blood int not null
);
ALTER TABLE scene_data ADD INDEX(scene_key);
-- ↑ add scene_data ↑ ----------------

-- ↓ add account_player ↓ --------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE account_player (
id INT AUTO_INCREMENT PRIMARY KEY,
member_ID CHAR(5) not null,
player_name varchar(20) not null,
level int default 1 ,
current_hp int default 5,
max_hp int default 5,
current_exp int default 0,
max_exp int default 20,
money int default 0,
dart_count int default 5,
scene_key varchar(255) not null,
position_x Float default 73,
position_y Float default 520,
last_direction varchar(5) default "right",
FOREIGN KEY (member_ID) REFERENCES member_Info(member_ID),
FOREIGN KEY (scene_key) REFERENCES scene_data(scene_key)
);
-- ↑ add member_Info ↑ --------------------------------------------------------------------------------------------------------------------------------------

-- add scene_data------------------------------------------------------------------------
insert into scene_data( scene_key, monster_drop_money, monster_drop_exp,get_resource_time, hang_up_money_min,hang_up_money_max, hang_up_dart,store_for_dart,store_for_heart,spawn_enemy_time,player_invincible_time,b_mushroom_punish,b_mushroom_award,g_mushroom_award,box_can_hit_time,dart_fly_time,minus_blood) values("scene",20,10,20000,1,9,1,30,500,5000,2000,2,100,50,20000,500,1);

show tables;