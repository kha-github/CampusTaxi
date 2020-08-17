import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';

const facebook_app_id = '350528495956316' 

const login_base_url = 'http://campustaxi-b0e6c.web.app' // 'http://192.168.2.112:3500' //
const naver_login_uri = login_base_url + '/api/naver/login'
const kakao_login_uri = login_base_url + '/api/kakao/login'

export default class Login extends React.Component {

  state = { googleUser: null };

  componentDidMount() {
    this.initAsync();
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>SNS Login</Text>
  
        <View style={styles.buttonContainer}>
          <Button title="Naver" onPress={this.naverLogin} />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Kakao" onPress={this.kakaoLogin} />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Google" onPress={() => {
            if (this.state.googleUser) {
              this.googleSignOutAsync();
            } else {
              this.googleSignInAsync();
            }
          }} />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Facebook" onPress={this.fbLogIn}/>
        </View>
        
        <StatusBar style="auto" />
      </View>
    );
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync();
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const googleUser = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ googleUser });
  };

  googleSignOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ googleUser: null });
  };

  googleSignInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      
      if (type === 'success') {
        alert(`token: ${user.auth.accessToken}`)
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('Login Error: ' + message);
    }
  };


  fbLogIn = async () => {
    try {
      await Facebook.initializeAsync(facebook_app_id);
      
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });

      if (type === 'success') {
        console.log(`facebook token: ${token}`)
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        alert('Logged in!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  loginSuccess = (token) => {
    console.log(token)
  }

  loginFailed = () => {

  }

  naverLogin = () => {
    this.props.navigation.push('WebLogin', {
      uri : naver_login_uri,
      login: this.loginSuccess,
      loginFail: this.loginFailed,
    })
  }

  kakaoLogin = () => {
    this.props.navigation.push('WebLogin', {
      uri : kakao_login_uri,
      login: this.loginSuccess,
      loginFail: this.loginFailed,
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonContainer: {
    width: 120,
    marginVertical: 10
  },
});
