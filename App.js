import React from 'react';
import {YellowBox,StatusBar} from 'react-native'
import { NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Ionicons, MaterialIcons} from '@expo/vector-icons'
import * as Firebase from 'firebase'

import HomeScreen from './screens/HomeScreen'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'

import AddPost from './screens/AddPost'
import CategoryScreen from './screens/Category'
import ProfileScreen from './screens/ProfileScreen'
import CategoryList from './screens/CategoryList'
import CatPostList from './screens/CatPostList'
import EditPost from './screens/editPost'

 var firebaseConfig = {
    apiKey: "AIzaSyBvSo0MRtUccyfLhEReClh61BPLr7t6fY8",
    authDomain: "socialapp-175f4.firebaseapp.com",
    databaseURL: "https://socialapp-175f4.firebaseio.com",
    projectId: "socialapp-175f4",
    storageBucket: "socialapp-175f4.appspot.com",
    messagingSenderId: "274603733293",
    appId: "1:274603733293:web:6613b1625319c8c4e7a3a4"
  };
  // Initialize Firebase
 if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['FIREBASE WARNING']);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootHome = () => {
  return (
    <Tab.Navigator
       screenOptions={({ route }) => ({
          tabBarIcon: ({color}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'CategoryList'){
              iconName = 'library-books';
            }else if (route.name === 'AddPost') {
               iconName = 'add-circle';
            } else if (route.name === 'AddCat') {
              iconName = 'note-add';
            }
            return <MaterialIcons name={iconName} size={32} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#E9446A",
          inactiveTintColor: 'gray',
          showLabel:false
        }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CategoryList" component={CategoryList} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="AddCat" component={CategoryScreen} />
    </Tab.Navigator>
  )
}

export default () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen}  />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CatPostList" component={CatPostList} />
        <Stack.Screen name="EditPost" component={EditPost} />
        <Stack.Screen name="Root" component={RootHome} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

