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
      claims: {
        name: '',
        idp: '',
        idp_access_token: '',
        oid: '',
        emails: '',
        tfp: ''
      }
    };

    this.signIn = this.signIn.bind(this);
  }

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
        this.setState({ claims: { name: loginResponse.account.name,
                                  idp: loginResponse.idTokenClaims.idp,
                                  idp_access_token: loginResponse.idTokenClaims.idp_access_token,
                                  oid: loginResponse.idTokenClaims.oid,
                                  emails: loginResponse.idTokenClaims.emails,
                                  tfp: loginResponse.idTokenClaims.tfp,
                        } 
                      });
        document.getElementById('dataIdp').innerText = this.state.claims.idp;
        document.getElementById('dataIdp_access_token').innerText = this.state.claims.idp_access_token;
        document.getElementById('dataOid').innerText = this.state.claims.oid;
        document.getElementById('dataEmails').innerText = this.state.claims.emails[0];
        document.getElementById('dataTfp').innerText = this.state.claims.tfp;
        //★★2020.8.12 mi.hiraba add end

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
    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <div id="label" class="navbar-brand">{this.state.userName}</div>
          <div class="btn-group ml-auto dropleft">
            <button type="button" class="btn btn-secondary" onClick={this.signIn} style={{ display: this.state.authState ? 'none' : '' }} >Sign In</button>
            <button type="button" class="btn btn-success" onClick={this.signOut} style={{ display: this.state.authState ? '' : 'none' }}>Sign Out</button>
          </div>
        </nav>
      </div>
    );
  }
}
