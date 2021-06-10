import * as React from 'react';
import { Text, View, StyleSheet,Image, TouchableOpacity, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import db from '../config';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailId: '',
            password: '',
        }
    }
    login = async (email, password) =>{
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email, password);
                if(response){
                    this.props.navigation.navigate('IssueReturn');
                }
            }catch(error){
                switch(error.code){
                    case 'auth/user-not-found': Alert.alert("User does not exists");
                        break;
                    case 'auth/invalid-email': Alert.alert("Incorrect Email or Password");
                        break;
                }
            }
        }else{
            Alert.alert("Enter Email and Password")
        }
    }
    render(){
        return(
            <KeyboardAvoidingView style = {{alignItems: "center", marginTop:20, backgroundColor:"skyblue"}} behaviour = "padding" enabled>
                <View>
                    <Text style = {{textAlign:"center", alignSelf:"center", fontSize:50, fontWeight:"bold",}}>Wireless Library Login</Text>
                    <Image source = {require("../assets/booklogo.jpg")} style = {{width:200, height:200, alignSelf:"center"}}/>
                </View>

                <View>
                    <TextInput style = {styles.input}
                               placeholder = " abc@example.com "
                               keyboardType = "email-address"
                               onChangeText = {(text)=>{
                                   this.setState({emailId: text});
                               }}>
                    </TextInput>

                    <TextInput style = {styles.input}
                               placeholder = " Enter Password "
                               secureTextEntry = {true}
                               onChangeText = {(text)=>{
                                   this.setState({password: text});
                               }}>
                    </TextInput>
                </View>
                <View>
                    <TouchableOpacity style = {styles.button}
                                       onPress = {()=>{this.login(this.state.emailId, this.state.password)}}>
                        <Text style = {styles.buttonText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'skyblue',
      padding: 8,
      alignItems: "center"
    },
    buttonText: {
      fontSize:25,
      alignSelf:"center",
      fontWeight:"bold",
      color:"black",
    },
    button: {
      marginTop:50,
      borderRadius: 50,
      width:200,
      alignSelf:"center",
      alignItems:"center",
      backgroundColor:"orange",
    },
    input: {
      marginTop:100,
      borderWidth: 5
    }
  })