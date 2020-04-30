/**
 * FIREBASE.JS
 * Contains most Firebase functionality.
 * @author Eddy Wu
 * @author Eric Dam
 */

function logout(){
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  })
  window.location.replace("index.html");
    
}

function createUser() {

  // if the user is authenticated, get this "user" object
  // create this user node(doc) in the datebase users collection
  console.log("Works")
  firebase.auth().onAuthStateChanged(function(user) {
      db.collection("users").doc(user.uid).set({
          "name":user.displayName, 
          "email":user.email,
      });
  });
}