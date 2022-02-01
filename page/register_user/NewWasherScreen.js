import React from "react";
import {
  SafeAreaView,
  View,
  // Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Text from '../../components/DefaultText'

import { StyleSheet } from "react-native";
const lang = require('../../assets/lang/th_TH.json');

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


const NewWasherScreen = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  setTimeout(() => {
    navigation.navigate('Signup_Phone')
  }, 2000)
  console.log(lang.newwasherscreen)

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <View style={{width: '80%'}}>
          <Text style={styles.title.welcome}>{lang.newwasherscreen.welcome_title}</Text>
          <Text style={styles.title.newwasher}>{lang.newwasherscreen.newwasher_title}</Text>
        </View>
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
  title: {
    welcome: {
      fontSize: 44,
      color: '#FEC64B',
      textAlign: 'left',
      marginBottom: 20
    },
    newwasher: {
      fontSize: 44,
      color: '#FEC64B',
      textAlign: 'right'
    }
    // flexWrap: 'wrap'
  }
})

export default NewWasherScreen