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
import database from '@react-native-firebase/database';
import { UserService } from "../../services/UserService";

const lang = require('../../assets/lang/th_TH.json');

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const CreatePinScreen = ({ navigation }) => {

  const userService = new UserService()

  const [pin_Number, setPinNumber] = React.useState("")
  const [repin_Number, setRePinNumber] = React.useState("")
  const [onAllPin, setOnAllPin] = React.useState(false)
  const [onRePin, setOnRePin] = React.useState(false)
  const [alert, setAlert] = React.useState(false)

  const popupAnim = React.useRef(new Animated.Value(-60)).current

  const SetPin = (pin) => {
    setAlert(false)
    if (onAllPin) setOnAllPin(false)
    if (!onRePin) {
      if (pin == 'Delete') {
        setPinNumber(pin_Number.slice(0, -1))
      }
      else if (pin_Number.length < 6) {
        setPinNumber(pin_Number + pin)
      }
    }
    else {
      if (pin == 'Delete') {
        setRePinNumber(repin_Number.slice(0, -1))
      }
      else if (repin_Number.length < 6) {
        setRePinNumber(repin_Number + pin)
      }
    }

    popupAlert_Out()  //Alert out
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  React.useEffect(() => {
    if (!onRePin) {
      if (pin_Number.length == 6) {
        setOnAllPin(true)
      }
    }
    else {
      if (repin_Number.length == 6) {
        setOnAllPin(true)
      }
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
    if (pin_Number === repin_Number) {
      navigation.navigate('CreatePin_Success')
      userService.createUser(pin_Number)
    }
    else {
      setAlert(true)
      setRePinNumber("")
      setOnAllPin(false)
      popupAlert_In()   //Alert in
    }
  }

  const PinShow = () => {
    let pinShow = [0, 0, 0, 0, 0, 0]
    let pins
    if (!onRePin) pins = pin_Number
    else pins = repin_Number

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

  const BackButton = (navigation) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 40,
          width: '30%',
          height: 50,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: '#ffffff',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (!onRePin) {
            navigation.navigate('TOS')
          }
          else {
            setOnRePin(false)
            setPinNumber("")
          }
          popupAlert_Out()     //Alert out
          setOnAllPin(false)
        }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >{lang.createpinscreen.back_btn}</Text>
      </TouchableOpacity>
    )
  }

  const NextButton = (navigation) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 40,
          width: '30%',
          height: screenHeight * (8 / 100),
          borderWidth: 1,
          borderRadius: 16,
          borderColor: '#707070',
          justifyContent: 'center',
          backgroundColor: onAllPin ? '#FFFFFF' : null,
        }}
        onPress={() => {
          // console.log(pin_Number.length)

          if (onAllPin) {
            if (!onRePin) {
              setOnRePin(true)
              setRePinNumber("")
              setOnAllPin(false)
            }
            else {
              ValidatePin()
            }
          }
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: onAllPin ? '#000000' : '#A7A7A7',
            textAlign: 'center'
          }}
        >{lang.createpinscreen.confirm_btn}</Text>
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
            backgroundColor: '#F86161',
            top: popupAnim,
            zIndex: 1,
            borderBottomStartRadius: 40,
            borderBottomEndRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 18, color: '#FFFFFF' }}>
              {lang.createpinscreen.alert_fail}
            </Text>
          </Animated.View>
        }
        <Text
          style={{ fontSize: 28, color: '#E0E0E0', marginBottom: 60 }}
        >{!onRePin ? lang.createpinscreen.title : lang.createpinscreen.title_repin}
        </Text>
        {/* <Text style={{ fontSize: 24, color: '#E0E0E0', marginBottom: 0 }}>{pin_Number}</Text> */}
        <PinShow />
        <NumPad setText={SetPin} />
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
  }
})

export default CreatePinScreen