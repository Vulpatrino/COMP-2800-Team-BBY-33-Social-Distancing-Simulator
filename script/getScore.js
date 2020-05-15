function getScore(){

    var allScores = [];
    var max = 0;
    var index = 0;
    var top5Score = [];
    console.log("Got score");
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).collection("Scores").orderBy("time", "desc").onSnapshot(snapshot => {
            let scores = snapshot;
            scores.forEach(file => {
                allScores.push(file.data().time);
            })
        })
    })
    
    console.log(allScores);
    var top5Score = allScores.splice(0,5);
    console.log(top5Score);
    return top5Score;
}