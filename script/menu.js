$(document).ready(()=>{
    $("#resume").on("click",function(){
        pausePlayButton.visible = true;
        game.scene.resume("GameScene");
        $("#pauseMenu").hide("fast");
        if(!isTut){
        timer.paused = false;
        }
    });
    $("#next-btn").on("click",function(){
        $("#intruction1").hide("fast");
        $("#next-btn").hide("fast");
        $("#intruction2").show("fast");
        $("#back-btn").show("fast");
        $("#start-btn").show("fast");
    });
    $("#back-btn").on("click",function(){
        $("#intruction1").show("fast");
        $("#next-btn").show("fast");
    });
    $("#start-btn").on("click",function(){
        $("#intruction2").hide("fast");
        $("#back-btn").hide("fast");
        $("#start-btn").hide("fast");
        $("#instruction-btn").show("fast");
    });
    $("#instruction-btn").on("click",function(){
        $("#intruction1").show("fast");
        $("#next-btn").show("fast");
        $("#instruction-btn").hide("fast");
    });

    $("#mobileControlsButton").on("click", function () {
        if (!mobileControls) {
            mobileControls = true;
            dpad.getChildren().forEach((dpad) => {
                dpad.visible = true;
            });
            $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 150px 0");
        } else {
            mobileControls = false;
            dpad.getChildren().forEach((dpad) => {
                dpad.visible = false;
            });
            $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 50px 0");
        }
    });

    $("#mobileControlsButton").hover(function () {
            if (!mobileControls) {
                $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 50px 0");
            } else {
                $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 150px 0");
            }
        },
        function () {
            if (!mobileControls) {
                $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 100px 0");
            } else {
                $("#mobileControlsButton").css("background", "url(images/dpadIcon.png) 0px 0");
            }
        });

    $("#soundButton").on("click", function () {
        if (mute) {
            game.sound.setMute(false);
            mute = false;
            $("#soundButton").css("background", "url(images/soundIcon.png) 150px 0");
        } else {
            game.sound.setMute(true);
            mute = true;
            $("#soundButton").css("background", "url(images/soundIcon.png) 50px 0");
        }
    });

    $("#soundButton").hover(function () {
            if (mute) {
                $("#soundButton").css("background", "url(images/soundIcon.png) 50px 0");
            } else {
                $("#soundButton").css("background", "url(images/soundIcon.png) 150px 0");
            }
        },
        function () {
            if (mute) {
                $("#soundButton").css("background", "url(images/soundIcon.png) 100px 0");
            } else {
                $("#soundButton").css("background", "url(images/soundIcon.png) 0px 0");
            }
        });


    $(".restartButton").on("click", function () {
        if(isTut){
        window.open('tutorial.html', '_self');
        } else{
            window.open('game .html', '_self');
        }
    });

    $(".restartButton").hover(function () {
            $(".restartButton").css("background", "url(images/restartIcon.png) 35px 0");
        },
        function () {
            $(".restartButton").css("background", "url(images/restartIcon.png) 0px 0");
        });

    $(".goHomeButton").on("click", function () {
        window.open('index.html', '_self');
    });

    $(".goHomeButton").hover(function () {
            $(".goHomeButton").css("background", "url(images/homeIcon.png) 60px 0");
        },
        function () {

            $(".goHomeButton").css("background", "url(images/homeIcon.png) 0px 0");
        });



})