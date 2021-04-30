import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { postStyle } from './PostsList'
import { styles } from '../../styles'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import { selectInfo, selectUsername, selectProfile_pic, selectComments, comment_post } from '../info/infoSlice'
import { selectToken } from '../status/statusSlice'
import { KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


  export const SinglePostPage = ({ route }) => {

    // parames from route
    const {text, author, date, profile_pic, id} = route.params
    // state components
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    
    const dispatch = useDispatch()
    // get the token from the redux store for sending requests
    const token = useSelector(selectToken)
   
    const current_user = useSelector(selectUsername)
    const current_user_profile_pic = useSelector(selectProfile_pic)

    useEffect(() => {
      fetch('https://dbsf.herokuapp.com/api/get_comments_for_post', {
        method: "POST",
        headers: {
          Authorization: 'Token '.concat(token)
        },
        body: JSON.stringify({post_id: id})
        
      })
      .then(res => res.json())
      .then(res => setComments(res))
      .catch(res => {
        console.log('Something went wrong')
        console.log(res)
      })
    },[])
    
    const new_comment = () => {
      if (commentText.length > 0 && commentText[0] !== ' '){
         //send the comment in a post request to the server
      fetch('https://dbsf.herokuapp.com/api/comment', {
        method: 'POST',
        headers: {
          Authorization: 'Token '.concat(token),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          post_id: id,
          text: commentText
        })
      })
      .then(res => res.json())
      .then(res => {   
       setComments([...comments, {
        commentator: res.commentator, 
        date: res.date, 
        id: res.id, 
        profile_pic: res.profile_pic, 
        text: res.text,
       }])

        // now you have to update the redux store
      }).catch(console.log('noooooo something is going wrong....again'))
        setCommentText('')
      }
      else {
        alert('Comments can not be empty...or start with a space')
      } 
    }
  
    return (      
          <KeyboardAwareScrollView>
            <View style={SinglePostStyle.container}>
              <View style={postStyle.info}>
                <Image source={{uri:profile_pic}} style={styles.smallImage}/>
                <View>
                  <Text style={postStyle.author}>{author}</Text>
                  <Text style={postStyle.date}>{date}</Text>
                </View>
              </View>
              <View style={postStyle.postBody}>
                <Text style={postStyle.text}>
                  {text}
                </Text>
                <View style={SinglePostStyle.commentContainer}>
                  {comments.map(c => <Comment key={c.id} text={c.text} commentator={c.commentator} commentator_profile_pic={c.profile_pic}/>)}
                </View>
                <TextInput 
                  style={SinglePostStyle.commentTextInput} 
                  placeholder='Comment...' value={commentText} 
                  onChangeText={comment => setCommentText(comment)}
                  onSubmitEditing={new_comment}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
    )
}

const Comment = (props) => {
    return (
        <View style={SinglePostStyle.comment}>
          <View style={SinglePostStyle.commentInfo}>
            <Image source={{uri: props.commentator_profile_pic}} style={SinglePostStyle.commentPic}/>
            <Text style={SinglePostStyle.commentAuthor}>{props.commentator}</Text>
          </View>
          <Text style={SinglePostStyle.commentText}>{props.text}</Text>
        </View>
    )
}

const SinglePostStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      borderColor: '#ddd',
      borderWidth: 1,
         
    },
    commentTextInput: {
        backgroundColor: '#eee',
        padding: 20,
        fontSize: 15,
        borderRadius: 20,
        color: '#444',
        marginTop: 5,
        margin: 10,
        
    },
    commentContainer: {
        borderColor: '#999',
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
    },
    comment: {
        backgroundColor: 'rgba(200, 200, 200, 0.8)',
        padding: 10,
        margin: 3,
        borderColor: 'grey',
        borderWidth: 3,
        borderRadius: 10,        
    },
    commentText: {
        color: '#666',
        fontSize: 15,
        marginLeft: 5,
    },
    commentPic: {
        width: 20,
        height: 20,
        borderRadius: 20,
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    commentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,

    }
})