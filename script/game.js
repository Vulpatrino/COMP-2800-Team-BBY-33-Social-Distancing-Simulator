document.addEventListener("keydown", function (event) {
    if (event.keyCode == 87) {
        console.log("w");
        player.moveUp()
    }
    if (event.keyCode == 65) {
        console.log("a");
        player.moveLeft();
    }
    if (event.keyCode == 83) {
        console.log("s");
        player.moveDown();
    }
    if (event.keyCode == 68) {
        console.log("d");
        player.moveRight();
    }
})

function Player() {
    let img = document.getElementById("player");
    this.x = 0;
    this.y = 0;
    this.moveLeft = function () {
        this.x -= 2;
        img.style.left = this.x + "px";
    }
    this.moveRight = function () {
        this.x += 2;
        img.style.left = this.x + "px";
    }
    this.moveUp = function () {
        this.y -= 2;
        img.style.top = this.y + "px";
    }
    this.moveDown = function () {
        this.y += 2;
        img.style.top = this.y + "px";
    }
}

let player = new Player();