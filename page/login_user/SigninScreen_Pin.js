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
import Text from "../../components/DefaultText";
import NumPad from "../../components/NumPad";
import database from '@react-native-firebase/database';
import { UserService } from "../../services/UserService";

const lang = require('../../assets/lang/th_TH.json');

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const SigninScreen_Pin = ({ navigation }) => {

  const userService = new UserService()

  const [pin_Number, setPinNumber] = React.useState("")
  const [alert, setAlert] = React.useState(false)
  const [user_Pin, setUserPin] = React.useState("")
  const [attemp_count, setAttempCount] = React.useState(null)
  const [attemp_date, setAttempDate] = React.useState(null)

  const [attemp_countdown, setAttempCountdown] = React.useState(20)

  const popupAnim = React.useRef(new Animated.Value(-60)).current

  const SetPin = (pin) => {
    setAlert(false)
    if (pin == 'Delete') {
      setPinNumber(pin_Number.slice(0, -1))
    }
    else if (pin_Number.length < 6) {
      setPinNumber(pin_Number + pin)
    }

    popupAlert_Out()  //Alert out
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  React.useEffect(() => {
    // userService.setWrongPin()
    const isAllPin = async () => {
      if (pin_Number.length == 6) {
        ValidatePin()
      }
    }

    const GetUserPin = async () => {
      if (user_Pin == "") {
        const res = await userService.getUserPin()
        setUserPin(res)
      }
    }

    const GetAttemp = async () => {
      if (attemp_count == null) {
        const res = await userService.getUserAttemp()
        setAttempCount(res.count)
        setAttempDate(res.lock_date)
      }
    }

    isAllPin()
    GetUserPin()
    GetAttemp()

    // setFinalTime((new Date()).getTime() + (60*1000))

  })

  //Time count
  React.useEffect(() => {
    if (attemp_date != null) {
      const interval = setInterval(() => {
        const current = new Date().getTime()
        const count = ((attemp_date - current) / 1000).toFixed(0)
        if (count > 0) {
          setAttempCountdown(count)
        }
        else{
          setAttempCountdown(20)
          userService.resetAttemp()
          setAttempDate(null)
        }
      }, 1000)

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

  const ValidatePin = () => {
    if (pin_Number == user_Pin) {
      userService.resetAttemp()
    }
    else {
      setPinNumber("")
      popupAlert_In()   //Alert in
      if (attemp_count + 1 >= 5) {
        const date = new Date().getTime() + (20 * 1000)
        userService.setCountDownDatePin(date)
        setAttempCount(0)
        setAttempDate(date)
      }
      else {
        userService.setCountWrongPin()
        setAttempCount(attemp_count + 1)
      }
    }
  }

  const PinShow = () => {
    let pinShow = [0, 0, 0, 0, 0, 0]
    let pins = pin_Number

    return (
      <View style={{ width: '70%', marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        {
          pinShow.map((p, idx) => (
            <View
              key={idx}
              style={{
                width: 40,
                height: 40,
                backgroundColor: pins[idx] != undefined ? '#FFFFFF' : null,
                borderRadius: 1000,
                borderWidth: 2,
                borderColor: '#E0E0E0'
              }}
            />
          ))
        }
      </View>
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
            backgroundColor: '#F86161',
            top: popupAnim,
            zIndex: 1,
            borderBottomStartRadius: 40,
            borderBottomEndRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 18, color: '#FFFFFF' }}>
              {lang.signinscreen_pin.alert_fail}
            </Text>
          </Animated.View>
        }
        <Text
          style={{ fontSize: 28, color: '#E0E0E0', marginBottom: 10 }}
        >{lang.signinscreen_pin.title}
        </Text>
        <Text
          style={{ fontSize: 14, color: '#E0E0E0', marginBottom: 50 }}
        >{attemp_date ? `${attemp_countdown} ${lang.signupscreen_otp.time}` : ''}
        </Text>
        {/* <Text style={{ fontSize: 24, color: '#E0E0E0', marginBottom: 0 }}>{pin_Number}</Text> */}
        <PinShow />
        <NumPad setText={SetPin} color={'#FEC64B'} />
        <Text style={styles.Version}>{lang.signinscreen_pin.forgot}</Text>
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
    justifyContent: 'center'
  },
  Version: {
    position: 'absolute',
    bottom: '5%',
    color: '#E0E0E0',
    fontSize: 16
  },
})

export default SigninScreen_Pin