var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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

var game = new Phaser.Game(config);
var enemyArray = [];


function preload() {
    this.load.image('background', 'images/floor.jpg');
    this.load.image('wall1', 'images/wall1.png');
    this.load.image('wall2', 'images/wall2.png');
    this.load.image('aisle2', 'images/aisle2.png');
    this.load.image('dpad1', 'images/dpad1.png');
    this.load.image('dpad2', 'images/dpad2.png');
    this.load.image('dpad3', 'images/dpad3.png');
    this.load.image('dpad4', 'images/dpad4.png');
    this.load.image('dpad5', 'images/dpad5.png');
    this.load.image('dpad6', 'images/dpad6.png');
    this.load.audio('1', ['audio/1.mp3','audio/1.ogg']);
    this.load.audio('2', ['audio/2.mp3','audio/2.ogg']);
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
        frameHeight:49

    }
                         );

}

var enemies;
var walls;
var score = 0;
var scoreText;
var gameOverText;
var circle;
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

function create() {

    
    
    
    this.add.image(175, 400, 'background').setScale(1.6);
    this.add.image(550, 400, 'background').setScale(1.6);
    this.add.image(925, 400, 'background').setScale(1.6);
    this.add.image(1300, 400, 'background').setScale(1.6);

    walls = this.physics.add.staticGroup();

    walls.create(600, 600, 'wall1');
    walls.create(600, 200, 'wall1');
    walls.create(1200, 400, 'wall2').setScale(.5);
    tutWall = walls.create(350, 400, 'wall2').setScale(.5);
    walls.create(0, 400, 'wall2').setScale(.5);
    
    aisles = this.physics.add.staticGroup();
    aisle1 = aisles.create(700,325, 'aisle2');
    
    aisle2 = aisles.create(700,475, 'aisle2');

    

    this.music = this.sound.add('1');
    this.music.setVolume(0.5);
    this.music.setLoop(true);
    this.music.play();

    this.pickupSound = this.sound.add('2');

    volumeControl = this.input.keyboard.addKey('M');
    leavingPage = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


    player = this.physics.add.sprite(40, 400, 'dude');

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

    food = this.physics.add.staticGroup();
    /*         var i;
            var j;
            var h =45;
            var w =60;
            var foodcount =0;
            for (i = 0; i < 10; i++) {
                for(j=0; j<13;j++){
                    food.create(w , h, 'food',foodcount);
                    foodcount +=1;
                    h += 50;
                    if(foodcount > 99){
                        foodcount =0;
                    }
                    foodcount +=1;
                }
                w += 120;
                h =45;
            } */


    this.physics.add.overlap(player, food, collectFood, null, this);

    scoreText = this.add.text(20, 20, 'Score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    gameOverText = this.add.text(600, 400, "You Win!", {
        fontSize: "50px",
        fill: "#000"
    });
    tutorialText = this.add.text(100,100, "Use the arrows keys to move your character. Try pressing the up arrow key.");
    gameOverText.setOrigin(0.5);
    gameOverText.visible = false;


}

var count = 0;
var tutLeft = false;
var tutRight = false;
var tutUp = false;
var tutDown = false;
var tutMoving = false;
var tutFood;
var button;
var tutFinished =false;
var mute = false;
function update() {
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
        player.setVelocityX(-300);

        player.anims.play('left', true);
        if(tutLeft == false && tutRight == true && tutUp == true){
            tutorialText.setText("Now try using the down arrow key.");
            tutLeft = true;
        }
    } else if (cursors.right.isDown) {
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
    if (cursors.up.isDown) {
        player.setVelocityY(-300);
        if(tutUp == false){
            tutorialText.setText("Now try using the right arrow key.");
            tutUp = true;
        }
    } else if (cursors.down.isDown) {
        player.setVelocityY(300);
        if(tutDown == false && tutLeft == true && tutRight == true && tutUp == true){
            tutorialText.setText("Try to get the food without getting too close to the enemies just like social distancing.");
            tutDown = true;
        }
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
    if(tutUp == true && tutLeft == true && tutRight == true && tutDown == true && tutMoving == false){
        tutMoving = true;
        tutWall.destroy();
        console.log("Passed movement step of tutorial.");
        tutFood = food.create(1100 , 400, 'food');
        enemies = this.physics.add.group();
        this.physics.add.collider(player, enemies);
        this.physics.add.collider(enemies, enemies);
        this.physics.add.collider(enemies, walls);


        var i;
        for (i = 0; i < 3; i++) {
            var x = Phaser.Math.Between(400, 1000);
            var y = Phaser.Math.Between(300, 550);
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

    }
    if (Phaser.Input.Keyboard.JustDown(volumeControl)){
        if (mute == false){
            this.sound.setMute(true);
            mute = true;
        } else{
            this.sound.setMute(false);
            mute = false;
        }
    }
    if (Phaser.Input.Keyboard.JustDown(leavingPage)){

        window.open('main.html','_self');
    }
}

function enemyMove () {
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

function collectStar (player, star) {
    star.disableBody(true, true);
}
function collectFood(player, food) {
    food.disableBody(true, true);
    tutorialText.setText("Congratulation you passed the tutorial!");
    if(mute == false){
        this.pickupSound.play();
    }
    tutFinished = true;
    var menuButton = document.createElement("button");
    menuButton.innerHTML = "Back to main menu";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(menuButton);
    menuButton.onclick = function(){ window.open('main.html','_self')};
}


function stopMove(player, enemies) {
    enemies.setVelocityX(0);
    enemies.setVelocityY(0);
    player.setVelocityX(0);
    player.setVelocityY(0);
}