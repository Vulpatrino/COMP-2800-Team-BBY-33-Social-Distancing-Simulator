/**
 * GAME.JS
 * Contains all Phaser functions
 * @author Sam Shannon
 * @author Jaedon Braun
 * @author Eddy Wu
 * @author Eric Dam
 */



/** Array of all enemies. */
var gameHeight = document.documentElement.clientHeight;
var gameWidth = document.documentElement.clientWidth;
var circle;
var cursors;
var aisles;
var player;
var food;
var enemies;
let enemyArray = [];
var enemy;
var walls;
var score = 0;
var count = 0;
var scoreText;
var gameOverText;
var gameLostText;
var infectBar;
var health = 0;
var max = 195;
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
var volumeControl;
var leavingPage;
var mute = false;
class SceneA extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }
    /** Pre-loads necessary resources, like images. */
    preload() {
        this.load.image('background', 'images/floor.jpg');
        this.load.image('wall1', 'images/wall1.png');
        this.load.image('wall2', 'images/wall2.png');
        this.load.image('aisle1', 'images/aisle1.png');

        this.load.audio('1', ['audio/1.mp3', 'audio/1.ogg']);
        this.load.audio('2', ['audio/2.mp3', 'audio/2.ogg']);
        this.load.spritesheet('dude',
            'images/mario.png', {
                frameWidth: 32,
                frameHeight: 48
            }
        );
        this.load.spritesheet('enemy',
            'images/trump_run_resized_smaller.png', {
                frameWidth: 50,
                frameHeight: 50,
            }
        );

        this.load.spritesheet('food',
            'images/food.png', {
                frameWidth: 49,
                frameHeight: 49

            }
        );

    }



    /** Called once at the start of the game. Use this to build objects. */
    create() {

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


        this.music = this.sound.add('1');
        this.music.setVolume(0.15);
        this.music.setLoop(true);
        this.music.play();

        this.pickupSound = this.sound.add('2');
        this.pickupSound.setVolume(0.5);
        volumeControl = this.input.keyboard.addKey('M');
        leavingPage = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

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
        let foodLimit = foodNames.length;
        let foodIndex = 0;
        for (let i = 0; i < foodChildren.length; i++) {
            foodChildren[i].setDataEnabled();
            let food = new Food(foodIndex);

            foodIndex++;
            if (foodIndex >= foodLimit) {
                foodIndex = 0;
            }

            foodChildren[i].setData("food", food);

        }

        enemies = this.physics.add.group();
        enemies.enableBody = true;
        this.physics.add.collider(enemies, walls, hitWallMove, null, this);
        this.physics.add.collider(enemies, aisles, hitWallMove, null, this);
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

        var i;
        var x = 60;
        var y = 45;
        for (i = 0; i < 11; i++) {
            var enemy = enemies.create(x, y, 'enemy');
            enemy.setCollideWorldBounds(true);
            enemyArray.push(enemy);
            x += 120;
        }

        this.physics.add.overlap(player, food, collectFood, null, this);

        var colour = 0xffffff;
        var thickness = 1;
        circle = this.add.circle(player.x, player.y, 50).setStrokeStyle(thickness, colour);
        this.physics.world.bounds.width = 1200;
        this.physics.world.bounds.height = 800;
        this.cameras.main.setBounds(0, 0, 1200, 800);
        // make the camera follow the player
        this.cameras.main.startFollow(player);
        initialMove();
    }

    count = 0;

    /** Called once every frame. Use for player movement, animations, and anything that needs frequent updating. */
    update() {

        Phaser.Actions.SetAlpha(enemyArray, 0.7);
        showDpad();
        cursors = this.input.keyboard.createCursorKeys();
        playerMove();
        circle.setPosition(player.x, player.y);
        var bodies = this.physics.overlapCirc(circle.x, circle.y, circle.radius, true, false);
        var inCirc = bodies.map((body) => body.gameObject.texture.key);
        for (var i = 0; i < inCirc.length; i++) {
            if (inCirc[i] === "enemy") {
                healthIncrease();
                infect();
            }
        }
        Phaser.Actions.SetAlpha(bodies.map((body) => body.gameObject), 1);

        if (count++ == 300) {
            changeMove();
            count = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(volumeControl)) {
            if (mute == false) {
                this.sound.setMute(true);
                mute = true;
            } else {
                this.sound.setMute(false);
                mute = false;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(leavingPage)) {

            window.open('main.html', '_self');
        }
        if (health === max) {
            gameLostText.visible = true;
            game.scene.pause("default");
        }




    }
}
class SceneB extends Phaser.Scene {

    constructor() {
        super({
            key: 'UIScene',
            active: true
        });
    }

    preload() {
        this.load.image('dpad1', 'images/dpad1.png');
        this.load.image('dpad2', 'images/dpad2.png');
        this.load.image('dpad3', 'images/dpad3.png');
        this.load.image('dpad4', 'images/dpad4.png');
    }

    create() {
        scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        gameOverText = this.add.text(600, 400, "You Win!", {
            fontSize: "50px",
            fill: "#000"
        });

        gameLostText = this.add.text(600, 400, "You Lose", {
            fontSize: "50px",
            fill: "#000"
        });


        gameOverText.setOrigin(0.5);
        gameOverText.visible = false;

        gameLostText.setOrigin(0.5);
        gameLostText.visible = false;

        infectBar = this.add.graphics();
        createInfectBar();

        dpad = this.physics.add.group();
        createDpad();
    }


}




