import React from "react";

import {
  View,
  TouchableOpacity,
  // Text
} from "react-native";
import Text from './DefaultText'

import Icon from 'react-native-vector-icons/Feather'

const NumButton = (props) => {
  return (
    <TouchableOpacity
      style={{ width: 75, height: 75, backgroundColor: props.color, borderColor: '#707070', borderWidth: 1, borderRadius: 1000, justifyContent: 'center', margin: 15 }}
      onPress={() => { 
        props.setText(props.numlabel)
      }}
    >
      <Text style={{ color: '#212A51', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>{props.numlabel}</Text>
    </TouchableOpacity>
  )
}

const BlankButton = () => {
  return (
    <View style={{ width: 75, height: 75, justifyContent: 'center', margin: 15 }} />
  )
}

const DeleteButton = (props) => {
  return (
    <TouchableOpacity
      style={{ width: 75, height: 75, backgroundColor: '#E0E0E000', justifyContent: 'center', margin: 15 }}
      onPress={() => { 
        props.setText("Delete")
      }}
    >
      <Icon name="delete" style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 32}} />
      {/* <Text style={{ color: '#212A51', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>{props.numlabel}</Text> */}
    </TouchableOpacity>
  )
}

const NumPad = (props) => {
  let padcolor
  if (props.color == undefined){
    padcolor = '#E0E0E0'
  }
  else {
    padcolor = props.color
  }
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <NumButton numlabel={1} setText={props.setText} color={padcolor} />
        <NumButton numlabel={2} setText={props.setText} color={padcolor}/>
        <NumButton numlabel={3} setText={props.setText} color={padcolor}/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <NumButton numlabel={4} setText={props.setText} color={padcolor}/>
        <NumButton numlabel={5} setText={props.setText} color={padcolor}/>
        <NumButton numlabel={6} setText={props.setText} color={padcolor}/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <NumButton numlabel={7} setText={props.setText} color={padcolor}/>
        <NumButton numlabel={8} setText={props.setText} color={padcolor}/>
        <NumButton numlabel={9} setText={props.setText} color={padcolor}/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BlankButton />
        <NumButton numlabel={0} setText={props.setText} color={padcolor}/>
        <DeleteButton setText={props.setText}/>
      </View>

    </View>
  )
}

export default NumPad