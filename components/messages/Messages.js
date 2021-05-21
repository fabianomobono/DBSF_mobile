import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { colors, styles } from '../../styles'

import { Conversation } from './Conversation'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { selectInfo } from '../info/infoSlice'
import { useSelector } from 'react-redux'

const Stack = createStackNavigator()


export const DMSystem = () => {
  return (
      <Stack.Navigator initialRouteName='All Messages'>
        
      </Stack.Navigator>    
  )
}



export const Messages = ({navigation}) => {
  const info = useSelector(selectInfo)
  return(
    <ScrollView>
      <View>
        {info.friends.length > 0 ? info.friends.map(friend => 
          <ConversationPre
            navigation={navigation}
            last_message_date={friend.last_message_date} 
            user={friend.user} 
            profile_pic={friend.profile_pic}
            last={friend.last}
            first={friend.first}
            key={friend.id}
            id={friend.id}
            />)
          :
          <Text style={styles.empty_list_message}>Uh Oh! You don't have any Friends yet. Try to add them via the search box and they will appear here when they accept your friend request.</Text>
        }
      </View> 
    </ScrollView>
  )
}



const ConversationPre = (props) => {
  const date = new Date(props.last_message_date)
  var now = new Date()
  now.setHours(now.getHours() + 4);

  // function that navigates the the friends profile
  const friendsPage = () => {
    props.navigation.navigate('Friends Profile', {
        profile_pic: props.profile_pic,
        user: props.user,
        first: props.first,
        last: props.last
    })
  }

  return(   
    <View style={messageStyles.container}>
      <TouchableOpacity onPress={friendsPage}>
        <Image style={styles.smallImage} source={{uri: props.profile_pic}}/>
      </TouchableOpacity>
      <View style={messageStyles.convo_info}>
        <Text style={messageStyles.user}>{props.user}</Text>
       
        {now - date > 1000 ? 
          <View style={{backgroundColor: colors.DBSFred, borderRadius: 3}}>
            <Text style={messageStyles.DBSFdate}>{props.last_message_date.substring(0, props.last_message_date.length - 9)}</Text>
          </View>
        :
          <View style={{backgroundColor: colors.DBSFGreen, borderRadius: 3}}>
            <Text style={messageStyles.date}>{props.last_message_date.substring(0, props.last_message_date.length - 9)}</Text>
          </View>
        }
          
       
      </View>
      <View style={{marginLeft: 'auto', backgroundColor: colors.goToColor, borderRadius: 100}}>
        <TouchableOpacity style={{padding: 5}} onPress={() => props.navigation.navigate('Conversation',{
          friend: props.user,
          id: props.id
          })}>
          <MaterialIcons name="keyboard-arrow-right" size={44}  color={colors.silver} />
        </TouchableOpacity>
      </View>
    </View>
  )
}


export const messageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: colors.silver,
    borderRadius: 10,
    margin: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    
  },
  user: {
    fontWeight: 'bold'
  },
  date: {
    color: colors.silver,
    padding: 5,
  },
  DBSFdate: {
    padding: 5,
    color: colors.grey,
  }
})