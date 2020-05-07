/**
 * GAME.JS
 * Contains all Phaser functions
 * @author Sam Shannon
 * @author Jaedon Braun
 * @author Eddy Wu
 */


/** Phaser configuration. */
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "my-game",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

/** Phaser instance. */
var game = new Phaser.Game(config);
/** Array of all enemies. */
var enemyArray = [];

/** Pre-loads necessary resources, like images. */
function preload() {
    this.load.image('background', 'images/floor.jpg');
    this.load.image('wall1', 'images/wall1.png');
    this.load.image('wall2', 'images/wall2.png');
    this.load.image('aisle1', 'images/aisle1.png');
    this.load.image('dpad1', 'images/dpad1.png');
    this.load.image('dpad2', 'images/dpad2.png');
    this.load.image('dpad3', 'images/dpad3.png');
    this.load.image('dpad4', 'images/dpad4.png');
    this.load.image('dpad5', 'images/dpad5.png');
    this.load.image('dpad6', 'images/dpad6.png');
    this.load.audio('background-music', ['audio/1.mp3', 'audio/1.ogg']);
    this.load.spritesheet('dude',
        'images/mario.png', {
            frameWidth: 32,
            frameHeight: 48
        }
    );
    this.load.spritesheet('enemy',
        'images/trump_run_resized.png', {
            frameWidth: 66.66666666666666,
            frameHeight: 66.75,
        }
    );

    this.load.spritesheet('food',
        'images/food.png', {
            frameWidth: 49,
            frameHeight: 49

        }
    );

}

var enemy;
var walls;
var score = 0;
var scoreText;
var gameOverText;
var dpadUp;
var dpadRight;
var dpadDown;
var dpadLeft;
var dpadUpRight;
var dpadDownRight;
var dpadDownLeft;
var dpadUpLeft;
var moveUp = false;
var moveLeft = false;
var moveDown = false;
var moveRight = false;
var dpad;
var music;


