import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import db from '../config';
export default class IssueReturnScreen extends React.Component {
  constructor(){
    super();
    this.state = {cameraPermission: null,
                  scanned: false,
                  scannedData:'',
                  buttonState: 'normal',
                  scannedStudentId:'',
                  scannedBookId: '',
                  transactionMesssage: ''
                };
  }

  startBookIssue = async () =>{
    db.collection("transaction").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Issue"
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      'bookavailability': false
    });
    db.collection("students").doc(this.state.scannedStudentId).update({
      'booksissued': firebase.firestore.FieldValue.increment(1)
    });
    Alert.alert("Book Issued!");
    this.setState({
      scannedBookId: '',
      scannedStudentId: '',
    });
  }

  startBookReturn = async () =>{
    db.collection("transaction").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Return"
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      'bookavailability': true
    });
    db.collection("students").doc(this.state.scannedStudentId).update({
      'booksissued': firebase.firestore.FieldValue.increment(-1),
    });
    Alert.alert("Book Returned!");
    this.setState({
      scannedBookId: '',
      scannedStudentId: '',
    });
  }

  checkBookEligibility = async () =>{
    const bookref = await db.collection("books").where("bookid","==",this.state.scannedBookId).get();
    var transactionType = '';
    if(bookref.docs.length===0){
      transactionType = false;
    }else {
      bookref.docs.map(doc =>{
        var book = doc.data();
        if(book.bookavailability){
          transactionType = "Issue"
        }else{
          transactionType = "Return"
        }
      });
    }
    return transactionType;
  }

  checkStudentEligibilityIssue = async () => {
    const studentref = await db.collection("students").where("studentid","==",this.state.scannedStudentId).get();
    var studentEligibility = '';
    if(studentref.docs.length===0){
      studentEligibility = false;
      this.setState({scannedBookId:'', scannedStudentId: ''});
      ToastAndroid.show("Student Id does not exist", ToastAndroid.SHORT);
    }else{
      studentref.docs.map(doc =>{
        var student = doc.data();
        if(student.booksissued<2){
          studentEligibility = true;
        }else{
          studentEligibility = false;
          ToastAndroid.show("Student has already issued maximum no. of books", ToastAndroid.SHORT);
          this.setState({scannedBookId:'', scannedStudentId: ''});
        }
      });
    }
    
    return studentEligibility;
  }

  checkBookEligibilityreturn = async () =>{
    const transactionref = await db.collection("transaction").where("bookid", "==", this.state.scannedBookId).limit(1).get();
    var studentEligibility = '';
    transactionref.docs.map(doc =>{
      var lastTransaction = doc.data();
      if(lastTransaction.studentId === this.state.scannedStudentId){
        studentEligibility = true;
      }else{
        studentEligibility = false;
        ToastAndroid.show("The book was not issued to this student", ToastAndroid.SHORT);
        this.setState({scannedBookId:'', scannedStudentId: ''});
      }
    });
    return studentEligibility;
  }



  handleTransaction = async () =>{
    var transactionType = await this.checkBookEligibility();
    var transactionMesssage;
      if(! transactionType){
        transactionMesssage = "Book does not exist in the library";
        ToastAndroid.show(transactionMesssage,ToastAndroid.SHORT);
        this.setState({scannedBookId:'', scannedStudentId:''});
      }
      else if(transactionType=='Issue'){
        var studentEligibility = await this.checkStudentEligibilityIssue();
        if(studentEligibility){
          this.startBookIssue();
          transactionMesssage = "book Issued";
          ToastAndroid.show(transactionMesssage,ToastAndroid.SHORT);
      }
    }else {
      var studentEligibility = await this.checkBookEligibilityreturn();
      if(studentEligibility){
        this.startBookReturn();
        transactionMesssage = "book Returned";
        ToastAndroid.show(transactionMesssage,ToastAndroid.SHORT);
      }
    }
    this.setState({transactionMesssage:transactionMesssage});
  }

  useBarCodeScanner = async ({type, data}) =>{
    this.setState({scanned: true, scannedData: data, buttonState: 'normal'})
  }

   getPermission = async (id) =>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({cameraPermission: status==="granted", buttonState: id, scanned: false});
  }

  render(){
  const cameraPermission = this.state.cameraPermission;
  const scanned = this.state.scanned;
  const buttonState = this.state.buttonState;

  if(buttonState!=="normal" && cameraPermission){
    return(
      <BarCodeScanner onBarCodeScanned = {scanned? undefined:this.useBarCodeScanner} 
      style = {StyleSheet.absoluteFillObject}
      />
    )
  }
  else if(buttonState==="normal"){
  return (
    <KeyboardAvoidingView style={styles.container} behaviour = "padding" enabled>
      <View>
      <Text style = {{textAlign:"center", alignSelf:"center", fontSize:50, fontWeight:"bold",}}>Wireless Library App</Text>
        <Image source = {require("../assets/booklogo.jpg")} style = {{width:200, height:200, alignSelf:"center"}}/>
      </View>
      <View style = {styles.inputView}>
        <TextInput placeholder = "Book Id"
         onChangeText = {text=>{
           this.setState({scannedBookId: text});
         }}
         value = {this.state.scannedBookId}
         style = {styles.inputBox}></TextInput>
        <TouchableOpacity 
                          style = {styles.button} 
                          onPress = {()=>{this.getPermission("BookId")}}>
            <Text style = {styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.inputView}>
        <TextInput placeholder = "Student Id"
        onChangeText = {text=>{
          this.setState({scannedStudentId: text});
        }}
        value = {this.state.scannedStudentId}
        style = {styles.inputBox}></TextInput>
        <TouchableOpacity 
                        style = {styles.button} 
                        onPress = {()=>{this.getPermission("StudentId")}}>
            <Text style = {styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>

    <Text style = {styles.buttonText}>
      {cameraPermission===true? this.state.scannedData : "request Camera Permission"}
    </Text>

    <TouchableOpacity 
    style = {styles.submit}
    onPress = {async () =>{var transcationMessage = this.handleTransaction();}}>
      <Text>
        Submit
      </Text>
    </TouchableOpacity>
    
    </KeyboardAvoidingView>
  );
}
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    padding: 12,
    alignItems: "center"
  },
  buttonText: {
    fontSize:25,
    alignSelf:"center",
    fontWeight:"bold",
    color:"black",
  },
  button: {
    borderRadius: 50,
    width:100,
    alignSelf:"center",
    alignItems:"center",
    backgroundColor:"orange",
  },
  inputView: {
    flexDirection: "row",
    margin:20,
  },
  inputBox: {
    width:200,
    height: 40,
    borderWidth:4,
    fontSize: 30,
  },
  submit: {
    borderRadius: 50,
    width:200,
    alignSelf:"center",
    alignItems:"center",
    backgroundColor:"yellow",
  }
});
