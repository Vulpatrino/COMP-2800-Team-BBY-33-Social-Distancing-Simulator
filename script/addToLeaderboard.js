/**
 * FIREBASE.JS
 * Contains all the leaderboard functions.
 * @author: Eddy Wu
 */

/* Adds score to leaderboard database collection */
function addToLeaderboard(time) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).get().then(function (doc) {
                console.log("Document data:", doc.data().name);
                var name = doc.data().name;
                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("leaderboard").add({
                        "name": name,
                        "time": time
                    });
                });
            })
        }
    })
}

/** Gets the top 5 score of all users */
function getLeaderBoard() {
    var count = 0;
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("leaderboard").orderBy("time", "asc").get().then(snapshot => {
            let scores = snapshot;
            scores.forEach(file => {
                if (count == 0) {
                    var name = file.data().name;
                    document.getElementById("name1").innerHTML = name;
                    var score = file.data().time + " seconds";
                    document.getElementById("time1").innerHTML = score;
                }
                if (count == 1) {
                    var name = file.data().name;
                    document.getElementById("name2").innerHTML = name;
                    var score = file.data().time + " seconds";
                    document.getElementById("time2").innerHTML = score;
                }
                if (count == 2) {
                    var name = file.data().name;
                    document.getElementById("name3").innerHTML = name;
                    var score = file.data().time + " seconds";
                    document.getElementById("time3").innerHTML = score;
                }
                if (count == 3) {
                    var name = file.data().name;
                    document.getElementById("name4").innerHTML = name;
                    var score = file.data().time + " seconds";
                    document.getElementById("time4").innerHTML = score;
                }
                if (count == 4) {
                    var name = file.data().name;
                    document.getElementById("name5").innerHTML = name;
                    var score = file.data().time + " seconds";
                    document.getElementById("time5").innerHTML = score;
                }
                if (count > 4) {
                    return 0;
                }
                count++;
            })
        })
    })
}