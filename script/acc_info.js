function getAccountInfo() {
    firebase.auth().onAuthStateChanged(function(user) {
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