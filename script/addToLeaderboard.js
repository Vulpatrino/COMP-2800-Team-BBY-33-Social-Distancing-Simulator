function addToLeaderboard(time){
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).get().then(function(doc) {

            console.log("Document data:", doc.data().name);
            var name = doc.data().name;

            firebase.auth().onAuthStateChanged(function (user){
                db.collection("leaderboard").add({
                    "name" : name,
                    "time" : time
                });
            });
        })
    })
}
