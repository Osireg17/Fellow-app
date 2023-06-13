import {StyleSheet, Text, View, Image} from 'react-native'
import React,{useState, createContext, useContext, useEffect} from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { database } from '../config/firebase';
import { doc, getDoc, collection, getDocs, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, where, orderBy} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation, useRoute } from '@react-navigation/native';
// import styles from '../styles/CommentsPage.style'
import Comments from '../components/Comments'

// this component will be used to display the post and comments on a post

function CommentsPage({route}) {
    const navigation = useNavigation();
    const [post, setPost] = useState(null);
    const { postId } = route.params;

    useEffect(() => {
        const fetchPost  = async () => {
            // if the post is public, get it from the publicPosts collection

            const publicPostDoc = await getDoc(doc(database, 'publicPosts', postId));
            if (publicPostDoc.exists()) {
                setPost(publicPostDoc.data());
                return;
            }
            
            // if the post is private, get it from the privatePosts collection

            const privatePostDoc = await getDoc(doc(database, 'privatePosts', postId));
            if (privatePostDoc.exists()) {
                setPost(privatePostDoc.data());
                return;
            }
        };
        
        fetchPost();
    }, []);

    if (!post) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }



  return (
    <SafeAreaProvider>
        <View style={styles.container}>
            <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                <Text style={styles.postTitle}>{post.userOpinionTitle}</Text>
                    <View style={styles.postUser}>
                        <Image
                            source={{ uri: post.userProfilePicture || 'https://via.placeholder.com/30' }}
                            style={styles.postUserImage}
                        />
                        <Text style={styles.postUsername}>{post.username}</Text>
                    </View>
                </View>
                <View style={styles.postBibleInformation}>
                    {post.BibleInformation.map((verse, index) => (
                        <View key={index}>
                            <Text style={styles.postBibleText}>{verse.BibleText}</Text>
                            <Text style={styles.postBibleReference}>{`${verse.BibleBook} ${verse.BibleChapter}:${verse.BibleVerse}`}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.postUserOpinion}>{post.userOpinion}</Text>
            </View>
            <Comments 
                postId={postId}
            />
        </View>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        flex: 1,
        backgroundColor: '#fff',
    },

    postContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    postUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postUserImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10,
    },

    postUsername: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1, // Allows the title to take up the remaining space
    },

    postUserOpinion: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    postBibleInformation: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        marginBottom: 10,
    },

    postBibleText: {
        fontSize: 14,
        marginBottom: 5,
    },

    postBibleReference: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 5,
    },
});

export default CommentsPage
