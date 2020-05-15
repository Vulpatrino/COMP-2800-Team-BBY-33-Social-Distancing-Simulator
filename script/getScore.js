function getScore(){

    var allScores = [];
    var count = 0;
    var top5Score = [];
    console.log("Got score");
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).collection("Scores").orderBy("time", "desc").get().then(snapshot => {
            let scores = snapshot;
            scores.forEach(file => {
                console.log(file.data().time)
                if (count == 0){
                    var score = file.data().time + " seconds";
                    document.getElementById("score1").innerHTML = score;
                }
                if (count == 1){
                    var score = file.data().time + " seconds";
                    document.getElementById("score2").innerHTML = score;
                }
                if (count == 2){
                    var score = file.data().time + " seconds";
                    document.getElementById("score3").innerHTML = score;
                }
                if (count == 3){
                    var score = file.data().time + " seconds";
                    document.getElementById("score4").innerHTML = score;
                }
                if (count == 4){
                    var score = file.data().time + " seconds";
                    document.getElementById("score5").innerHTML = score;
                    
                }
                console.log(count);
                count++;
            })
        })
    })

    console.log(allScores);
    var top5Score = allScores.splice(0,5);
    var hi = allScores.pop();
    console.log(hi);

    return top5Score;
}