import React from 'react';
import * as Msal from "msal";

const msalConfig = {
  auth: {
    clientId: "2ec94da5-3f2c-4849-ab94-6b045bd477f1",
    authority: "https://gigadomain.b2clogin.com/gigadomain.onmicrosoft.com/B2C_1_sugnupsignin1",
    validateAuthority: false
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

const loginRequest = {
  scopes: ["openid", "profile"]
};

const tokenRequest = {
  scopes: ["https://gigadomain.onmicrosoft.com/api/demo.read"]
};

const _msal = new Msal.UserAgentApplication(msalConfig);

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: false,
      userName: '',
      accessToken: '',
      accessToken2: '',
      claims: [],
      claim: {
        name: '',
        idp: '',
        idp_access_token: '',
        oid: '',
        emails: '',
      },
      events: [],
      disp: '',
      tokens: [],
      tfp: ''
      
    };

    this.signIn = this.signIn.bind(this);
  }

  //■■■■
  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: "935821385111-u1kor24lqvtdlejh3pvennesc2fnm8io.apps.googleusercontent.com",
        ux_mode: "popup",
        clientSecret: "HnWMafnGjFZoPfgPxF8Eq1jH",
        apiKey: "AIzaSyAgd32KQrTXaHmi4vptEMBTGV89YoVHdu8",
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        //prompt: 'consent',
        redirect_uris: "http://localhost:3000"
      }).then(() => {
        let auth = window.gapi.auth2.getAuthInstance();
        let isSignedIn = auth.isSignedIn.get();
        this.setState({ isSignedIn: isSignedIn });

        if (isSignedIn === null) {
          this.loginWithGoogle();
        } else if (isSignedIn) {
          if(this.state.authState == true){
          	this.getEventList();
          }
        } else {
          this.loginWithGoogle();
        }

      });
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  renderAuth() {
    if (this.state.isSignedIn === null) {
      return <div>i dont know your google account</div>
    } else if (this.state.isSignedIn) {
      return <div>login with google!!</div>
    } else {
      return <div>I can not see your google account!!</div>
    }
  }

  loginWithGoogle = () => {
    //gapi.auth.authorizeとsignIn
    window.gapi.auth2.getAuthInstance().signIn();
let auth2 = window.gapi.auth2.getAuthInstance();
var access_token = auth2.currentUser.get().getAuthResponse().access_token; 
console.log("access_token =" + access_token);
this.setState({ isSignedIn: auth2.isSignedIn.get() });
this.setState({ access_token: access_token });
this.state.tokens.push(access_token);
console.log("■1 access_token■" + access_token);

let abb = "ya29.a0AfH6SMDjoIxdWzcuyLIlJMtlThZC47tPHGl7oeIxmTvmLi0Tl19NF9SOiGo4SKPEDgA0TLCKIMuyaZNw88CU0GbNYSs-8SNstxWMwPZVVM902A3GXTL-YHJWQvZNPlsH1D7RiCZ_LSWH894eH0pIa2183XIua4OYZzox";
console.log("■2 access_token■" + abb);
window.gapi.client.setToken({access_token: abb});
console.log("■3 access_token■" + this.state.access_token);
//★★
/*
var authorisationRequestData =
{
client_id: "935821385111-u1kor24lqvtdlejh3pvennesc2fnm8io.apps.googleusercontent.com", 
scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
immediate: true,
prompt: "none",
access_type: "offline",
clientSecret: "HnWMafnGjFZoPfgPxF8Eq1jH",
include_granted_scope: true
}
    let authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.grantOfflineAccess(authorisationRequestData)
    .then((resp) => {
      console.log("■■■■■■■■■");
      let a1 = window.gapi.auth.getToken();
      let a2 = window.gapi.client.getToken();
      //window.gapi.client.setToken(a2);
//      this.state.tokens.push(a2);
      console.log("★★");

      console.log(window.gapi.auth.getToken());
      var all_token = JSON.stringify(window.gapi.auth.getToken());
console.log(window.gapi.client.getToken(resp.code));
var all_token2 = JSON.stringify(window.gapi.client.getToken(resp.code));
console.log(window.gapi.auth2.getToken(resp.code));
var all_token3 = JSON.stringify(window.gapi.auth2.getToken(resp.code));
     console.log("Token =" + all_token);
     console.log("Token2 =" + all_token2);
     console.log("Token3 =" + all_token3);
      console.log(resp.code);
    }).catch(error => {
      console.log("★★★★★★");
      console.log(error);
    });
*/
//★★

  }

  logoutFromGoogle = () => {
    this.setState({ events: [] });
    window.gapi.auth2.getAuthInstance().signOut();
        let auth3 = window.gapi.auth2.getAuthInstance();
        this.setState({ isSignedIn: auth3.isSignedIn.get() });
  }

  getEventList = () => {
    window.gapi.client.calendar.events
      .list({
        calendarId: "primary",
//        timeMax: new Date().toISOString(),
//        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items;
        console.log("★★★■■" + JSON.stringify(response.result.items));
        this.setState({ events: response.result.items });
      });
  }
  //■■■■

  signIn = () => {
    this.setState({ authState: false });

    _msal.loginPopup(loginRequest)
      .then(loginResponse => {
        console.log("id_token acquired at: " + new Date().toString());
        console.log(loginResponse);  

        this.setState({ authState: true });

        // greet the user - specifying login
        this.setState({ userName: loginResponse.account.name + " さん" });

        //★★2020.8.12 mi.hiraba add begin
        //★★ ここで本当はDB登録
        this.setState({ claim: { name: loginResponse.account.name,
                                  idp: loginResponse.idTokenClaims.idp,
                                  idp_access_token: loginResponse.idTokenClaims.idp_access_token,
                                  oid: loginResponse.idTokenClaims.oid,
                                  emails: loginResponse.idTokenClaims.emails,
                                  tfp: loginResponse.idTokenClaims.tfp,
                        } 
                      });

        this.state.claims.push(this.state.claim);
        //this.setState({ events: response.result.items });

        document.getElementById('dataIdp').innerText = this.state.claim.idp;
        document.getElementById('dataIdp_access_token').innerText = this.state.claim.idp_access_token;
        document.getElementById('dataOid').innerText = this.state.claim.oid;
        document.getElementById('dataEmails').innerText = this.state.claim.emails[0];
        document.getElementById('dataTfp').innerText = this.state.claim.tfp;
        //★★2020.8.12 mi.hiraba add end

        _msal.acquireTokenSilent(tokenRequest).then(token => {
          console.log('★★★');
          console.log(token);
          });

      }).catch(error => {
        console.log(error);
        // Error handling
        if (error.errorMessage) {
          // Check for forgot password error
          // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
          if (error.errorMessage.indexOf("AADB2C90118") > -1) {
            //_msal.loginPopup(b2cPolicies.authorities.forgotPassword)
            //  .then(loginResponse => {
            //    console.log(loginResponse);
            //    window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
            //  })
          }
        }
      });
  }

  signOut = () => {
    _msal.logout();
    this.setState({ authState: false });
    this.setState({ userName: '' });
  }

  render() {
    let datas = [];
    if(this.state.events != null){
      this.state.events.map((event)=>{
        if(event.start.dateTime != null && event.end.dateTime != null){
	        datas.push(<p>title: {event.summary}</p>);
	        datas.push(<p>description: {event.description}</p>);
	        datas.push(<p>start: {event.start.dateTime}</p>);
	        datas.push(<p>end: {event.end.dateTime}</p>);
	    }
      });
    }

    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <div id="label" class="navbar-brand">{this.state.userName}</div>
          <div class="btn-group ml-auto dropleft">
            <button type="button" class="btn btn-secondary" onClick={this.signIn} style={{ display: this.state.authState ? 'none' : '' }} >サインイン</button>
            <button type="button" class="btn btn-success" onClick={this.signOut} style={{ display: this.state.authState ? '' : 'none' }}>サインアウト</button>
          </div>
        </nav>
        {this.renderAuth()}
        {/* JSON.stringify(this.state.isSignedIn) */}
        <button onClick={this.loginWithGoogle}>
          login with google
        </button>
        <button onClick={this.logoutFromGoogle}>
          logout from google
        </button>
        <button onClick={this.getEventList}>
          get event
        </button>
        <div>{datas}</div>
      </div>
    );
  }
}
