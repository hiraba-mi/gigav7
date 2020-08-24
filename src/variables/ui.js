// UI elements to work with
const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut');
const callWebApiButton = document.getElementById('callApiButton');
const label = document.getElementById('label');
const response = document.getElementById("response");

// updates the UI post login/token acquisition
function updateUI() {
    const userName = myMSALObj.getAccount().name;

    logMessage("User '" + userName + "' logged-in");

    signInButton.classList.add('d-none');
    signOutButton.classList.remove('d-none');

    // greet the user - specifying login
    label.innerText = "こんにちは! " + userName + " さん";

    // add the callWebApi button
    callWebApiButton.classList.add('d-none');
    callWebApiButton.setAttribute('class', 'btn btn-primary');

    //★★2020.8.12 mi.hiraba add begin
    document.getElementById('dataIdp').innerText = myMSALObj.getAccount().idToken.idp;
    document.getElementById('dataIdp_access_token').innerText = myMSALObj.getAccount().idToken.idp_access_token;
    document.getElementById('dataOid').innerText = myMSALObj.getAccount().idToken.oid;
    document.getElementById('dataEmails').innerText = myMSALObj.getAccount().idToken.emails[0];
    document.getElementById('dataTfp').innerText = myMSALObj.getAccount().idToken.tfp;
    //★★2020.8.12 mi.hiraba add end
}

// debug helper
function logMessage(s) {
    response.appendChild(document.createTextNode('\n' + s + '\n'));
}
