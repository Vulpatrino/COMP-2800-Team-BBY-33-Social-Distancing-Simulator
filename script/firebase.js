/**
 * FIREBASE.JS
 * Contains firebase authentication and firebase fire store functions.
 * @author: Eddy Wu
 * @author: Eric Dam
 */
var button = document.createElement("INPUT");
$("#menu").append(button);

/** Used to get user information from database and displaying it on menu */
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
/** Creates a key for the user to log all the data of that user */
function createUser() {

    // if the user is authenticated, get this "user" object
    // create this user node(doc) in the datebase users collection
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
/** Function to log user out */
function logout() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    });
    window.location.replace("index.html");
}
/** Gets the username of our user */
function getName() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).get().then(function (doc) {
                if (doc.exists) {
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