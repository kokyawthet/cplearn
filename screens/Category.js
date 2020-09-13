import React, { useState, useEffect } from 'react';
import * as firebaseApp from 'firebase';
import {
  StyleSheet,Text, View,FlatList, Button, TouchableOpacity, Picker, YellowBox, StatusBar,ActivityIndicator
} from 'react-native';
import {
  Container, Input, Item,Icon, List,ListItem, Left, Right,  Body
} from 'native-base';
import {
  Snackbar,
  Portal,
  Dialog,
  Paragraph,
  Provider as PaperProvider
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

export default class NotificationScreen extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (!firebaseApp.apps.length) {
      firebaseApp.initializeApp(firebaseConfig);
    }
    this.tasksRef = firebaseApp
      .database()
      .ref('/categories');
    YellowBox.ignoreWarnings(['Setting a timer']);

    const dataSource = [];
    this.state = {
      isLoading:false,
      dataSource: dataSource,
      selecteditem: null,
      snackbarVisible: false,
      confirmVisible: false,
      category: '',
      createdDate: ''
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
        dataSource: tasks,isLoading:false
      });
    });
  }

  deleteItem(item) {
    this.setState({ deleteItem: item, confirmVisible: true });
  }

  performDeleteItem(key) {
    var updates = {};
    updates['/categories/' + key] = null;
    return firebaseApp
      .database()
      .ref()
      .update(updates);
  }

  addItem(category) {
    //if itemName and itemUrl is with value, come from 'undo' button
    // and with null , come from 'add' button
    var newPostKey = firebaseApp.database().ref().child('categories').push().key;
    var updates = {};
    var cat = category === '' || category == undefined ? this.state.category : category;
    if (cat.length < 3) {
      alert('category name must be at least 3 chars');
      return;
    }
    updates['/categories/' + newPostKey] = {
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
    updates['/categories/' + this.state.selecteditem.key] = {
      category: this.state.category,
      created: this.state.createdDate
    };
    return firebaseApp
      .database()
      .ref()
      .update(updates);
  }

  saveItem() {
    if (this.state.selecteditem === null) this.addItem();
    else this.updateItem();

    this.setState({ selecteditem: null, category: '' });
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
    this.addItem(this.state.deleteItem.category);
  }
  postList = item => {
    return (
      <ListItem icon style={styles.post}>
        <Left>
          <Icon
            onPress={() => this.deleteItem(item)}
            name="trash"
            style={{ color: '#ff6666' }}
          />
        </Left>
        <Body>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                selecteditem: item,
                category: item.category,
                createdDate: item.created
              })
            }
          >
            <Text style={styles.title}> {item.category} </Text>
            <Text style={styles.url}> {item.created} </Text>
          </TouchableOpacity>
        </Body>
      </ListItem>
    );
  };

  render() {
    return (
      <PaperProvider>
        <Container style={styles.container}>
          <StatusBar barStyle="light-content" color="#ddd" />
          <Item>
            <Input
              placeholder="Add Category Title"
              value={this.state.category}
              onChangeText={category => this.setState({ category })}
            />
          </Item>
          <Button
            title={this.state.selecteditem === null ? 'add' : 'update'}
            style={styles.addButton}
            onPress={() => this.saveItem()}
          >
            
          </Button>
          {this.state.isLoading?<ActivityIndicator color="red" size="large" />:null}
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => this.postList(item)}
            style={styles.item}
          />
          <Portal>
            <Dialog
              visible={this.state.confirmVisible}
              onDismiss={() => this.hideDialog(false)}
            >
              <Dialog.Title> Confirm </Dialog.Title>
              <Dialog.Content>
                <Paragraph> Are you sure you want to delete this ? </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button title="Yes" onPress={() => this.hideDialog(true)} />
                <Text>   </Text>
                <Button title="No" onPress={() => this.hideDialog(false)}  />
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Snackbar
            visible={this.state.snackbarVisible}
            onDismiss={() => this.setState({ snackbarVisible: false })}
            action={{
              label: 'Undo',
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
  item: {
    fontSize: 24,
    marginHorizontal: -10,
    marginTop: 10
  },
  title: {
    fontSize: 14,
    color: '#626262'
  },
  url: {
    fontSize: 12,
    color: '#626262',
    fontStyle: 'italic'
  },
  addButton: {
    justifyContent: 'center',
    backgroundColor: '#ccc',
    paddingVertical: 12
  },
  post: {
    marginVertical: 6
  },
  input: {
    marginBottom: 22
  },
  button: {
    marginHorizontal:5
  }
});
