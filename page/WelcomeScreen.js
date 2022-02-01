import React from "react";
import {
  SafeAreaView,
  View,
  // Text,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Animated
} from "react-native";

import { StyleSheet } from "react-native";
import auth from '@react-native-firebase/auth';
import { connect } from "react-redux";
import { userChange } from "../context/actions/UserAction";
import { bindActionCreators } from "redux";

import Text from "../components/DefaultText";


const lang = require('../assets/lang/th_TH.json');

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


const WelcomeScreen = (props) => {
  const [onLoadingScreen, setLoadingScreen] = React.useState(false)
  const logoAnim = React.useRef(new Animated.Value((screenHeight / 2) - 180)).current
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  console.log(props.users)

  React.useLayoutEffect(() => {
    props.navigation.setOptions({ headerShown: false });
  })

  //Loading
  setTimeout(() => {
    setLoadingScreen(true)
    logoFade()
  }, 500)

  //Animeted
  const logoFade = () => {
    Animated.parallel([
      Animated.timing(logoAnim, {
        toValue: ((screenHeight / 3) - 180),
        duration: 500,
        useNativeDriver: false
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: false
      })
    ]).start()
  }

  React.useEffect(() =>{
  })

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: screenHeight/2
        }}>
          {/* Logo */}
          <Animated.View style={{ 
            justifyContent: 'center', 
            position: 'absolute', 
            top: logoAnim
            }}>
            <View style={styles.AppLogo} />
          </Animated.View>
        </View>
        {
          onLoadingScreen ? (
            <Animated.View 
              style={{position: 'absolute', top: screenHeight / 3, marginTop: 240, zIndex: 1, opacity: fadeAnim }}>
              <TouchableOpacity
                style={styles.SignIn_btn}
                onPress={() => {
                  // console.log(auth().currentUser)
                  // auth().signOut()
                  props.navigation.navigate('Signin_Pin')
                }}
              >
                <Text style={{ color: '#000000', textAlign: 'center', fontSize: 18 }}>{lang.welcomescreen.signin_btn}</Text>
              </TouchableOpacity>
              <Text
                style={{ color: '#ffffff', textAlign: 'center', fontSize: 16, marginTop: 20, textDecorationLine: 'underline' }}
                onPress={() => props.navigation.navigate('NewWasher')}
              >{lang.welcomescreen.signup_btn}?</Text>
            </Animated.View>
          ) : null
        }
        <Text style={styles.Version}>Version {lang.version}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#212A51',
    width: '100%',
    height: screenHeight,
    alignItems: 'center',
  },
  AppLogo: {
    backgroundColor: '#ffffff',
    borderRadius: 10000,
    width: 360,
    height: 360,
  },
  Version: {
    position: 'absolute',
    bottom: '5%',
    color: '#4858A0',
    fontSize: 16
  },
  SignIn_btn: {
    backgroundColor: '#FEC64B',
    width: screenWidth * (55 / 100),
    height: 50,
    borderRadius: 1000,
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => {
  const { users } = state
  return { users }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userChange,
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)