import auth from '@react-native-firebase/auth';
import React from 'react';
import database from '@react-native-firebase/database';


export class UserService {

  async createUser(pin) {
    const user = auth().currentUser
    database()
      .ref(`/users/${user.uid}`)
      .set({
        pin_id: pin,
        attemp: {
          count: 0,
        }
      })
      .then(() => console.log('Data set'))
  }

  async getUserPin() {
    const user = auth().currentUser
    let user_pin = ""
    await database()
      .ref(`/users/${user.uid}`)
      .once('value')
      .then(snapshot => {
        user_pin = snapshot.val().pin_id
      });
    
    return user_pin
  }

  async setCountWrongPin() {
    const user = auth().currentUser
    const data = (await database().ref(`/users/${user.uid}/attemp`).once('value')).val()
    database()
      .ref(`/users/${user.uid}/attemp`)
      .set({
        count: (data? data.count : 0) + 1,
      })
  }

  async setCountDownDatePin(date) {
    const user = auth().currentUser
    const data = (await database().ref(`/users/${user.uid}/attemp`).once('value')).val()
    database()
      .ref(`/users/${user.uid}/attemp`)
      .set({
        lock_date: date,
        count: 0
      })
  }

  async getUserAttemp() {
    const user = auth().currentUser
    const data = (await database().ref(`/users/${user.uid}/attemp`).once('value')).val()
    return data
  }

  async resetAttemp() {
    const user = auth().currentUser
    database()
      .ref(`/users/${user.uid}/attemp`)
      .update({
        count: 0,
      })
    database()
      .ref(`/users/${user.uid}/attemp/lock_date`)
      .set(null)
  }
}