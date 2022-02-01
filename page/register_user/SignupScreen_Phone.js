import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  // Text,
  TouchableOpacity
} from "react-native";
import Text from '../../components/DefaultText'
import NumPad from "../../components/NumPad";

const lang = require('../../assets/lang/th_TH.json');

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const SignupScreen_Phone = ({ navigation }) => {
  const [phone_Number, setPhoneNumber] = React.useState("")
  const [verify, setVerify] = React.useState(false)

  const setPhone = (phone) => {
    if(verify == true) setVerify(false)
    if(phone == 'Delete'){
      setPhoneNumber(phone_Number.slice(0, -1))
    }
    else if(phone_Number.length < 10){
      setPhoneNumber(phone_Number + phone)
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  React.useEffect(() => {
    if(phone_Number.length == 10) {
      setVerify(true)
    }

    // const time = new Date()
    // setTimeout(() => {
    //   const time2 = new Date()
    //   console.log((time2 - time)/1000)
    // },5000)
  })

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
        onPress={() => {navigation.navigate('Welcome')}}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >{lang.signupscreen_phone.back_btn}</Text>
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
          backgroundColor: verify? '#FFFFFF': null,
        }}
        onPress={() => {
          if(phone_Number.length == 10){
            navigation.navigate('Signup_OTP', {phoneNumber: phone_Number})
            // navigation.navigate('Signup_OTP')
          }
          // else{
          //   setVerify(true)
          // }
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: verify? '#000000': '#A7A7A7',
            textAlign: 'center'
          }}
        >{lang.signupscreen_phone.next_btn}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <Text
          style={{ fontSize: 28, color: '#E0E0E0', marginBottom: 40 }}
        >{lang.signupscreen_phone.title}
        </Text>
        <Text style={{ fontSize: 24, color: '#E0E0E0', marginBottom: 40 }}>{phone_Number}</Text>
        <NumPad setText={setPhone} />
        <View style={{width: '80%', flexDirection: 'row', justifyContent: 'space-between'}}>
          <BackButton {...navigation} />
          <NextButton {...navigation}/>
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
  alert: {
    width: '100%',
    height: screenHeight*(8/100),
    position: 'absolute',
    backgroundColor: '#F86161',
    top: 0,
    zIndex: 1,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default SignupScreen_Phone