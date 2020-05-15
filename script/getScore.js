function getScore(){

    var allScores = [];
    
    var top5Score = [];
    console.log("Got score");
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).collection("Scores").orderBy("time", "desc").get().then(snapshot => {
            let scores = snapshot;
            scores.forEach(file => {
                console.log(file.data().time)
                var score = file.data().time + " seconds";
                document.getElementById("score1").innerHTML = score;
            })
        })
    })
    
    console.log(allScores);
    var top5Score = allScores.splice(0,5);
    var hi = allScores.pop();
    console.log(hi);
    
    return top5Score;
}