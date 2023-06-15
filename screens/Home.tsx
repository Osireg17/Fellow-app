import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  SafeAreaView, 
  ScrollView,
  TextInput,
  RefreshControl
} from 'react-native';
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../config/firebase';
import { doc, getDoc, collection, getDocs, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, where, orderBy} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/Home.style"
import DropDownPicker from 'react-native-dropdown-picker';


async function fetchProfilePicture(uid) {
  try {
    const userDocRef = doc(database, "user", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data().profilePicture;
    } else {
      console.log("No such document!");
      return '';
    }
  } catch (error) {
    console.log("Error fetching user's profile picture:", error);
    return '';
  }
}

// I want a function that will return all of the posts from every user in the database regardless of whether or not the user is following them
// async function getAllPublicPosts() {
//   const posts = [];
  
//   const querySnapshot = await getDocs(collection(database, "publicPosts"));
//   querySnapshot.forEach((doc) => {
//     posts.push(doc.data());
//   });

//   return posts;
// }

function getAllPublicPosts(setPublicPosts, value) {
  const q = query(
    collection(database, "public"),
    orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    let posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt });
    });

    posts = sortPosts(posts, value); // Sort the posts
    setPublicPosts(posts); // Update the state with the fetched posts
  });
}

// async function getAllPublicPosts(setPublicPosts, value) {
//   const q = query(
//     collection(database, "public"),
//     orderBy("createdAt", "desc"));

//   const querySnapshot = await getDocs(q);
//   let posts = [];
//   querySnapshot.forEach((doc) => {
//     posts.push({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt });
//   });

//   posts = sortPosts(posts, value); // Sort the posts
//   setPublicPosts(posts); // Update the state with the fetched posts
// }



function getAllPrivatePosts(setPrivatePosts, value) {
  const auth = getAuth();
  const currentUserUid = auth.currentUser.uid;

  // First fetch the connections array from the current user's document
  const currentUserDocRef = doc(database, 'user', currentUserUid);
  
  // Use onSnapshot to listen to changes in the user document
  onSnapshot(currentUserDocRef, (currentUserDocSnap) => {
    if (currentUserDocSnap.exists()) {
      // Create a copy of the connections array and add the current user's uid to it
      const connections = [...currentUserDocSnap.data().connections, currentUserUid];

      // Then query the privatePosts collection
      const q = query(collection(database, "private"), 
      where("uid", "in", connections),
      orderBy("createdAt", "desc")
      );

      // Use onSnapshot to listen to changes in the privatePosts collection
      onSnapshot(q, (querySnapshot) => {
        let posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt });
        });
        
        posts = sortPosts(posts, value); // Sort the posts
        setPrivatePosts(posts);
      });
    } else {
      console.log(`No document exists for user with uid: ${currentUserUid}`);
    }
  });
}

function sortPosts(posts, value) {
  // Define a function that sorts posts based on the value of the dropdown
  switch (value) {
    case 'trending':
      // Sort posts in descending order by likes
      return posts.sort((a, b) => b.praises.length - a.praises.length);
    case 'latest':
      // Sort posts in descending order by creation time
      return posts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    case 'home':
    default:
      // Return posts as they are
      return posts;
  }
}