function createDpad() {

    let h = gameHeight;
    dpadUp = dpad.create(125, h - 200, 'dpad1');
    dpadRight = dpad.create(200, h - 125, 'dpad2');
    dpadDown = dpad.create(125, h - 50, 'dpad1');
    dpadLeft = dpad.create(50, h - 125, 'dpad2');
    dpadUpRight = dpad.create(200, h - 200, 'dpad4');
    dpadDownRight = dpad.create(200, h - 50, 'dpad3');
    dpadDownLeft = dpad.create(50, h - 50, 'dpad4');
    dpadUpLeft = dpad.create(50, h - 200, 'dpad3');

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

    dpad.getChildren().forEach((dpad) => {
        dpad.fixedToCamera = true;
    });
}
function createInfectBar(){
    let w = gameWidth;
    infectBar.fillStyle(0x000000);
    infectBar.fillRect(w -300, 60, 200, 30);
    infectBar.fillStyle(0xffffff);
    infectBar.fillRect(w - 298, 62, 195, 25);
    infectBar.fillStyle(0xff0000);
    infectBar.fillRect(w - 298, 62, health, 25);
}
function showDpad() {

    if (window.innerWidth > 500) {
        dpad.getChildren().forEach((dpad) => {
            dpad.setScrollFactor(0);
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

function initialMove() {
    var speed = [-100, 100];
    for (var i = 0; i < enemyArray.length; i++) {
        var choice = Math.floor(Math.random() * 2)
        var choice2 = Math.floor(Math.random() * 2);
        if (choice == 0) {
            enemyArray[i].setVelocityX(0);
            enemyArray[i].setVelocityY(speed[choice2]);
            if (speed[choice2] > 0) {
                enemyArray[i].anims.play('eDown');
            } else if (speed[choice2] < 0) {
                enemyArray[i].anims.play('eUp');
            }
        } else if (choice == 1) {
            enemyArray[i].setVelocityY(0);
            enemyArray[i].setVelocityX(speed[choice2]);
            if (speed[choice2] > 0) {
                enemyArray[i].anims.play('eRight');
            } else if (speed[choice2] < 0) {
                enemyArray[i].anims.play('eLeft');
            }
        }
    }
}

function changeMove() {
    var speed = [-100, 100];
    var vel;
    for (var i = 0; i < enemyArray.length; i++) {
        var choice = Math.floor(Math.random() * 2)
        var eKey = enemyArray[i].anims.getCurrentKey();
        if (eKey === 'eLeft' || eKey === 'eRight') {
            enemyArray[i].setVelocityX(0);
            enemyArray[i].setVelocityY(speed[choice]);
            if (speed[choice] > 0) {
                enemyArray[i].anims.play('eDown');
            } else if (speed[choice] < 0) {
                enemyArray[i].anims.play('eUp');
            }
        } else if (eKey === 'eUp' || eKey === 'eDown') {
            enemyArray[i].setVelocityY(0);
            enemyArray[i].setVelocityX(speed[choice]);
            if (speed[choice] > 0) {
                enemyArray[i].anims.play('eRight');
            } else if (speed[choice] < 0) {
                enemyArray[i].anims.play('eLeft');
            }
        }
    }
}

function hitWallMove(enemy) {
    var speed = [-100, 100];
    var choice = Math.floor(Math.random() * 2)
    var eKey = enemy.anims.getCurrentKey();
    if (eKey === 'eLeft' || eKey === 'eRight') {
        enemy.setVelocityX(0);
        enemy.setVelocityY(speed[choice]);
        if (speed[choice] > 0) {
            enemy.anims.play('eDown');
        } else if (speed[choice] < 0) {
            enemy.anims.play('eUp');
        }
    } else if (eKey === 'eUp' || eKey === 'eDown') {
        enemy.setVelocityY(0);
        enemy.setVelocityX(speed[choice]);
        if (speed[choice] > 0) {
            enemy.anims.play('eRight');
        } else if (speed[choice] < 0) {
            enemy.anims.play('eLeft');
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
        if (mute == false) {
            this.pickupSound.play();
        }
    }

}

/** Called when the player completes their shopping list. */
function win() {
    gameOverText.visible = true;
    game.scene.pause("default");
}

function infect() {
    infectBar.clear();
    infectBar.fillStyle(0x000000);
    infectBar.fillRect(970, 740, 200, 30);
    infectBar.fillStyle(0xffffff);
    infectBar.fillRect(972, 742, 195, 25);
    infectBar.fillStyle(0xff0000);
    if (health <= max) {
        infectBar.fillRect(972, 742, health, 25);
    } else {
        infectBar.fillRect(972, 742, max, 25);
    }
}

function healthIncrease() {
    health += 0.5;
}
/** Phaser configuration. */
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
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
    scene: [SceneA, SceneB]

};

/** Phaser instance. */
let game = new Phaser.Game(config);


$(document).ready(function () {
    $("#playgame").click(function () {
        $("#main").hide(400);
        $("#my-game").css("display", "flex");

    });
});