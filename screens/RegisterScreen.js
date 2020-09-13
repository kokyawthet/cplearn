import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image,ScrollView } from 'react-native'
import * as Firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import UserPermission from '../utilities/UserPermission'
import Fire from '../fire'

export default class RegisterScreen extends React.Component {
    state = {
        user: {
            name:"",
            email: "",
            password: "",
            avatar:null
        },
        errorMsg:null
    }
    handleSingUp = () => {
        Fire.shared.createUser(this.state.user);


        // Firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(this.state.email, this.state.password)
        //     .then(userCredentials => {
        //         userCredentials.user.updateProfile({
        //             displayName: this.state.name
        //         });
        //     })
        //     .catch(error=>this.setState({errorMsg:error.message}))
        
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
            this.setState({user:{...this.state.user,avatar:result.uri}})
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>

                     <View style={{width:'100%',alignItems:'center',top:45}}>
                        <Text style={styles.hello}>{'Hello \nSing Up to get Start '}</Text>
                        <TouchableOpacity onPress={this.handlePickAvatar}
                            style={styles.iosAdd}>
                            <Image source={{uri:this.state.user.avatar}}
                                style={styles.avatar}
                            />
                            <Ionicons name='ios-add' size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>

                {this.state.errorMsg && <Text style={styles.error} >{this.state.errorMsg}</Text>}

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

                     <View style={{marginTop:32}}>
                        <Text style={styles.inputTitle} >Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ user:{...this.state.user,password} })}
                            value={this.state.user.password}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handleSingUp}>
                        <Text style={{color:"#fff",fontWeight:"500"}}>Sing Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}
                        onPress={()=>this.props.navigation.navigate("Login")}
                    >
                        <Text style={{color:"#414959",fontSize:13}}>
                            Already Register  <Text style={{color:"#E9446A",fontWeight:"500"}}>Sing In</Text>
                        </Text>
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
    greating: {
        fontWeight: '300',
        fontSize: 18,
        marginTop: 32,
        textAlign:"center"
    },
    errorMsg: {
        justifyContent: "center",
        alignItems: "center",
        height: 72,
        marginHorizontal:20
    },
    error: {
        fontSize: 15,
        fontWeight: "500",
        color: "#E9446A",
        textAlign:"center",
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
    iosAdd: {
        backgroundColor: '#ccc',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 10,
        marginVertical: 22,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',
    },
    hello: {
        justifyContent: 'center',
        color: '#626262',
        textAlign: 'center',
        
    }
})
