import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  // Text,
  TouchableOpacity
} from "react-native";
import Text from '../../components/DefaultText'

const lang = require('../../assets/lang/th_TH.json')

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const TOSScreen = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  })

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <Text style={{fontSize: 20, color: "#E0E0E0", fontWeight: 'bold'}}>{lang.tosscreen.termtitle}</Text>
        <View style={styles.tos_screen}>
          <ScrollView>

          </ScrollView>
        </View>
        <TouchableOpacity 
          style={styles.confirm_btn}
          onPress={() => {
            navigation.navigate('CreatePin')
          }}
        >
          <Text style={{
            fontSize: 16, marginVertical: 10, color: '#000000'
            }}>{lang.tosscreen.confirm_btn}</Text>
        </TouchableOpacity>
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
  tos_screen: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: screenHeight*(75/100),
    borderBottomEndRadius: 40,
    borderTopStartRadius: 40,
    marginTop: 30
  },
  confirm_btn: {
    backgroundColor: '#FFFFFF',
    width: '50%',
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 16

  }
})

export default TOSScreen