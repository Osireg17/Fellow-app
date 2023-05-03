import {View, ActivityIndicator} from 'react-native'
import React,{useState, createContext, useContext, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'

import Welcome_Screen from '../screens/Welcome_Screen'
import SignUp from '../screens/Authentication/SignUp'
import CreateProfile from '../screens/Authentication/CreateProfile'
import Login from '../screens/Authentication/LogIn'
import BiblePage from '../screens/Bible/BiblePage'
import Home from '../screens/Home';
import Questions from '../screens/Feeds/Questions';
import ProfilePage from '../screens/Profile/ProfilePage';
import Activity from '../screens/Feeds/Activity'
import Settings from '../screens/Profile/Settings'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign, Ionicons, MaterialCommunityIcons, FontAwesome5, Octicons, FontAwesome } from '@expo/vector-icons';


import { auth } from '../config/firebase'


const Stack = createStackNavigator()
const AuthenticatedUserContext = createContext({});

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// create a drawer navigator for the profile page
function ProfileDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}


function Feeds() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          position: 'absolute',
          height: 110,
          paddingTop: 20,
          
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Questions"
        component={Questions}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="comment-question-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bible"
        component={BiblePage}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="bible" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
      name="Activity"
      component={Activity}
      options={{
        tabBarIcon: ({ color }) => <FontAwesome name="bell-o" size={24} color={color}/>,
        headerShown: false,
      }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const AuthenticatedUserProvider = ({children}) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{authenticatedUser, setAuthenticatedUser, isProfileCreated, setIsProfileCreated}}>
      {loading ? <View><ActivityIndicator/></View> : children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuthenticatedUser = () => useContext(AuthenticatedUserContext);

const MainStack = () => {
  const { authenticatedUser, isProfileCreated, setIsProfileCreated } = useAuthenticatedUser();

  return (
    <Stack.Navigator>
      {!isProfileCreated && authenticatedUser ? (
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{headerShown: false}}
        />
      ) : null}
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Feeds"
            component={Feeds}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={Welcome_Screen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthenticatedUserProvider>
        <MainStack />
      </AuthenticatedUserProvider>
    </NavigationContainer>
  );
}
