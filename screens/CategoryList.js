import React from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, SafeAreaView,
    YellowBox, ActivityIndicator, Dimensions,FlatList
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
            .ref('/categories');
        YellowBox.ignoreWarnings(['Setting a timer']);
        this.state = {
            category: [],
            isLoading:false
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
        this.setState({isLoading:true})
        tasksRef.on('value', dataSnapshot => {
            var tasks = [];
            dataSnapshot.forEach(child => {
                tasks.push({
                    category: child.val().category,
                    created: child.val().created,
                    key: child.key
                });
            });

            this.setState({
                category: tasks,isLoading:false
            });
        });
    }


     LittleCard = (item, navigation ) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("CatPostList",
                    { catId: item.key, category: item.category })}
            >
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>{item.category}</Text>
                    <Text style={styles.date}>{item.created}</Text>
                </View>
            </TouchableOpacity>

        )
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View >
                    {this.state.isLoading ? <ActivityIndicator style={{marginTop:10}} size="large" color="red" /> : null}
                    <FlatList
                        data={this.state.category}
                        renderItem={({ item }) =>
                           this.LittleCard(item,this.props.navigation)
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
        width: Dimensions.get('screen').width  - 30,
        height: 100,
        marginVertical: 5,
        marginHorizontal: 12,
        justifyContent: 'space-around',
        borderRadius: 6,
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
        alignSelf: 'center'

    },
    cardText: {
        color: '#000',
        fontSize: 16,
        textAlign: "center",
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
    date: {
        fontSize: 12,
        color: "#444",
        alignSelf: 'flex-end',
        marginRight:22
    }

})