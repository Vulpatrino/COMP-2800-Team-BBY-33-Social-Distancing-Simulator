var button = document.createElement("INPUT");
$("#menu").append(button);

function getAccountInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                var email = doc.data().email;
                var name = doc.data().name;
                var wel = document.createElement("H3");
                var emailText = document.createElement("H3");
                var nameText = document.createElement("H3");
                wel.innerHTML = "Welcome";
                emailText.innerHTML = email;
                nameText.innerHTML = name;
                var sect = document.getElementById("account");
                sect.append(wel, emailText, nameText);
            } else {
                console.log("This document does not exist");
            }
        }).catch(function (err) {
            console.log("Error: " + err);
        });
    });
}

function createUser() {

    // if the user is authenticated, get this "user" object
    // create this user node(doc) in the datebase users collection
    console.log("Works")
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).set({
                "name": user.displayName,
                "email": user.email,
            });
            $(button).attr({
                type: "button",
                value: "Logout"
            });
            $(button).on("click", logout);
        } else {
            $(button).attr({
                type: "submit",
                value: "Login",
            });
            $(button).on("click", function () {
                window.location.replace("login.html");
            })
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    });
    window.location.replace("index.html");
}

function getName() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).get().then(function (doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data().name);
                    var name = doc.data().name;
                    document.getElementById("userName").innerHTML = name + "'s Top 5 Scores";
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    });
}

function getScore() {
    var count = 0;
    console.log("Got score");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).collection("Scores").orderBy("time", "asc").get().then(snapshot => {
                let scores = snapshot;
                scores.forEach(file => {
                    console.log(file.data().time)
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
                    console.log(count);
                    count++;
                })

            })
        }
    })
}

function getLeaderBoard() {
    var count = 0;
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("leaderboard").orderBy("time", "asc").get().then(snapshot => {
            let scores = snapshot;
            scores.forEach(file => {
                console.log(file.data().time)
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
                console.log(count);
                count++;

            })
        })
    })
}