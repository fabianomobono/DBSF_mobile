import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { LoginPage, SignUpScreen } from '../login/login'
import { Main } from '../home/HomeScreen'
import { login_token, selectToken } from '../status/statusSlice'
import { SinglePostPage } from '../posts/SinglePostPage';
import { FriendsProfile } from '../profile/FriendsProfile';
import { WellArchitected } from 'aws-sdk';
import { Conversation } from '../messages/Conversation';
import { colors, styles } from '../../styles';
 
const Stack = createStackNavigator()


export function Whole() {
  const [loggedIn, setLoggedIn] = useState(null)
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if (value !== null) {
        
        //update the redux store and THEN set the value
        dispatch(login_token(value))
        setLoggedIn(value)
      }
      
    } 
    catch(e) {
      // error reading value
     alert(e)
    }
  }

  // when the component mounts call get data which check if the token exists
  useEffect(() =>{
    getData()
    console.log("in get!!! UseEffect in WHole and the token is :")
    
  })
  
  if (token) {
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'  screenOptions={
            {headerStyle: {
              backgroundColor: colors.DBSFBlue,
              
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold'
            },
          }} >  
            <Stack.Screen name='Home' title='Home' component={Main}  />
            <Stack.Screen name='Single Post' title='Single Post' component={SinglePostPage}/>
            <Stack.Screen name='Friends Profile' title='Friends Profile' component={FriendsProfile}/>
            <Stack.Screen name='Conversation' title='Conversation' component={Conversation}/>
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
  else {
    return(
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' screenOptions={
            {headerStyle: {
              backgroundColor: colors.DBSFBlue,
              
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold'
            },
           
          }} >  
            <Stack.Screen name="Login" component={LoginPage} title='Login' />
            <Stack.Screen name='SignUp' component={SignUpScreen} /> 
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
}