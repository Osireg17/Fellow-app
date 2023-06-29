import {Text, View, TouchableOpacity, Image, FlatList, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/profilePage.style'
import { Header as HeaderRNE,  Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { doc, onSnapshot, collection, where, query, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Clipboard from 'expo-clipboard';
import { DrawerActions } from '@react-navigation/native';
import { TabView, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';



function ProfileHeader({ navigation }) {
  // open the drawer when the menu icon is pressed
  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <HeaderRNE
      rightComponent={
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfilePage');
            }}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
      }
      containerStyle={{
        backgroundColor: 'white',
        justifyContent: 'space-around',
        height: 100,
      }}
    />
  );
}

function UserProfile() {
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [praises, setPraises] = useState([]);
  const [favoriteVerse, setFavoriteVerse] = useState('');
  const [church, setChurch] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    

    const userDocRef = doc(database, 'user', userId);
    
    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        setUsername(userDocSnap.data().username);
        setFollowers(userDocSnap.data().followers);
        setFollowing(userDocSnap.data().following);
        setPraises(userDocSnap.data().totalPraises);
        setFavoriteVerse(userDocSnap.data().favouriteVerse);
        setChurch(userDocSnap.data().church);
        setProfilePic(userDocSnap.data().profilePicture);
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.log("Error fetching user's profile picture:", error);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(username);
    alert('Copied to Clipboard!');
  };

  // write a function that will get all the praisesCount from every post with the same userID, and add them up and display it

  return (
  <View style={styles.profileContainer}>
    <Text style={styles.username}>
      {username}
    </Text>
    <View style={styles.headerContainer}>
      <Avatar
        rounded
        size={80}
        source={{ uri: profilePic || 'https://via.placeholder.com/200' }}
        containerStyle={styles.avatar}
      />
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>{followers.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statValue}>{following.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Praises</Text>
          <Text style={styles.statValue}>{praises ? praises : 0}</Text>
        </View>
      </View>
    </View>
    <View style={styles.detailsContainer}>
      <View style={styles.detail}>
        <Text style={styles.label}>Favorite Verse:</Text>
        <Text style={styles.value}>{favoriteVerse}</Text>
        <Text style={styles.label}>Church:</Text>
        <Text style={styles.value}>{church}</Text>
      </View>
    </View>
  </View>
);

}

const PublicPostsRoute = ({navigation}) => {
  const [publicPosts, setPublicPosts] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchPosts = async () => {
      const publicCollection = collection(database, 'public');
      const publicQuery = query(publicCollection, where('uid', '==', userId));
      const publicDocs = await getDocs(publicQuery);

      let allPublicPosts = [];
      publicDocs.forEach(doc => {
        allPublicPosts.push({ ...doc.data(), id: doc.id });
      });

      setPublicPosts(allPublicPosts);
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={publicPosts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const createdAt = item.createdAt ? item.createdAt.toDate().toLocaleString() : '';
        return (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{item.userOpinionTitle}</Text>
              <View style={styles.postUser}>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Text style={styles.postUsername}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Image
                    source={{ uri: item.userProfilePicture || 'https://via.placeholder.com/40' }}
                    style={styles.postUserImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {item.BibleInformation.map((info, infoIndex) => {
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
            <Text style={styles.postUserOpinion}>{item.userOpinion}</Text>
            <Text style={styles.postTimestamp}>{createdAt}</Text>
            <View style={styles.postFooter}>
              <View style={styles.praiseContainer}>
                <AntDesign name="heart" size={24} color="red" />
                <Text style={styles.praiseCount}>{item.praises ? item.praises.length : 0}</Text>
              </View>
              <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate('CommentsPage', { postId: item.id })}>
                <AntDesign name="message1" size={24} color="black" />
                <Text style={styles.commentCount}>{item.comments ? item.comments.length : 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
};

const PrivatePostsRoute = ({navigation}) => {
  const [privatePosts, setPrivatePosts] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchPosts = async () => {
      const publicCollection = collection(database, 'private');
      const publicQuery = query(publicCollection, where('uid', '==', userId));
      const publicDocs = await getDocs(publicQuery);

      let allPublicPosts = [];
      publicDocs.forEach(doc => {
        allPublicPosts.push({ ...doc.data(), id: doc.id });
      });

      setPrivatePosts(allPublicPosts);
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={privatePosts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const createdAt = item.createdAt ? item.createdAt.toDate().toLocaleString() : '';
        return (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{item.userOpinionTitle}</Text>
              <View style={styles.postUser}>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Text style={styles.postUsername}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Image
                    source={{ uri: item.userProfilePicture || 'https://via.placeholder.com/40' }}
                    style={styles.postUserImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {item.BibleInformation.map((info, infoIndex) => {
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
            <Text style={styles.postUserOpinion}>{item.userOpinion}</Text>
            <Text style={styles.postTimestamp}>{createdAt}</Text>
            <View style={styles.postFooter}>
              <View style={styles.praiseContainer}>
                <AntDesign name="heart" size={24} color="red" />
                <Text style={styles.praiseCount}>{item.praises ? item.praises.length : 0}</Text>
              </View>
              <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate('CommentsPage', { postId: item.id })}>
                <AntDesign name="message1" size={24} color="black" />
                <Text style={styles.commentCount}>{item.comments ? item.comments.length : 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
};

const QuestionsRoute = ({navigation}) => {
  const [questionsPost, setQuestionsPost] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchPosts = async () => {
      const publicCollection = collection(database, 'questions');
      const publicQuery = query(publicCollection, where('uid', '==', userId));
      const publicDocs = await getDocs(publicQuery);

      let allPublicPosts = [];
      publicDocs.forEach(doc => {
        allPublicPosts.push({ ...doc.data(), id: doc.id });
      });

      setQuestionsPost(allPublicPosts);
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={questionsPost}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const createdAt = item.createdAt ? item.createdAt.toDate().toLocaleString() : '';
        return (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postUser}>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Text style={styles.postUsername}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if (item.uid === userId) {navigation.navigate('Profile');} else {
                  navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                  <Image
                    source={{ uri: item.userProfilePicture || 'https://via.placeholder.com/40' }}
                    style={styles.postUserImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.postUserQuestion}>{item.question}</Text>
            <Text style={styles.postTimestamp}>{createdAt}</Text>
            <View style={styles.postFooter}>
              <View style={styles.praiseContainer}>
                <AntDesign name="heart" size={24} color="red" />
                <Text style={styles.praiseCount}>{item.praises ? item.praises.length : 0}</Text>
              </View>
              <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate('CommentsPage', { postId: item.id })}>
                <AntDesign name="message1" size={24} color="black" />
                <Text style={styles.commentCount}>{item.comments ? item.comments.length : 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      }
    />
  );
};

export default function ProfilePage({navigation}) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'public', title: 'Public' },
    { key: 'private', title: 'Private' },
    { key: 'questions', title: 'Questions' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'public':
        return <PublicPostsRoute navigation={navigation} />;
      case 'private':
        return <PrivatePostsRoute navigation={navigation} />;
      case 'questions':
        return <QuestionsRoute navigation={navigation} />;
      default:
        return null;
    }
  };
  

  
  return (
    <SafeAreaProvider>
      <ProfileHeader navigation={navigation} />
      <SafeAreaView style={{ flex: 1 }}>
        <UserProfile />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'black' }}
              style={{ backgroundColor: 'white'}}
              labelStyle={{ color: 'black' }}  // set color for labels
              activeColor="black"  // set active color for labels
            />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}