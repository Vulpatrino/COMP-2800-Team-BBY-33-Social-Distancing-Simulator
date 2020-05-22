/**
 * GAME.JS
 * Contains all Phaser functions
 * @author Sam Shannon
 * @author Jaedon Braun
 * @author Eddy Wu
 * @author Eric Dam
 */

// Height of the game window.
var gameHeight = window.innerHeight;
if(gameHeight > 800) gameHeight = 800;
// Width of the game window.
var gameWidth = window.innerWidth;
if(gameWidth > 1200) gameWidth  = 1200;
// Circle that surrounds the player character.
var circle;
// Cursor keys.
var cursors;
// Group that contains all aisles.
var aisles;
// Player character object.
var player;
// Group that contains all food objects.
var food;
// Length of the shopping list.
var listLength = 3;
// Group that contains all enemies.
var enemies;
// Group that contains all walls.
var walls;
// Timer for when enemies change position.
var enemyMoveTimer = 0;
// Maximum value for enemy move timer.
var enemyMoveTimerMax = 300;
// Text object that displays "You Win!"
var gameOverText;
// Text object that displays "You Lose!"
var gameLostText;
// Infection meter.
var infectBar;
// Level of infection.
var infectLevel = 0;
// Maximum level of infection before the player loses.
var infectMax = 195;
// UP on the mobile D-pad.
var dpadUp;
// RIGHT on the mobile D-pad.
var dpadRight;
// DOWN on the mobile D-pad.
var dpadDown;
// LEFT on the mobile D-pad.
var dpadLeft;
// UP + RIGHT on the mobile D-pad.
var dpadUpRight;
// DOWN + RIGHT on the mobile D-pad.
var dpadDownRight;
// DOWN + LEFT on the mobile D-pad.
var dpadDownLeft;
// UP + LEFT on the mobile D-pad.
var dpadUpLeft;
// Whether or not the player is moving upwards.
var moveUp = false;
// Whether or not the player is moving left.
var moveLeft = false;
// Whether or not the player is moving down.
var moveDown = false;
// Whether or not the player is moving right.
var moveRight = false;
// Mobile D-pad object.
var dpad;
// Background music.
var music;
// Mute key.
var volumeControl;
// Quit key.
var leavingPage;
// Restart key.
var restartKey;
// Whether or not the music is muted.
var mute = false;
// Tutorial Text
var tutorialText;
var tutLeft = false;
var tutRight = false;
var tutUp = false;
var tutDown = false;
var tutMoving = false;
var tutFood;
var button;
var tutFinished =false;
var tutWall;
var pauseCount = 0;
var arrow;
var arrow2;
var arrow3;
var arrow4;
var listButton;
// Button to pause and play game
var pausePlayButton;
// Mute button
var soundButton;
// Disable mobile controls
var mobileControlsButton;
// Restart game button
var restartButton;
// Go to home page button
var goHomeButton;
/** This scene contains the main game (player, enemies, aisles, food) */
class SceneA extends Phaser.Scene {

