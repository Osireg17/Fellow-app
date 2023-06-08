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
import { FontAwesome, Feather } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../config/firebase';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/Home.style"
import DropDownPicker from 'react-native-dropdown-picker';

// const FirstRoute = ({publicPosts}) => (
//   <View style={[styles.scene, { backgroundColor: '#EDEDED' }]}>
//     <ScrollView>
//       {publicPosts.map((post, index) => {
//         return (
//           <View key={index} style={styles.postContainer}>
//             <Text style={styles.postUserOpinion}>{post.userOpinion}</Text>
//             <Text style={styles.postTimestamp}>{post.timestamp}</Text>
//             <View style={styles.postBibleInformation}>
//               {post.BibleInformation.map((info, infoIndex) => {
//                 return (
//                   <Text key={infoIndex} style={styles.postBibleText}>
//                     Book: {info.BibleBook}, Chapter: {info.BibleChapter}, Verse: {info.BibleVerse}, Text: {info.BibleText}
//                   </Text>
//                 );
//               })}
//             </View>
//             <View style={styles.postStats}>
//               <Text style={styles.postStatsText}>Praises: {post.praises}</Text>
//               <Text style={styles.postStatsText}>Comments: {post.comments}</Text>
//             </View>
//           </View>
//         );
//       })}
//     </ScrollView>
//   </View>
// );


// const SecondRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#EDEDED' }]} />
// );

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

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
async function getAllPublicPosts() {
  const posts = [];
  
  const querySnapshot = await getDocs(collection(database, "publicPosts"));
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });

  return posts;
}


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
    getAllPublicPosts().then((fetchedPosts) => {
      setPublicPosts(fetchedPosts);
      console.log('Fetched posts:', fetchedPosts);
    });
  }, []);
  

  // I want a function that will return all of the posts from every user that the current user is following

  const [selectedValue, setSelectedValue] = useState("home");

  const layout = useWindowDimensions();

  const FirstRoute = ({publicPosts}) => (
    <View style={[styles.scene, { backgroundColor: '#EDEDED' }]}>
      <ScrollView>
        {publicPosts.map((post, index) => {
          return (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postBibleInformation}>
                {post.BibleInformation.map((info, infoIndex) => {
                  return (
                    <Text key={infoIndex} style={styles.postBibleReference}>
                      {info.BibleBook} {info.BibleChapter}:{info.BibleVerse}
                      {"\n"}
                      {"\n"}
                      {info.BibleText}
                    </Text>
                  );
                })}
              </View>
              <Text style={styles.postUserOpinion}>{post.userOpinion}</Text>
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStatsText}>Praises: {post.praises}</Text>
                <Text style={styles.postStatsText}>Comments: {post.comments}</Text>
              </View>
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
          // rightComponent={
          //   <View style={styles.rightComponent}>
          //     <TouchableOpacity onPress={handleSearchIconPress}>
          //       <FontAwesome name="search" size={24} color="black" />
          //     </TouchableOpacity>
          //     <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
          //     <Image
          //         source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
          //         style={styles.profileImage}
          //       />
          //     </TouchableOpacity>
          //   </View>
          // }
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
