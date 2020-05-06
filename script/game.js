/**
 * GAME.JS
 * Contains all Phaser functions
 * @author Sam Shannon
 * @author Jaedon Braun
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
    let foodLimit = foodNames.length;
    let foodIndex = 0;
    for (let i = 0; i < foodChildren.length; i++) {
        foodChildren[i].setDataEnabled();
        let food = new Food(foodIndex);

        foodIndex++;
        if (foodIndex >= foodLimit) {
            foodIndex = 0;
        }

        console.log(" " + food.getName());
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

}

var count = 0;

/** Called once every frame. Use for player movement, animations, and anything that needs frequent updating. */
function update() {
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
        player.setVelocityX(-300);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        player.setVelocityY(300);
    } else {
        player.setVelocityY(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(0);
    }

    if (count++ == 100) {
        enemyMove();
        count = 0;
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
            }
            else if (speed > 0) {
                enemyArray[i].anims.play('eRight');
            }
        }
        else if (choice == 1) {
            enemyArray[i].setVelocityY(speed);
            enemyArray[i].setVelocityX(0);
            if (speed < 0) {
                enemyArray[i].anims.play('eUp');
            }
            else if (speed > 0) {
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
