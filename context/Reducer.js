import { Dispatch } from "react";
import { combineReducers } from "redux";
import auth from '@react-native-firebase/auth'

const initState = {
  user: auth().currentUser? auth().currentUser : [],
}

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case 'UserChange':
      return {
        ...state,
        user: action.user
      }

    default:
      return state
  }
}

export default combineReducers ({users: UserReducer})