function addScore(time){
    console.log("Added score");
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).collection("Scores").add({
            "time" : time
        });
    });
}