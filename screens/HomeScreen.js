import React from 'react';
import {
  StyleSheet,Text,View,TouchableOpacity,FlatList,Image,Dimensions,YellowBox,ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
export default class HomeScreen extends React.Component {
  _isMounted = false;
  constructor (props) {
    YellowBox.ignoreWarnings(['Setting a timer']);
    super(props);
    if (!firebaseApp.apps.length)
    {
      firebaseApp.initializeApp(firebaseConfig);
    }
    this.catRef = firebaseApp
      .database()
      .ref('/categories');
    this.postRef = firebaseApp
      .database()
      .ref('/posts');
   
    this.state = {
      isLoading: false,
      catCount: 0,
      postCount:0,     
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.categoryCount(this.catRef);
    this.postCount(this.postRef);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  categoryCount(tasksRef) {
    this.setState({ isLoading: true })
    tasksRef.on('value', dataSnapshot => {
      if (dataSnapshot != undefined)
      {
        this.setState({
          catCount: dataSnapshot.numChildren(), isLoading: false
        });
     }
    });
  }
  postCount(tasksRef) {
    this.setState({ isLoading: true })
    tasksRef.on('value', dataSnapshot => {
      if (dataSnapshot != undefined)
      {
        this.setState({
          postCount: dataSnapshot.numChildren(), isLoading: false
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin</Text>
          <MaterialIcons
            name="account-circle"
            size={32}
            color="gray"
            style={{ marginRight: 22 }}
            onPress={() => this.props.navigation.navigate('Profile')}
          />
        </View>

        <View>
          {this.state.isLoading ? <ActivityIndicator style={{ marginTop: 10 }} size="large" color="red" /> : null}
          <TouchableOpacity>
            <View style={{ ...styles.cardContainer, backgroundColor: '#990073' }}>
              <Text style={styles.cardText}>CP Learn</Text>
              <Text style={styles.title}>Computer Programming Learn</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ ...styles.cardContainer}}>
              <Text style={styles.cardText}>Category Count : {this.state.catCount} </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ ...styles.cardContainer, backgroundColor: '#003366' }}>
              <Text style={styles.cardText}>Post Count : {this.state.postCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#EFECF4'
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
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 8
  },
  cardContainer: {
    backgroundColor: "#666666",
    width: Dimensions.get('screen').width - 30,
    height: 100,
    marginTop: 10,
    marginHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 6,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    alignSelf:'center'
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    color: '#fff',
    fontSize: 12,
    textAlign: "center",
  }
 
});
