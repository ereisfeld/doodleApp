var ui = new firebaseui.auth.AuthUI(firebase.auth());
var userName = "notConnected";
var userMail = "notConnected";
var userSignedIn = 0;

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(authResult)
      userName = authResult['user']['displayName']
      userMail = authResult['user']['email']
      //document.querySelector("#startGame").style.display = "inline-block";
      document.querySelector("#authButtons").style.display = "none";
      goToFirstInteactiveExample();

      return false; //false means don't redirect
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  //signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function(user) {
  console.log("auth changed fired");
  if (user) {
    // User is signed in.
    userName = user.displayName;
    userMail = user.email;
    userSignedIn = 1;
  } else {
    // User is signed out.
    // ...
  }
});