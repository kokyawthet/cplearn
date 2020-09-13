import React from 'react'
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image,
    LayoutAnimation,ScrollView
} from 'react-native'
import * as Firebase from 'firebase'

export default class LoginScreen extends React.Component {
 
    state = {
        email: "",
        password: "",
        errorMsg:null
    }
    handleLogin = () => {
        const { email, password } = this.state;
        Firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => this.setState({ errorMsg: error.message }))
    }

    render() {
        LayoutAnimation.easeInEaseOut()
        return (
            <View style={styles.container}>
                <ScrollView>
                <StatusBar barStyle="light-content" />
                <Image source={require('../assets/artist.jpg')}
                    style={{ alignSelf: 'center', marginTop: 32,height:100,width:100,borderRadius:50}}
                   />
                <Text style={styles.greating} >{'Hello again \n Welcome Back'}</Text>

                {this.state.errorMsg && <Text style={styles.error} >{this.state.errorMsg}</Text>}

                <View style={styles.form}>
                    <View style={{marginTop:32}}>
                        <Text style={styles.inputTitle} >Email Address</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>

                     <View style={{marginTop:32}}>
                        <Text style={styles.inputTitle} >Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                        <Text style={{color:"#fff",fontWeight:"500"}}>Sing In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}
                        onPress={()=>this.props.navigation.navigate("Register")}
                    >
                        <Text style={{color:"#414959",fontSize:13}}>
                            New to SocialApp  <Text style={{color:"#E9446A",fontWeight:"500"}}>Sing Up</Text>
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
        marginBottom: 40,
        marginHorizontal: 30,
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform:"capitalize"
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
    }
})