/** Called once at the start of the game. Use this to build objects. */
function create() {

    // Initializes the shopping list.
    initList();

    this.add.image(600, 400, 'background').setScale(6);
    walls = this.physics.add.staticGroup();

    walls.create(600, 790, 'wall1');
    walls.create(600, 10, 'wall1');
    walls.create(1190, 400, 'wall2');
    walls.create(10, 400, 'wall2');
    aisles = this.physics.add.staticGroup({
        key: 'aisle1',
        repeat: 8,
        setXY: {
            x: 120,
            y: 375,
            stepX: 120
        }
    });
    
    

    

    player = this.physics.add.sprite(40, 700, 'dude');

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{
            key: 'dude',
            frame: 4
        }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, aisles);

    // Section that adds food to the map.
    food = this.physics.add.staticGroup();
    var h = 45;
    var w = 60;
    var foodcount = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 13; j++) {
            food.create(w, h, 'food', foodcount);
            foodcount += 1;
            h += 50;
            if (foodcount > 99) {
                foodcount = 0;
            }
        }
        w += 120;
        h = 45;
    }

    // Adds a Food object to the food collectibles.
    let foodChildren = food.getChildren();
    for (let i = 0; i < foodChildren.length; i++) {
        foodChildren[i].setDataEnabled();
        let food = new Food(i);
        //console.log(" " + food.getName());
        foodChildren[i].setData("food", food);

    }

    enemies = this.physics.add.group();
    this.physics.add.collider(player, enemies);
    this.physics.add.collider(enemies, enemies);
    this.physics.add.collider(enemies, walls);
    this.physics.add.collider(enemies, aisles);

    var i;
    for (i = 0; i < 11; i++) {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(100, 500);
        var enemy = enemies.create(x, y, 'enemy');
        enemy.setCollideWorldBounds(true);
        enemyArray.push(enemy);
    }

    this.anims.create({
        key: 'eRight',
        frames: this.anims.generateFrameNumbers('enemy', {
            start: 6,
            end: 11
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'eLeft',
        frames: this.anims.generateFrameNumbers('enemy', {
            start: 18,
            end: 23
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'eUp',
        frames: this.anims.generateFrameNumbers('enemy', {
            start: 12,
            end: 17
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'eDown',
        frames: this.anims.generateFrameNumbers('enemy', {
            start: 0,
            end: 5
        }),
        frameRate: 10,
        repeat: -1
    });


    this.physics.add.overlap(player, food, collectFood, null, this);

    scoreText = this.add.text(20, 20, 'Score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    gameOverText = this.add.text(600, 400, "You Win!", {
        fontSize: "50px",
        fill: "#000"
    });
    
    
    gameOverText.setOrigin(0.5);
    gameOverText.visible = false;

    dpad = this.physics.add.group();
    createDpad();
    
    
}

var count = 0;

/** Called once every frame. Use for player movement, animations, and anything that needs frequent updating. */
function update() {
    showDpad();
    cursors = this.input.keyboard.createCursorKeys();
    playerMove();


    if (count++ == 100) {
        enemyMove();
        count = 0;
    }
    

}



function createDpad() {

    dpadUp = dpad.create(150, 550, 'dpad2');
    dpadRight = dpad.create(225, 625, 'dpad1');
    dpadDown = dpad.create(150, 700, 'dpad2');
    dpadLeft = dpad.create(75, 625, 'dpad1');
    dpadUpRight = dpad.create(235, 540, 'dpad3');
    dpadDownRight = dpad.create(235, 710, 'dpad4');
    dpadDownLeft = dpad.create(65, 710, 'dpad5');
    dpadUpLeft = dpad.create(65, 540, 'dpad6');

    dpadUp.setInteractive();
    dpadUp.on("pointerover", function () {
        moveUp = true;
    });
    dpadUp.on("pointerout", function () {
        moveUp = false;
    });
    dpadUp.on("pointerdown", function () {
        moveUp = true;
    });
    dpadUp.on("pointerup", function () {
        moveUp = false;
    });

    dpadRight.setInteractive();
    dpadRight.on("pointerover", function () {
        moveRight = true;
    });
    dpadRight.on("pointerout", function () {
        moveRight = false;
    });
    dpadRight.on("pointerdown", function () {
        moveRight = true;
    });
    dpadRight.on("pointerup", function () {
        moveRight = false;
    });

    dpadDown.setInteractive();
    dpadDown.on("pointerover", function () {
        moveDown = true;
    });
    dpadDown.on("pointerout", function () {
        moveDown = false;
    });
    dpadDown.on("pointerdown", function () {
        moveDown = true;
    });
    dpadDown.on("pointerup", function () {
        moveDown = false;
    });

    dpadLeft.setInteractive();
    dpadLeft.on("pointerover", function () {
        moveLeft = true;
    });
    dpadLeft.on("pointerout", function () {
        moveLeft = false;
    });
    dpadLeft.on("pointerdown", function () {
        moveLeft = true;
    });
    dpadLeft.on("pointerup", function () {
        moveLeft = false;
    });
    dpadUpRight.setInteractive();
    dpadUpRight.on("pointerover", function () {
        moveUp = true;
        moveRight = true;
    });
    dpadUpRight.on("pointerout", function () {
        moveUp = false;
        moveRight = false;
    });
    dpadUpRight.on("pointerdown", function () {
        moveUp = true;
        moveRight = true;
    });
    dpadUpRight.on("pointerup", function () {
        moveUp = false;
        moveRight = false;
    });

    dpadDownRight.setInteractive();
    dpadDownRight.on("pointerover", function () {
        moveDown = true;
        moveRight = true;
    });
    dpadDownRight.on("pointerout", function () {
        moveDown = false;
        moveRight = false;
    });
    dpadDownRight.on("pointerdown", function () {
        moveDown = true;
        moveRight = true;
    });
    dpadDownRight.on("pointerup", function () {
        moveDown = false;
        moveRight = false;
    });

    dpadDownLeft.setInteractive();
    dpadDownLeft.on("pointerover", function () {
        moveDown = true;
        moveLeft = true;
    });
    dpadDownLeft.on("pointerout", function () {
        moveDown = false;
        moveLeft = false;
    });
    dpadDownLeft.on("pointerdown", function () {
        moveDown = true;
        moveLeft = true;
    });
    dpadDownLeft.on("pointerup", function () {
        moveDown = false;
        moveLeft = false;
    });

    dpadUpLeft.setInteractive();
    dpadUpLeft.on("pointerover", function () {
        moveUp = true;
        moveLeft = true;
    });
    dpadUpLeft.on("pointerout", function () {
        moveUp = false;
        moveLeft = false;
    });
    dpadUpLeft.on("pointerdown", function () {
        moveUp = true;
        moveLeft = true;
    });
    dpadUpLeft.on("pointerup", function () {
        moveUp = false;
        moveLeft = false;
    });
}

function showDpad() {

    if (window.innerWidth > 500) {
        dpad.getChildren().forEach((dpad) => {
            dpad.visible = false;
        });
    } else {
        dpad.getChildren().forEach((dpad) => {
            dpad.visible = true;
        });
    }
}

function playerMove() {
    if (cursors.left.isDown || moveLeft) {
        player.setVelocityX(-300);

        player.anims.play('left', true);
    } else if (cursors.right.isDown || moveRight) {
        player.setVelocityX(300);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if (cursors.up.isDown || moveUp) {
        player.setVelocityY(-300);
    } else if (cursors.down.isDown || moveDown) {
        player.setVelocityY(300);
    } else {
        player.setVelocityY(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(0);
    }
}

function enemyMove() {
    var i;
    for (i = 0; i < enemyArray.length; i++) {
        var speed = Phaser.Math.Between(-100, 100);
        var choice = Phaser.Math.Between(0, 1);
        if (choice == 0) {
            enemyArray[i].setVelocityX(speed);
            enemyArray[i].setVelocityY(0);
            if (speed < 0) {
                enemyArray[i].anims.play('eLeft');
            } else if (speed > 0) {
                enemyArray[i].anims.play('eRight');
            }
        } else if (choice == 1) {
            enemyArray[i].setVelocityY(speed);
            enemyArray[i].setVelocityX(0);
            if (speed < 0) {
                enemyArray[i].anims.play('eUp');
            } else if (speed > 0) {
                enemyArray[i].anims.play('eDown');
            }
        }
    }
}

/** Called when the player touches a food object. */
function collectFood(player, food) {
    let foodType = food.getData("food");

    if (foodType != undefined && CheckList(foodType)) {
        food.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
    }


    if (score >= 1300) {

        gameOverText.visible = true;
    }

}


function stopMove(player, enemies) {
    enemies.setVelocityX(0);
    enemies.setVelocityY(0);
    player.setVelocityX(0);
    player.setVelocityY(0);
}


$(document).ready(function () {
    $("#playgame").click(function () {
        $("#main").hide(400);
        $("#my-game").css("display", "flex");

    });
});