const PostStats = ({ post, uid, onPraiseUpdate, onCommentClick, postType }) => {
  const [praises, setPraises] = useState(post.praises);
  const [liked, setLiked] = useState(false);

  const handleLikePress = async () => {
    if (!liked) {
      await updateDoc(doc(database, postType, post.postId), {
        praises: arrayUnion(uid),
        praisesCount: post.praises.length + 1,
      });
      setPraises([...post.praises, uid]);
      setLiked(true);
    } else {
      await updateDoc(doc(database, postType, post.postId), {
        praises: arrayRemove(uid),
        praisesCount: post.praises.length - 1
      });
      setPraises(post.praises.filter(praise => praise !== uid));
      setLiked(false);
    }
  };

  useEffect(() => {
    setLiked(post.praises.includes(uid));
    setPraises(post.praises);
  }, [post]);

  return (
    <View style={styles.postStats}>
      <TouchableOpacity onPress={handleLikePress}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={24}
            color={liked ? "red" : "black"}
            style={styles.icon}
          />
          <Text style={styles.postStatsText}>{praises.length}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCommentClick}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="message-badge-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.postStatsText}>{post.comments}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function MainFeed({navigation}) {

  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'For You' },
    { key: 'second', title: 'Following' },
  ]);


  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Trending', value: 'trending'},
    {
      label: 'Latest',
      value: 'latest',
    },
    {
      label: 'Home',
      value: 'Home',
    }
  ]);
  const [profilePicture, setProfilePicture] = useState('');
  const [publicPosts, setPublicPosts] = useState([]);
  const [privatePosts, setPrivatePosts] = useState([]);

  const [publicRefreshing, setPublicRefreshing] = useState(false);
  const [privateRefreshing, setPrivateRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);


  const auth = getAuth();
  const uid = auth.currentUser.uid;



  useEffect(() => {
    fetchProfilePicture(uid).then((pictureUrl) => {
      console.log('Profile picture URL:', pictureUrl);
      setProfilePicture(pictureUrl);

    });
  }, [uid]);
  
  const NavigateToProfile = () => {
    //complete the function to navigate to the profile page
    navigation.navigate('Profile');
  }

  

  const handleSearchIconPress = () => {
    setSearchBarVisible(true);
  };

  useEffect(() => {
    const unsubscribe = getAllPublicPosts(setPublicPosts, value);
    return unsubscribe; // to unsubscribe from real-time updates when the component unmounts
  }, [value]);



  useEffect(() => {
    const unsubscribe = getAllPrivatePosts(setPrivatePosts, value);
    return unsubscribe; // to unsubscribe from real-time updates when the component unmounts
  }, [value]);
  

  const [selectedValue, setSelectedValue] = useState("home");


  
  const FirstRoute = ({publicPosts}) => (
    <View style={[styles.scene, { backgroundColor: '#EDEDED' }]}>
      <ScrollView>
        {publicPosts.map((post, index) => {
          const createdAt = post.createdAt ? post.createdAt.toDate().toLocaleString() : '';
          return (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Text style={styles.postTitle}>{post.userOpinionTitle}</Text>
                <View style={styles.postUser}>
                <TouchableOpacity onPress={() => {if (post.uid === uid) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: post.uid });}}}>
                  <Text style={styles.postUsername}>{post.username}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {if (post.uid === uid) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: post.uid });}}}>
                  <Image
                    source={{ uri: post.userProfilePicture || 'https://via.placeholder.com/40' }}
                    style={styles.postUserImage}
                  />
                  </TouchableOpacity>
                </View>
              </View>
              {post.BibleInformation.map((info, infoIndex) => {
                return (
                  <View key={infoIndex} style={styles.postBibleInformation}>
                    <Text style={styles.postBibleReference}>
                      {info.BibleBook} {info.BibleChapter}:{info.BibleVerse}
                    </Text>
                    <Text style={styles.postBibleText}>
                      "{info.BibleText}"
                    </Text>
                  </View>
                );
              })}
              <Text style={styles.postUserOpinion}>{post.userOpinion}</Text>
              <Text style={styles.postTimestamp}>{createdAt}</Text>
              <PostStats
                uid={uid}
                post={post}
                onPraiseUpdate={(updatedPraises) => {
                  publicPosts[index].praises = updatedPraises;
                  setPublicPosts([...publicPosts]);
                }}
                onCommentClick={() => {
                  navigation.navigate('CommentsPage', { postId: post.id, post: post });
                }}
                postType={'public'}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#EDEDED'}]}>
      <ScrollView>
        {privatePosts.map((post, index) => {
          const createdAt = post.createdAt ? post.createdAt.toDate().toLocaleString() : '';
          return (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Text style={styles.postTitle}>{post.userOpinionTitle}</Text>
                <View style={styles.postUser}>
                <TouchableOpacity onPress={() => {if (post.uid === uid) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: post.uid });}}}>
                  <Text style={styles.postUsername}>{post.username}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {if (post.uid === uid) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: post.uid });}}}>
                  <Image
                    source={{ uri: post.userProfilePicture || 'https://via.placeholder.com/40' }}
                    style={styles.postUserImage}
                  />
                  </TouchableOpacity>
                </View>
              </View>
              {post.BibleInformation.map((info, infoIndex) => {
                return (
                  <View key={infoIndex} style={styles.postBibleInformation}>
                    <Text style={styles.postBibleReference}>
                      {info.BibleBook} {info.BibleChapter}:{info.BibleVerse}
                    </Text>
                    <Text style={styles.postBibleText}>
                      "{info.BibleText}"
                    </Text>
                  </View>
                );
              })}
              <Text style={styles.postUserOpinion}>{post.userOpinion}</Text>
              <Text style={styles.postTimestamp}>{createdAt}</Text>
              <PostStats
                uid={uid}
                post={post}
                onPraiseUpdate={(updatedPraises) => {
                  privatePosts[index].praises = updatedPraises;
                  setPrivatePosts([...privatePosts]);
                }}
                onCommentClick={() => {
                  navigation.navigate('CommentsPage', { postId: post.id, post: post });
                }}
                postType={'private'}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderScene = ({route}) => {
    switch(route.key) {
      case 'first':
        return <FirstRoute publicPosts={publicPosts} />;
      case 'second':
        return <SecondRoute />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <HeaderRNE
          containerStyle={{
            height: 100,
            paddingBottom: 30,
            paddingTop: 20,
            backgroundColor: '#FFFFFF',
            zIndex: 100
          }}
          leftComponent={
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                placeholder='Home'
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: 0,
                  borderColor: "white",
                  borderRadius: 0,
                }}
                containerStyle={{
                  width: 150,
                  height: 40,
                  borderRadius: 0,
                }}
                
              />
            </View>
          }
          rightComponent={
            <View style={styles.rightComponent}>
                  <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
                    <Image
                      source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>
            </View>
          }
        />
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          animationEnabled={true}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicator}
              style={styles.tabBar}
              labelStyle={styles.label}
            />
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}