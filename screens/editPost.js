import React, { useState, useEffect } from 'react';
import * as firebaseApp from 'firebase';
import {
    StyleSheet, Text, View, FlatList, Button, Picker, YellowBox, StatusBar
} from 'react-native';
import {
    Container, Input, Item
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
    constructor (props) {
        super(props);
        YellowBox.ignoreWarnings(['Setting a timer']);

        if (!firebaseApp.apps.length)
        {
            firebaseApp.initializeApp(firebaseConfig);
        }
        this.tasksRef = firebaseApp
            .database()
            .ref('/posts/' + this.props.route.params.postId)
        this.catRef = firebaseApp
            .database()
            .ref('/categories')

        const dataSource = [];
        this.state = {
            dataSource: dataSource,
            snackbarVisible: false,
            confirmVisible: false,
            catList: [],
            name: '',
            url: '',
            category: '',
            createdDate: ''
        };


    }

    componentDidMount() {
       this.listenForTasks(this.tasksRef);
        this.getCategory(this.catRef)
    }

    listenForTasks(tasksRef) {
        tasksRef.on('value', data => {
            console.log(data)
            if (data.val() != null)
            {
                this.setState({
                    name: data.val().name,
                    url: data.val().url,
                    category: data.val().category,
                    createdDate: data.val().created,
                });
            } else
            {
                this.props.navigation.navigate("Home")
            }
               
        });
    }

    getCategory(catRef) {
        catRef.on('value', dataSnapshot => {
            var tasks = [];
            dataSnapshot.forEach(child => {
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
 
    updateItem() {
        var updates = {};
        updates['/posts/' + this.props.route.params.postId] = {
            name: this.state.name,
            url: this.state.url,
            category: this.state.category,
            created: this.state.createdDate
        };
         firebaseApp
            .database()
            .ref()
            .update(updates);
        this.props.navigation.goBack();
    }

    saveItem() {
        this.updateItem();
        this.setState({ name: '', url: '',category: '', createdDate: '' });
    }

    deleteItem(item) {
        this.setState({ deleteItem: item, confirmVisible: true });
    }

    hideDialog(yesNo) {
        this.setState({ confirmVisible: false });
        if (yesNo === true)
        {
            var updates = {};
            updates['/posts/' + this.state.deleteItem] = null;
            firebaseApp
                .database()
                .ref()
                .update(updates)
            this.props.navigation.goBack();
        }
    }

    showDialog() {
        this.setState({ confirmVisible: true });
        console.log('in show dialog');
    }

    render() {
        return (
            <PaperProvider>
                <Container style={styles.container}>
                    <StatusBar barStyle="light-content" color="#ddd" />
                    <Item>
                        <Input
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                        />
                    </Item>
                    <Item>
                        <Input
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginHorizontal:12 }}>
                        <Button
                            title={'Delete'}
                            style={styles.addButton}
                            onPress={() => this.deleteItem(this.props.route.params.postId)}
                            color="red"
                        >
                        </Button>
                        <Button
                            title={'update'}
                            style={styles.addButton}
                            onPress={() => this.saveItem()}
                        >
                        </Button>
                       
                    </View>
                   

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
        color: "#003d66"
    },
    cat: {
        fontSize: 12,
    },
    addButton: {
        justifyContent: 'center',
        backgroundColor: '#ccc',
        paddingVertical: 12
    },
    post: {
        flexDirection: 'row',
        marginHorizontal: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingVertical: 8

    },
    input: {
        marginBottom: 22
    }
});
