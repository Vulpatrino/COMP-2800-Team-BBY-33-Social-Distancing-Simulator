function addScore(score, time){
    console.log("Added score");
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).collection("Scores").add({
            "score" : score,
            "time" : time
        });
    });
}