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


const CreatePinScreen_Success = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <View style={{ width: '80%' }}>
          <Text style={styles.title}>{lang.newwasherscreen.welcome_title}</Text>
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
  title: {
    fontSize: 44,
    color: '#FEC64B',
    textAlign: 'left',
    marginBottom: 20
    // flexWrap: 'wrap'
  }
})

export default CreatePinScreen_Success