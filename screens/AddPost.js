import React, { useState, useEffect } from 'react';
import * as firebaseApp from 'firebase';
import {
  StyleSheet,Text,View, FlatList, Button,TouchableOpacity, Picker,YellowBox,StatusBar,ActivityIndicator
} from 'react-native';
import {
  Container, Input, Item, Icon,
} from 'native-base';
import {
  Snackbar, Portal, Dialog, Paragraph, Provider as PaperProvider
} from 'react-native-paper';

var firebaseConfig = {
  apiKey: 'AIzaSyBvSo0MRtUccyfLhEReClh61BPLr7t6fY8',
  authDomain: 'socialapp-175f4.firebaseapp.com',
  databaseURL: 'https://socialapp-175f4.firebaseio.com',
  projectId: 'socialapp-175f4',
  storageBucket: 'socialapp-175f4.appspot.com',
  messagingSenderId: '274603733293',
  appId: '1:274603733293:web:6613b1625319c8c4e7a3a4'
};

export default class AddPost extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(['Setting a timer']);

    if (!firebaseApp.apps.length) {
      firebaseApp.initializeApp(firebaseConfig);
    }
    this.tasksRef = firebaseApp
      .database()
      .ref('/posts')
      .limitToLast(10); 
      
    this.catRef = firebaseApp
      .database()
      .ref('/categories')

    const dataSource = [];
    this.state = {
      isLoading:false,
      dataSource: dataSource,
      selecteditem: null,
      snackbarVisible: false,
      confirmVisible: false,
      catList:[],
      name: '',
      url: '',
      category: '',
      createdDate:''
    };


  }

  componentDidMount() {
    this._isMounted = true;
    this.listenForTasks(this.tasksRef);
    this.getCategory(this.catRef)
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
          name: child.val().name,
          url: child.val().url,
          category: child.val().category,
          created:child.val().created,
          key: child.key
        });
      });

      this.setState({
        dataSource: tasks,isLoading:false
      });
    });
  }

  getCategory(catRef) {
    catRef.on('value', dataSnapshot => {
      var tasks = [];
      dataSnapshot.forEach(child => {
        console.log(child.key)
        tasks.push({
          name: child.val().category,
          key: child.key
        });
       
      });
      this.setState({
        catList: tasks
      });
    });
  }

  deleteItem(item) {
    this.setState({ deleteItem: item, confirmVisible: true });
  }

  performDeleteItem(key) {
    var updates = {};
    updates['/posts/' + key] = null;
    return firebaseApp
      .database()
      .ref()
      .update(updates);
  }

  addItem(itemName, itemUrl, category) {
    //if itemName and itemUrl is with value, come from 'undo' button
    // and with null , come from 'add' button
    var newPostKey = firebaseApp
      .database()
      .ref()
      .child('posts')
      .push().key;
    var updates = {};
    var name =
      itemName === '' || itemName == undefined ? this.state.name : itemName;
    var url = itemUrl === '' || itemUrl == undefined ? this.state.url : itemUrl;
    var cat =
      category === '' || category == undefined ? this.state.category : category;
    if (name.length < 6 || url.length < 6) {
      alert('Name and Url must be at least 6 chars');
      return;
    }
    updates['/posts/' + newPostKey] = {
      name: name,
      url: url,
      category: cat,
      created: new Date().toISOString().slice(0, 10)
    };

    return firebaseApp
      .database()
      .ref()
      .update(updates);
  }

  updateItem() {
    var updates = {};
    updates['/posts/' + this.state.selecteditem.key] = {
      name: this.state.name,
      url: this.state.url,
      category: this.state.category,
      created:this.state.createdDate
    };
    return firebaseApp
      .database()
      .ref()
      .update(updates);
  }

  saveItem() {
    if (this.state.selecteditem === null)
      this.addItem();
    else
      this.updateItem();
    this.setState({ name: '', url: '', selecteditem: null, category: '',createdDate:'' });
  }

  hideDialog(yesNo) {
    this.setState({ confirmVisible: false });
    if (yesNo === true) {
      this.performDeleteItem(this.state.deleteItem.key).then(() => {
        this.setState({ snackbarVisible: true });
      });
    }
  }

  showDialog() {
    this.setState({ confirmVisible: true });
    console.log('in show dialog');
  }

  undoDeleteItem() {
    this.addItem(this.state.deleteItem.name, this.state.deleteItem.url,this.state.deleteItem.category);
  }

  postList = item => {
   
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            selecteditem: item,
            name: item.name,
            url: item.url,
            category: item.category,
            createdDate: item.created
          })
        }
      >
      <View style={styles.post}>
        <View style={{marginHorizontal:10,alignSelf:'center'}}>
          <Icon onPress={() => this.deleteItem(item)}
            name="trash" style={{ color: '#ff6666' }}
          />
        </View>
        <View >
            <Text style={styles.title}>Title: {item.name} </Text>
            <Text style={styles.url}>URL: {item.url} </Text>
            <View style={{}}>
              <Text style={styles.cat}>
                Cat : {
                  this.state.catList.map((v, k) => {
                    if (v.key == item.category)
                      return v.name
                  })
                }
               </Text>
              <Text style={styles.cat}>Date: {item.created} </Text>
            </View>
        </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <PaperProvider>
        <Container style={styles.container}>
          <StatusBar barStyle="light-content" color="#ddd" />
          <Item>
            <Input
              placeholder="Add Title"
              value={this.state.name}
              onChangeText={name => this.setState({ name: name })}

            />
          </Item>
          <Item>
            <Input
              placeholder="Add URL"
              value={this.state.url}
              onChangeText={url => this.setState({ url: url })}
            />
          </Item>
          <Item style={styles.input}>
            <Picker
              selectedValue={this.state.category}
              style={{ height: 50, width: '100%' }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ category: itemValue })
              }
            >
              
              {this.state.catList.map((cat, index) => {
                return (
                  <Picker.Item key={index} label={cat.name} value={cat.key} />
                );
              })}
            </Picker>
          </Item>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12 }}>
            <Button
              title={'Clear'}
              style={styles.addButton}
              onPress={() => this.setState({name:'',url:'',category:'',selecteditem:null})}
              color="#8800ff"
            >
            </Button>
            <Button
              title={this.state.selecteditem === null ? 'add' : 'update'}
              style={styles.addButton}
              onPress={() => this.saveItem()}
            >
            </Button>
          </View>
          {this.state.isLoading? <ActivityIndicator size="large" color="red" /> :null}
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => this.postList(item)}
            keyExtractor={(k,v)=>v.toString()}
          />
        


          <Portal>
            <Dialog
              visible={this.state.confirmVisible}
              onDismiss={() => this.hideDialog(false)}
            >
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Are you sure you want to delete this?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button title="Yes" onPress={() => this.hideDialog(true)} />
                <View style={{ marginLeft: 5 }}></View>
                <Button title="No" onPress={() => this.hideDialog(false)} />
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Snackbar
            visible={this.state.snackbarVisible}
            onDismiss={() => this.setState({ snackbarVisible: false })}
            action={{
              label: "Undo",
              onPress: () => {
                // Do something
                this.undoDeleteItem();
              }
            }}
          >
            Item deleted successfully.
            </Snackbar>
        </Container>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 12
  },
  title: {
    fontSize: 14,
  },
  url: {
    fontSize: 12,
    fontStyle: 'italic',
    color:"#003d66"
  },
  cat: {
    fontSize: 12,
  },
  addButton: {
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  post: {
    flexDirection: 'row',
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    borderRadius: 6,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    paddingVertical:8
    
  },
  input: {
    marginBottom: 22
  }
});
