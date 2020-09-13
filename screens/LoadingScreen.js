import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { StackActions } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import * as Firebase from 'firebase' 
import Fire from '../fire'

export default class LoadingScreen extends React.Component {
    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.dispatch(user ? StackActions.replace('Root') : StackActions.replace('Login'))
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        )
    }
  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent:"center"
    }
})
