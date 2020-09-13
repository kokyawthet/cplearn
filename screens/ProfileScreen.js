import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, TextInput, ScrollView } from 'react-native'
import { Ionicons,MaterialIcons } from '@expo/vector-icons'
import * as Firebase from "firebase"
import Fire from '../fire'
import * as ImagePicker from 'expo-image-picker'
import UserPermission from '../utilities/UserPermission'

export default class ProfileScreen extends React.Component{

    state = {
        user: {},
    }
    unsubscribe = null;

    componentDidMount() {
        const user = this.props.uis || Fire.shared.uid
        this.unsubscribe = Fire.shared.fireStore.collection("user").doc(user).onSnapshot(doc => {
            this.setState({ user: doc.data() });
        });
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    handlePickAvatar = async () => {
        UserPermission.getCameraPermission()
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if (!result.cancelled)
        {
            // this.setState({user:{...this.state.user,avatar:result.uri}})
            this.setState({user:{...this.state.user,avatar:result.uri}})
        }
    }

    handleUpdate = () => {
        Fire.shared.updateUser(this.state.user)
    }
    
    

    render() {
        return (
            <View style={styles.container}>
                 <MaterialIcons name="arrow-back" size={32} color="gray"  style={{marginLeft:22,marginTop:18}}
                        onPress={() => this.props.navigation.goBack()} />
                <ScrollView>
                <View style={{ marginTop: 22, alignItems: 'center' }}>
                    <View style={styles.avatarContainer}> 
                          <TouchableOpacity onPress={this.handlePickAvatar} >
                            <Image source={this.state.user.avatar ?
                                { uri: this.state.user.avatar } : require('../assets/artist.jpg')}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{this.state.user.name}</Text>
                </View>

                <View style={styles.form}>
                     <View style={{marginTop:32}}>
                        <Text style={styles.inputTitle} >Full Name</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={name => this.setState({ user:{...this.state.user,name} })}
                            value={this.state.user.name}
                        />
                    </View>
                    <View style={{marginTop:32}}>
                        <Text style={styles.inputTitle} >Email Address</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ user:{...this.state.user,email} })}
                            value={this.state.user.email}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.handleUpdate}>
                        <Text style={{color:"#fff",fontWeight:"500"}}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}
                        onPress={Fire.shared.signOutUser}
                    >
                        <Text style={{ marginTop: 32, color: 'blue' }} >Sign Out</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarContainer: {
        color: "red",
        shadowRadius: 15,
        shadowOpacity:0.5
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius:68
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginTop:16,
        
    },
    form: {
        marginHorizontal: 30,
        marginBottom:66,
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "capitalize",
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color:"#161F3D"
    },
    button: {
        marginTop:32,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent:"center"
    },
})