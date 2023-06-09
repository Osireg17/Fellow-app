import React, { useState, useEffect, useLayoutEffect } from 'react';
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
} from 'react-native';
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../config/firebase';
import { doc, getDoc, collection, getDocs, onSnapshot, query, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
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

function getAllPublicPosts(setPublicPosts) {
  const q = query(collection(database, "publicPosts"));

  return onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });
    setPublicPosts(posts);
  });
}

const PostStats = ({ post, uid, onPraiseUpdate, onCommentClick }) => {
  const [praises, setPraises] = useState(post.praises);
  const [liked, setLiked] = useState(false);

  const handleLikePress = async () => {
    if (!liked) {
      await updateDoc(doc(database, "publicPosts", post.postId), {
        praises: arrayUnion(uid),
      });
      setPraises([...post.praises, uid]);
      setLiked(true);
    } else {
      await updateDoc(doc(database, "publicPosts", post.postId), {
        praises: arrayRemove(uid),
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
    const unsubscribe = getAllPublicPosts(setPublicPosts);
    return unsubscribe; // to unsubscribe from real-time updates when the component unmounts
  }, []);
  

  const [selectedValue, setSelectedValue] = useState("home");

  const layout = useWindowDimensions();


  
  const FirstRoute = ({publicPosts}) => (
    <View style={[styles.scene, { backgroundColor: '#EDEDED' }]}>
      <ScrollView>
        {publicPosts.map((post, index) => {
          return (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Text style={styles.postTitle}>{post.userOpinionTitle}</Text>
                <View style={styles.postUser}>
                  <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfilePage', {uid: post.uid })}>
                  <Text style={styles.postUsername}>{post.username}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfilePage', {uid: post.uid })}>
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
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              <PostStats
                uid={uid}
                post={post}
                onPraiseUpdate={(updatedPraises) => {
                  publicPosts[index].praises = updatedPraises;
                  setPublicPosts([...publicPosts]);
                }}
                onCommentClick={() => {
                  navigation.navigate('Comments', { post });
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#EDEDED' }]} />
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
            height: 120,
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
              {searchBarVisible ? (
                <TextInput
                  style={styles.searchBar}
                  onChangeText={text => setSearchText(text)}
                  value={searchText}
                  placeholder="Search"
                  autoFocus={true}
                  onBlur={() => setSearchBarVisible(false)}
                />
              ) : (
                <>
                  <TouchableOpacity onPress={handleSearchIconPress}>
                    <FontAwesome name="search" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
                    <Image
                      source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
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
