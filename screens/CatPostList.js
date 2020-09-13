import React from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, SafeAreaView,
    YellowBox, ActivityIndicator, Dimensions, FlatList,
} from 'react-native'
import { Ionicons , MaterialIcons} from '@expo/vector-icons'
import * as firebaseApp from 'firebase';

var firebaseConfig = {
    apiKey: 'AIzaSyBvSo0MRtUccyfLhEReClh61BPLr7t6fY8',
    authDomain: 'socialapp-175f4.firebaseapp.com',
    databaseURL: 'https://socialapp-175f4.firebaseio.com',
    projectId: 'socialapp-175f4',
    storageBucket: 'socialapp-175f4.appspot.com',
    messagingSenderId: '274603733293',
    appId: '1:274603733293:web:6613b1625319c8c4e7a3a4'
};

export default class PostScreen extends React.Component {
  
    _isMounted = false;
    constructor (props) {
        super(props);
        if (!firebaseApp.apps.length)
        {
            firebaseApp.initializeApp(firebaseConfig);
        }
        this.tasksRef = firebaseApp
            .database()
            .ref('/posts').orderByChild("category").equalTo(this.props.route.params.catId)
        YellowBox.ignoreWarnings(['Setting a timer']);
        this.state = {
            category: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.listenForTasks(this.tasksRef);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    listenForTasks(tasksRef) {
        tasksRef.on('value', dataSnapshot => {
            var tasks = [];
            dataSnapshot.forEach(child => {
                tasks.push({
                    name: child.val().name,
                    url: child.val().url,
                    category: child.val().category,
                    key: child.key
                });
            });

            this.setState({
                category: tasks
            });
        });
    }


    LittleCard = (item, navigation) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("EditPost",
                    { postId:item.key })}
            >
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>Name: {item.name}</Text>
                    <Text style={styles.cardText}>URL: {item.url}</Text>
                    <Text style={styles.cardText}>Date: 2-22-2020</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}
                        onPress={() => this.props.navigation.goBack()}
                    > Back</Text>
                    <MaterialIcons
                        name="account-circle"
                        size={32}
                        color="gray"
                        style={{ marginRight: 22 }}
                        onPress={() => this.props.navigation.navigate('Profile')}
                    />
                </View>
                <View >
                    <Text style={styles.cartTitle}>{this.props.route.params.category}</Text>
                    <FlatList
                        data={this.state.category}
                        renderItem={({ item }) =>
                            this.LittleCard(item, this.props.navigation)
                        }
                        keyExtractor={(v, k) => k.toString()}
                    />
                </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        backgroundColor: "#fff",
        width: Dimensions.get('screen').width - 30,
        height: 100,
        marginTop: 5,
        marginHorizontal: 12,
        justifyContent: 'space-around',
        borderRadius: 6,
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
        marginBottom:5
    },
    cardText: {
        color: '#000',
        fontSize: 14,
        textAlign: "left",
        marginLeft:11
    },
    loading: {
        flexDirection: "row",
        backgroundColor: "#ccc",
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        width: "80%",
        justifyContent: "center",
        alignSelf: 'center',
        marginTop: 12
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EBECF4',
        paddingTop: 12,
        paddingBottom: 12,
        shadowColor: '#000',
        shadowOffset: { height: 5, width: 5 },

        shadowRadius: 15,

        shadowOpacity: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 22,
        color: '#626262'
    },
    cartTitle: {
        fontSize: 22,
        backgroundColor: "#fff",
        textAlign: 'center',
        padding: 11,
        marginTop:8
    }
})