import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { database } from '../config/firebase';
import { doc, getDoc, collection, getDocs, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, where, orderBy, serverTimestamp, addDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Comments = ({postId}) => {
  const navigation = useNavigation();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(database, 'comments'), where('postId', '==', postId), orderBy(
      'createdAt',
      'desc'
    )), (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments);
    });

    return unsubscribe;
  }, []);

  const handlePostComment = async () => {
    // create a collection of comments for each post. Store the post ID in the comment document, so you can query for all comments for a post
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    
    const userDoc = await getDoc(doc(database, 'user', uid));
        if (!userDoc.exists()) {
            console.error('User not found in database');
            return;
        }

        const username = userDoc.data().username;
        const userProfilePicture = userDoc.data().profilePicture;

    const comment = {
      text: commentText,
      postId: postId,
      userId: user.uid,
      createdAt: serverTimestamp(),
      username: username,
      userProfilePicture: userProfilePicture,
      likes: [],
      
    };

    const commentRef = collection(database, 'comments');
    addDoc(commentRef, comment);

    setCommentText('');
  }

  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (comment) => {
    
    
  }


  return (
    <SafeAreaProvider>
      <View>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handlePostComment}>
            <Ionicons name="send" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {comments.map((comment) => (
  <View key={comment.id} style={styles.comment}>
    <View style={styles.commentHeader}>
      <Image
        source={{ uri: comment.userProfilePicture || 'https://via.placeholder.com/30' }}
        style={styles.commentUserImage}
      />
      <Text style={styles.commentUsername}>{comment.username}</Text>
    </View>
    <Text style={styles.commentText}>{comment.text}</Text>

  </View>
))}

      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  commentInputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentInput: {
    flex: 1,
  },
  comment: {
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  commentUsername: {
    fontSize: 14,
  },
  commentText: {
    marginTop: 5,
    fontSize: 16,
  },
});

export default Comments

