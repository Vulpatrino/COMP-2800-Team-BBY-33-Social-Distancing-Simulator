/**
 * addScore.JS
 * All the score related functions.
 * @author: Eddy Wu
 */

/** Adds score to database */
function addScore(time){
    console.log("Added score");
    firebase.auth().onAuthStateChanged(function (user){
        if (user) {
            db.collection("users").doc(user.uid).collection("Scores").add({
                "time" : time
            });
        }
    });
}
/** Gets top 5 scores of user */
function getScore() {
    var count = 0;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).collection("Scores").orderBy("time", "asc").get().then(snapshot => {
                let scores = snapshot;
                scores.forEach(file => {
                    if (count == 0) {
                        var score = file.data().time + " seconds";
                        document.getElementById("score1").innerHTML = score;
                    }
                    if (count == 1) {
                        var score = file.data().time + " seconds";
                        document.getElementById("score2").innerHTML = score;
                    }
                    if (count == 2) {
                        var score = file.data().time + " seconds";
                        document.getElementById("score3").innerHTML = score;
                    }
                    if (count == 3) {
                        var score = file.data().time + " seconds";
                        document.getElementById("score4").innerHTML = score;
                    }
                    if (count == 4) {
                        var score = file.data().time + " seconds";
                        document.getElementById("score5").innerHTML = score;
                    }
                    if (count > 4) {
                        return 0;
                    }
                    count++;
                })

            })
        }
    })
}