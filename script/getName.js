function getName(){
   
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("users").doc(user.uid).get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data().name);
                var name = doc.data().name;
                document.getElementById("userName").innerHTML = name + "'s Top 5 Scores";
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    });
}