import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  // Text,
  TouchableOpacity,
  Animated
} from "react-native";
import Text from '../../components/DefaultText'
import NumPad from "../../components/NumPad";
import auth from '@react-native-firebase/auth';

const lang = require('../../assets/lang/th_TH.json');
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const SignupScreen_OTP = ({ navigation, route }) => {
  const [otp, setOTP] = React.useState("")
  const [alert, setAlert] = React.useState(false)
  const [verify, setVerify] = React.useState(false)
  const [onSendOTP, setOnSendOTP] = React.useState(true)
  const [confirm, setConfirm] = React.useState(null)

  const [finalTime, setFinalTime] = React.useState(null)
  const [showTime, setShowTime] = React.useState()

  const popupAnim = React.useRef(new Animated.Value(-60)).current

  const SetOTP = (otp_number) => {
    if (otp_number == 'Delete') {
      setOTP(otp.slice(0, -1))
      popupAlert_Out()
    }
    else if (otp.length < 6) {
      setOTP(otp + otp_number)
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  React.useEffect(() => {
    if (onSendOTP) {
      SendPhoneNumberToFirebase()
    }  //Do one time
    if (otp.length == 6) {
      ValidatePhoneByOTP()
    }
    // DoCountdown()
  })

  //Time count
  React.useEffect(() => {
    if (finalTime != null){
      const interval = setInterval(() => {
        const current = new Date().getTime()
        const count = ((finalTime - current)/1000).toFixed(0)
        if (count > 0){
          setShowTime(count)
        }
      },1000)
  
      return () => clearInterval(interval)
    }
  })

  const popupAlert_In = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false
    }).start()
  }

  const popupAlert_Out = () => {
    Animated.timing(popupAnim, {
      toValue: -60,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }

  const SendPhoneNumberToFirebase = async () => {
    setOnSendOTP(false)
    let phone = route.params.phoneNumber
    let phoneNumber = "+66 "
    for (let i = 1; i < phone.length; i++) {
      if (i == 3 || i == 6) {
        phoneNumber = phoneNumber + "-"
      }
      phoneNumber = phoneNumber + phone[i]
    }
    const confirmation = await auth().verifyPhoneNumber(phoneNumber, 50, false)
      .on('state_changed', (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state){
          case 'sent': {
            setConfirm({
              verificationId: phoneAuthSnapshot.verificationId,
              code: phoneAuthSnapshot.code
            })
            setFinalTime((new Date()).getTime() + (50*1000))
            break
          }
          case 'timeout': {
            console.log('Timeout!!')
            setConfirm(null)
            setFinalTime(null)
            break
          }
          case 'verified': {
            console.log('Verify phone number')
            setConfirm(null)
            setFinalTime(null)
            break
          }
        }
      })
    // confirm.current = confirmation
    // console.log(confirm.current)
  }

  const ValidatePhoneByOTP = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, otp);
      let userData = await auth().signInWithCredential(credential)
    } 
    catch (error) {
      console.log('Error:', error);
    }

    const user = auth().currentUser
    if(user) {
      setVerify(true)
      popupAlert_In()
      setTimeout(() => navigation.navigate('TOS'), 500)
    }
    else {
      setVerify(false)
      popupAlert_In()
    }

  }

  const DisplayOTP = () => {
    let txt = ""
    for (let i = 0; i < otp.length; i++) {
      txt = txt + "X"
    }
    return txt
  }

  const BackButton = (navigation) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 40,
          width: '30%',
          height: 50,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: '#FFFFFF',
          justifyContent: 'center',
        }}
        onPress={() => { navigation.navigate('Signup_Phone') }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >{lang.signupscreen_otp.back_btn}</Text>
      </TouchableOpacity>
    )
  }

  const NextButton = (navigation) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 40,
          width: '30%',
          height: 50,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: '#707070',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
        onPress={() => {
          popupAlert_Out()
          SendPhoneNumberToFirebase()
          setOTP("")
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: '#000000',
            textAlign: 'center'
          }}
        >{lang.signupscreen_otp.resend_btn}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        {
            <Animated.View style={{
              width: '100%',
              height: 60,
              position: 'absolute',
              backgroundColor: verify == true ? '#31E877' : '#F86161',
              top: popupAnim,
              zIndex: 1,
              borderBottomStartRadius: 40,
              borderBottomEndRadius: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>
                {
                  verify == true ?
                    lang.signupscreen_otp.alert_label_success :
                    lang.signupscreen_otp.alert_label_fail
                }
              </Text>
            </Animated.View>
        }
        <Text
          style={{ fontSize: 28, color: '#E0E0E0', marginBottom: 10 }}
        >{lang.signupscreen_otp.title}
        </Text>
        <Text
          style={{ fontSize: 14, color: '#E0E0E0', marginBottom: 30 }}
        >{finalTime != null ? `${showTime} ${lang.signupscreen_otp.time}` : ''}
        </Text>
        <Text 
          style={{ fontSize: 24, color: '#E0E0E0', marginBottom: 40 }}
        >{DisplayOTP()}</Text>
        <NumPad setText={SetOTP} />
        <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <BackButton {...navigation} />
          <NextButton {...navigation} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#689CB2',
    width: '100%',
    height: screenHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default SignupScreen_OTP