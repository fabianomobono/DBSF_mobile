import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { add_post, selectInfo, selectPosts, selectProfile_pic, update_info } from '../info/infoSlice'
import { colors, styles } from '../../styles';
import { useDispatch, useSelector } from 'react-redux'

import { FindPeople } from '../find/FindPeople';
import { FriendRequests } from '../friendRequests/FriendRequests'
import { Messages } from '../messages/Messages'
import { Post } from '../posts/PostsList'
import { Profile } from '../profile/Profile';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { logoutScreen } from '../login/login';
import { selectToken } from '../status/statusSlice';

// this is the tab navigator that contains the feed, messages, profile
const Tab = createBottomTabNavigator()
export const Main = () => {
  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {

          if (route.name === 'Messages') {
           return <MaterialIcons name="message" size={24} color={colors.white}/>
          } 
          
          else if(route.name === 'Feed') {
            return <FontAwesome5 name="home" size={24} color={colors.white} />
          }

          else if(route.name === 'Profile'){
            return <MaterialIcons name="face" size={24} color={colors.white} />
          }

          else if (route.name === 'Logout'){
            return <MaterialIcons name="logout" size={24} color={colors.white} />
          }

          else if (route.name === 'Search') {
            return <FontAwesome name="search" size={24} color={colors.white} />
          }

          else if (route.name === 'Friendship Requests') {
            return <AntDesign name="adduser" size={24} color={colors.white} />
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.white,
        inactiveTintColor: colors.silver,
        showLabel: false,
        style: {    
          backgroundColor: colors.DBSFBlue,
          height: 80,
          fontSize: 50,
        },
        labelStyle: {
          fontSize: 20
        }
      }}
    >
        <Tab.Screen name='Feed' component={HomeScreen}/>
        <Tab.Screen name='Messages' component={Messages}/>
        <Tab.Screen name='Profile' component={Profile}/>
        <Tab.Screen name='Search' component={FindPeople} />
        <Tab.Screen name='Friendship Requests' component={FriendRequests}/>
        <Tab.Screen name='Logout' component={logoutScreen}/>      
      </Tab.Navigator>
  )
}


export function HomeScreen({navigation}) {

  // get posts from the redux-store
  const posts = useSelector(selectPosts)
  // define current text in the textInput and the list of posts
  const [text, setText] = useState('')
  const profile_pic = useSelector(selectProfile_pic)
  const [user, setUser] = useState('')
  // redux stuff
  // set up dispatch call
  const dispatch = useDispatch()
  // get the token from the store
  const token = useSelector(selectToken)
  
  // when the component mounts request data from the server
  useEffect( () => {
    
    // when the component mounts request data from the server
    fetch('https://dbsf.herokuapp.com/api/get_info', 
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
            Authorization: "Token ".concat(token)
        },
        credentials: 'same-origin',  
      }).then(res => res.json()).then(r => {
   
        setUser(r.hello.user)
        console.log('useEffect in HomeScreen Component has been called...this gets triggered when the get info fetch comes back')
 
        // add the information to the redux store
        dispatch(update_info(r.hello))
        
      })
    .catch(r => alert('something went wronghnjmkmk'));
  },[])
  
  // add a new post to the feed
  const new_post = () => {  
    
    // send the post to the server so it can be saved in the database
    if (text.length > 1) {
      fetch('https://dbsf.herokuapp.com/api/new_post', {
      method: 'POST',
      headers: {
        'Authorization': 'Token '.concat(token),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({text: text})
    })
    .then(res => res.json())
    .then(res => {
      const r = res.response
      // when the response comes back update the redux store with the new posts
      dispatch(add_post({text: r.text, author: r.author, author_picture: profile_pic, date: r.date, id: r.id, comments: r.comments}))
      console.log('redux store was updated...i think')
    })
    .catch(r => console.log('this does not work'))
    setText('')
    }
    else {
      alert('post text needs to be longer')
    }
  }

  return (
    <View >
      <View style={homeStyle.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{uri: profile_pic}} style={styles.smallImage}/>
        </TouchableOpacity>        
        <TextInput
          value={text} 
          style={homeStyle.textInput} 
          onChangeText={text => setText(text)}
          onSubmitEditing={new_post} placeholder='Write a post'/> 
      </View>
      <ScrollView style={{height: '90%'}} >
       <View>
        {
          posts.length  > 0 ? posts.map(t => 
            <Post
              navigation={navigation}
              id={t.id}
              key={t.id} 
              text={t.text} 
              author={t.author}
              first={t.first}
              last={t.last} 
              profile_pic={t.author_picture}
              date={t.date}/>)
          : 
            <Text style={styles.empty_list_message}>No posts here. Try to search for friends in the search box and add them as friends. You'll see posts appear over time!</Text>
        }
       </View>
      </ScrollView>
    </View>
  );
}

const homeStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.silver,
  },

  textInput: { 
    borderColor: colors.grey,
    borderWidth: 1,
    backgroundColor: colors.white,
    fontSize: 20,
    padding: 10,
    margin: 10,
    width: 340,
    textAlign: 'center',
    borderRadius: 20,
  },
  navbar: {
    flex: 1,
    borderWidth: 4,
    height: 1,
  },
 
})