    constructor() {
        super({
            key: 'GameScene',
            active: true
        });
    }
    /** Pre-loads necessary resources, like images. */
    preload() {
        this.load.image('background', 'images/floor.jpg');
        this.load.image('wall1', 'images/wall1.png');
        this.load.image('wall2', 'images/wall2.png');
        this.load.image('aisle1', 'images/aisle1.png');
        
        this.load.audio('1', ['audio/1.mp3', 'audio/1.ogg']);
        this.load.audio('2', ['audio/2.mp3', 'audio/2.ogg']);
        this.load.spritesheet('arrow',
                              'images/arrow.png', {
            frameWidth: 241,
            frameHeight: 209
        }
                              );
        // Player spritesheet
        this.load.spritesheet("player", "images/PlayerSprites.png",
                              {
            frameWidth: 32,
            frameHeight: 48
        }
        
        // Enemy spritesheet
        this.load.spritesheet('enemy',
            'images/EnemySprites.png', {
                frameWidth: 32,
                frameHeight: 48,
            }
        );
        // Food spritesheet
        this.load.spritesheet('food',
                              'images/food.png', {
            frameWidth: 49,
            frameHeight: 49

        }
                             );

    }



    /** Called once at the start of the game. Use this to build objects. */
    create() {

        game.scene.sleep("pause");
        // Create a shopping list
        initTutList(listLength);

        this.add.image(600, 400, 'background').setScale(6);
        arrow = this.add.image(50,400,'arrow').setScale(.25);
        arrow2 = this.add.image(50,425,'arrow').setScale(.25);
        arrow3 = this.add.image(700,50,'arrow').setScale(.25);
        arrow4 = this.add.image(725,50,'arrow').setScale(.25);
        arrow3.angle = 90;
        arrow4.angle = 90;
        arrow.visible = false;
        arrow2.visible = false;
        arrow3.visible = false;
        arrow4.visible = false;
        // Create all four walls
        walls = this.physics.add.staticGroup();
        walls.create(600, 790, 'wall1');
        walls.create(600, 10, 'wall1');
        walls.create(1190, 400, 'wall2');
        tutWall = walls.create(600, 650, 'wall1');
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

        // Create and play music
        this.music = this.sound.add('1');
        this.music.setVolume(0.15);
        this.music.setLoop(true);
        this.music.play();

        // Add food pickup sound effects
        this.pickupSound = this.sound.add('2');
        this.pickupSound.setVolume(0.5);

        // Add the mute button
        volumeControl = this.input.keyboard.addKey('M');
        // Add the quit button
        leavingPage = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        // Add the restart button.
        restartKey = this.input.keyboard.addKey('R');

        // Create the player and their animations
        player = this.physics.add.sprite(600, 800, 'player');
        player.setCollideWorldBounds(true);
        updatePlayerTint();
        player.setInteractive();
        player.on("pointerdown", updatePlayerTint);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 12,
                end: 15
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                start: 8,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', {
                start: 4,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 0
            }),
            frameRate: 10
        });

        // Add collision between the player, walls, and aisles.
        this.physics.add.collider(player, walls);
        this.physics.add.collider(player, aisles);

        // Add food to the map.
        food = this.physics.add.staticGroup();
        var h = 45;
        var w = 60;
        var foodcount = 0;
        for (let i = 0; i < 3; i++) {
            food.create(w, h, 'food', foodcount);
            foodcount += 1;
            w += 540;
        }

        // Adds a Food object to the food collectibles.
        let foodChildren = food.getChildren();
        let foodIndex = 0;
        for (let i = 0; i < foodChildren.length; i++) {
            foodChildren[i].setDataEnabled();
            let newFood = new Food(foodIndex);

            foodIndex++;
            if (foodIndex >= foodTypes) {
                foodIndex = 0;
            }

            foodChildren[i].setData("food", newFood);

        }

        // Create enemy group and animations
        enemies = this.physics.add.group();
        enemies.enableBody = true;
        this.physics.add.collider(enemies, walls, hitWallMove, null, this);
        this.physics.add.collider(enemies, aisles, hitWallMove, null, this);
        this.anims.create({
            key: 'eRight',
            frames: this.anims.generateFrameNumbers('enemy', {
                start: 8,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eLeft',
            frames: this.anims.generateFrameNumbers('enemy', {
                start: 12,
                end: 15
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eUp',
            frames: this.anims.generateFrameNumbers('enemy', {
                start: 4,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eDown',
            frames: this.anims.generateFrameNumbers('enemy', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // Enemy creation loop
        var enemyX = 180;
        var enemyY = 150;
        for (let i = 0; i < 3; i++) {
            var enemy = enemies.create(enemyX, enemyY, 'enemy');
            enemy.setCollideWorldBounds(true);
            enemies.add(enemy);
            enemyX += 120;
        }

        // Add collision to food
        this.physics.add.overlap(player, food, collectFood, null, this);

        // Create circle around player.
        var circleColour = 0xffffff;
        var circleWidth = 1;
        circle = this.add.circle(player.x, player.y, 50).setStrokeStyle(circleWidth, circleColour);
        this.physics.world.bounds.width = 1200;
        this.physics.world.bounds.height = 800;

        // Make camera follow the player.
        this.cameras.main.setBounds(0, 0, 1200, 800);
        this.cameras.main.startFollow(player);
        initialMove();
    }

    // Reset enemy movement timer to 0.
    enemyMoveTimer = 0;

/** Called once every frame. Use for player movement, animations, and anything that needs frequent updating. */
update() {

    // Set all enemies to be slightly transparent.
    Phaser.Actions.SetAlpha(enemies.getChildren(), 0.7);
    // Show the mobile D-pad. (?) --Why is this being called every single frame?
    showDpad();
    // Create cursor keys. (?) --Why is this being called every single frame?
    cursors = this.input.keyboard.createCursorKeys();
    // Make the player move.
    playerMove();
    // Make the player's circle follow the player object.
    circle.setPosition(player.x, player.y);

    // Detect objects inside the player's circle.
    var bodies = this.physics.overlapCirc(circle.x, circle.y, circle.radius, true, false);
    var inCirc = bodies.map((body) => body.gameObject.texture.key);
    for (var i = 0; i < inCirc.length; i++) {
        if (inCirc[i] === "enemy") {
            infect();
        }
    }
    Phaser.Actions.SetAlpha(bodies.map((body) => body.gameObject), 1);

    // Tick the enemy move timer, and check if it's at the limit.
    if (enemyMoveTimer++ == enemyMoveTimerMax) {
        changeMove();
        enemyMoveTimer = 0;
    }

    // Mute the music if the mute key is pressed.
    if (Phaser.Input.Keyboard.JustDown(volumeControl)) {
        if (mute == false) {
            this.sound.setMute(true);
            mute = true;
        } else {
            this.sound.setMute(false);
            mute = false;
        }
    }

    // Quit to main page if the quit key is pressed.
    if (Phaser.Input.Keyboard.JustDown(leavingPage)) {
        window.open('index.html', '_self');
    }

    // Reload the page if the restart key is pressed.
    if (Phaser.Input.Keyboard.JustDown(restartKey)) {
        location.reload();
    }

    // Lose the game if player's infection level maxes out.
    if (infectLevel === infectMax) {
        tutorialText.visible = false;
        gameLostText.visible = true;
        redoButton();
        game.scene.pause("GameScene");
    }
    if(gameOverText.visible == true){
        pauseCount +=1;
        console.log(pauseCount);
        if (pauseCount >10){
            this.scene.pause();
        }
    }
}
}

/** This scene contains the mobile D-pad and UI. */
class SceneB extends Phaser.Scene {

    constructor() {
        super({
            key: 'UIScene',
            active: true
        });
    }

    // Preload all D-pad images.
    preload() {
        this.load.image('dpad1', 'images/dpad1.png');
        this.load.image('dpad2', 'images/dpad2.png');
        this.load.image('dpad3', 'images/dpad3.png');
        this.load.image('dpad4', 'images/dpad4.png');
        this.load.spritesheet('pausePlayIcon', 'images/pausePlayIcon.png', {
            frameWidth: 75,
            frameHeight: 75,
        });
    }

    // Called once when the scene loads.
    create() {
        tutorialText = this.add.text(25,100, "Welcome to our game Tutorial. \nIn this tutorial you will be\ntrying to get all the ingredients\non the shopping list while social\ndistancing. First off is \nlearning the movement. Use the\narrow keys for movement.\n\nTry the up arrow key.",{
            fill : "#000",
            lineSpacing: 10,
            fontSize: '17px'
        });
        tutorialText.lineSpacing = 10;
        // Add game win text.
        gameOverText = this.add.text(gameWidth/2, 200, "You Passed Tutorial!", {
            fontSize: "28px",
            fill: "#000",
            color : "#FFFFFF"
        });
        // Add game lose text.
        gameLostText = this.add.text(400, 100, "You got infected redo the tutorial.", {
            fontSize: "25px",
            fill: "#000"
        });

        gameOverText.setOrigin(0.5);
        gameOverText.visible = false;

        gameLostText.setOrigin(0.5);
        gameLostText.visible = false;

        // Create the infection meter.
        infectBar = this.add.graphics();
        createInfectBar();

        // Create the mobile D-pad.
        dpad = this.physics.add.group();
        createDpad();

        pausePlayButton = this.physics.add.sprite(gameWidth - 60, 60, "pausePlayIcon").setInteractive();
        createPausePlayButton();
    }

}

class SceneC extends Phaser.Scene {

    constructor() {
        super({
            key: 'pause',
            active: true
        });
    }
    preload() {
        this.load.spritesheet('listIcon', 'images/listIcon.png', {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet('soundIcon', 'images/soundIcon.png', {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet('dpadIcon', 'images/dpadIcon.png', {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet('restartIcon', 'images/restartIcon.png', {
            frameWidth: 34,
            frameHeight: 34,
        });
        this.load.spritesheet('homeIcon', 'images/homeIcon.png', {
            frameWidth: 60,
            frameHeight: 60,
        });
        this.load.image('menu', 'images/menu.png');
    }
    create() {
        this.add.image(gameWidth / 2, gameHeight / 2 + 40, 'menu');
        listButton = this.physics.add.sprite(gameWidth / 2 + 120, gameHeight / 3 + 40, "listIcon").setInteractive();
        createListButton();
        soundButton = this.physics.add.sprite(gameWidth / 2 + 120, gameHeight / 3 + 113, "soundIcon").setInteractive();
        createSoundButton();
        mobileControlsButton = this.physics.add.sprite(gameWidth / 2 + 120, gameHeight / 3 + 187, "dpadIcon").setInteractive();
        createMobileControlsButton();
        restartButton = this.physics.add.sprite(gameWidth / 2 + 120, gameHeight / 3 + 260, "restartIcon").setInteractive();
        createRestartButton(restartButton);
        goHomeButton = this.physics.add.sprite(gameWidth / 2 + 120, gameHeight / 3 + 330, "homeIcon").setInteractive();
        createGoHomeButton(goHomeButton);
    }
}
function closeList(){
    $("#listSection").css("display","none");
}
function createListButton(){
    listButton.on('pointerover', function () {
        listButton.setFrame(1);
    });

    listButton.on('pointerout', function () {
        listButton.setFrame(0);
    });

    listButton.on('pointerup', function () {
        $("#listSection").css("display","flex");
        $("#listSection").css("height",gameHeight + "px");
        $("#listSection").css("wdith",gameWidth + "px")
    });
}
function createGoHomeButton(button) {
    button.on('pointerover', function () {
        button.setFrame(1);
    });

    button.on('pointerout', function () {
        button.setFrame(0);
    });

    button.on('pointerup', function () {
        window.open('index.html','_self');
    });
}

function createRestartButton(button) {
    button.on('pointerover', function () {
        button.setFrame(1);
    });

    button.on('pointerout', function () {
        button.setFrame(0);
    });

    button.on('pointerup', function () {
        window.open('tutorial.html','_self');
    });
}

function createSoundButton() {
    soundButton.on('pointerover', function () {
        if (!mute) {
            soundButton.setFrame(1);
        } else {
            soundButton.setFrame(3)
        }
    })

    soundButton.on('pointerout', function () {
        if (!mute) {
            soundButton.setFrame(0);
        } else {
            soundButton.setFrame(2)
        }
    })
    soundButton.on('pointerup', function () {
        if (!mute) {
            soundButton.setFrame(3);
            game.sound.setMute(true);
            mute = true;
        } else {
            soundButton.setFrame(1)
            game.sound.setMute(false);
            mute = false;
        }

    })
}

function createMobileControlsButton() {

    mobileControlsButton.on('pointerover', function () {
        if (!mobileControls) {
            mobileControlsButton.setFrame(3);
        } else {
            mobileControlsButton.setFrame(1)
        }
    })

    mobileControlsButton.on('pointerout', function () {
        if (!mobileControls) {
            mobileControlsButton.setFrame(2);
        } else {
            mobileControlsButton.setFrame(0)
        }
    })
    mobileControlsButton.on('pointerup', function () {
        if (!mobileControls) {
            mobileControlsButton.setFrame(1);
            mobileControls = true;
            dpad.getChildren().forEach((dpad) => {
                dpad.visible = true;
            });
        } else {
            mobileControlsButton.setFrame(3)
            mobileControls = false;
            dpad.getChildren().forEach((dpad) => {
                dpad.visible = false;
            });
        }

    })
}

function createPausePlayButton() {
    pausePlayButton.on('pointerover', function () {

        if (!game.scene.isPaused("GameScene")) {
            pausePlayButton.setFrame(1);
        } else {
            pausePlayButton.setFrame(3);
        }
    })

    pausePlayButton.on('pointerout', function () {
        if (!game.scene.isPaused("GameScene")) {
            pausePlayButton.setFrame(0);
        } else {
            pausePlayButton.setFrame(2);
        }
    })
    pausePlayButton.on('pointerup', function () {
        if (!game.scene.isPaused("GameScene")) {
            pausePlayButton.setFrame(3);
            game.scene.pause("GameScene");
            game.scene.run("pause");
        } else {
            pausePlayButton.setFrame(1);
            game.scene.resume("GameScene");
            game.scene.sleep("pause");
        }
    })
}

/** Creates the mobile D-pad. */
function createDpad() {

    // Create D-pad buttons.
    dpadUp = dpad.create(80, gameHeight - 110, 'dpad1');
    dpadRight = dpad.create(110, gameHeight - 80, 'dpad2');
    dpadDown = dpad.create(80, gameHeight - 50, 'dpad1');
    dpadLeft = dpad.create(50, gameHeight - 80, 'dpad2');
    dpadUpRight = dpad.create(110, gameHeight - 110, 'dpad4');
    dpadDownRight = dpad.create(110, gameHeight - 50, 'dpad3');
    dpadDownLeft = dpad.create(50, gameHeight - 50, 'dpad4');
    dpadUpLeft = dpad.create(50, gameHeight - 110, 'dpad3');

    // Add D-pad functionality to:
    // D-pad up
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

    // D-pad right
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

    // D-pad down
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

    // D-pad left
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

    // D-pad up+right
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

    // D-pad down+right
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

    // D-pad down+left
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

    // D-pad up+left
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

    // Fix all D-pad buttons to the camera.
    dpad.getChildren().forEach((dpad) => {
        dpad.fixedToCamera = true;
    });
}

/** Creates the infection meter. */
function createInfectBar(){
    infectBar.fillStyle(0x000000);
    infectBar.fillRect(25, 25, 200, 30);
    infectBar.fillStyle(0xffffff);
    infectBar.fillRect(27, 27, 195, 25);
    infectBar.fillStyle(0xff0000);
    infectBar.fillRect(27, 27, infectLevel, 25);
}

/** Makes the D-pad visible if the user is on mobile. */
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

/** Moves the player. */
function playerMove() {

    // Set player X velocity.
    if (cursors.left.isDown || moveLeft) {
        player.setVelocityX(-300);
        player.anims.play('left', true);
        if(tutLeft == false && tutRight == true && tutUp == true){
            tutorialText.setText("Now try using the down arrow key.");
            tutLeft = true;
        }
    } else if (cursors.right.isDown || moveRight) {
        player.setVelocityX(300);
        player.anims.play('right', true);
        if(tutRight == false && tutUp == true){
            tutorialText.setText("Now try using the left arrow key.");
            tutRight = true;
        }
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // Set player Y velocity.
    if (cursors.up.isDown || moveUp) {
        player.setVelocityY(-300);
        if(tutUp == false){
            tutorialText.setText("Now try using the right arrow key.");
            tutUp = true;
        }
    } else if (cursors.down.isDown || moveDown) {
        player.setVelocityY(300);
        if(tutDown == false && tutLeft == true && tutRight == true && tutUp == true){
            tutorialText.setText("Now that you know how to move,\ntry to get the food without\ngetting too close to the enemies\njust like social distancing.\nPause the game to view the\nshopping list. If you get too\nclose the to the enemy your\ninfection bar will get filled up.\nIf the infection meter fills\nup you lose the game. Also, try to\nget the food before the timer\nruns out.\nGood Luck!");
            tutDown = true;
        }
    } else {
        player.setVelocityY(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(0);
    }
    if(tutUp == true && tutLeft == true && tutRight == true && tutDown == true && tutMoving == false){
        tutMoving = true;
        console.log("break");
        tutWall.destroy();
        arrow.visible = true;
        arrow2.visible = true;
        arrow3.visible = true;
        arrow4.visible = true;
    }
}

    /** Causes the enemies to move once. */
    function initialMove() {
        var speed = [-100, 100];
        let enemyArray = enemies.getChildren();
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

    /** Causes the enemies to change movement direction. */
    function changeMove() {
        var speed = [-100, 100];
        let enemyArray = enemies.getChildren();
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

    /** Causes an enemy to change directions when they hit a wall. */
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

    /** Called when the player touches a food object. 
 * Note: "player" argument is needed for the overlap event to work.
*/
    function collectFood(player, foodCollided) {
        // Get the pickup's food data.
        let foodType = foodCollided.getData("food");

        // Check the pickup's food data against the shopping list.
        if (foodType != undefined && CheckList(foodType)) {
            foodCollided.disableBody(true, true);

            // Play sound effect if the music isn't muted.
            if (mute == false) {
                this.pickupSound.play();
            }
        }

    }

    /** Called when the player completes their shopping list. */
    function win() {
        tutorialFinished();
        gameOverText.visible = true;
        tutorialFinished();
        
        
    }

    /** Called when a player becomes more infected. */
    function infect() {

        // Increase infection level.
        infectLevel += 0.5;

        // Rebuild infection meter.
        infectBar.clear();
        infectBar.fillStyle(0x000000);
        infectBar.fillRect(25, 25, 200, 30);
        infectBar.fillStyle(0xffffff);
        infectBar.fillRect(27, 27, 195, 25);
        infectBar.fillStyle(0xff0000);
        if (infectLevel <= infectMax) {
            infectBar.fillRect(27, 27, infectLevel, 25);
        } else {
            infectBar.fillRect(27, 27, infectMax, 25);
        }
    }
    // Makes a back to menu button
    function tutorialFinished(){
        tutFinished = true;
        tutorialText.visible = false;
        var menuButton = document.createElement("button");
        menuButton.innerHTML = "Back to main menu";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(menuButton);
        menuButton.onclick = function(){ window.open('index.html','_self')};
    }
    // makes a redo button show up
    function redoButton(){
        tutorialText.visible = false;
        var redoButton = document.createElement("button");
        redoButton.innerHTML = "Try Again";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(redoButton);
        redoButton.onclick = function(){ window.open('tutorial.html','_self')};
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
        scene: [SceneA, SceneB, SceneC]

    };

    /** Phaser instance. */
    let game = new Phaser.Game(config);