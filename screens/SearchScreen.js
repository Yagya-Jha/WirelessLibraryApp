import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import db from '../config';

export default class SearchScreen extends React.Component {
  constructor(){
    super();
    this.state = {allTransactions : [], lasttransaction: null, search: ''};
  }

  fetchMoretransactions = async () =>{
    var text = this.state.search.toUpperCase()
    var enteredtext = text.split("");
    if(enteredtext[0].toUpperCase() === "B"){
      const transcation = await db.collection("transaction").where('bookId', '==', text).get()
  
      transcation.docs.map((doc) =>{
        this.setState({allTransactions: [this.state.allTransactions,doc.data()], lasttransaction: doc})
      })
    }else if(enteredtext[0].toUpperCase() === "S"){
      const transcation = await db.collection("transaction").where('studentId', '==', text).get()
      transcation.docs.map((doc) =>{
        this.setState({allTransactions: [this.state.allTransactions,doc.data()], lasttransaction: doc})
      })
  }
  }

  searchTransaction =  async (text) =>{
    var enteredtext = text.split("");
    var text = text.toUpperCase();
    if(enteredtext[0].toUpperCase() === "B"){
      const transcation = await db.collection("transaction").where('bookId', '==', text).get()
  
      transcation.docs.map((doc) =>{
        this.setState({allTransactions: [this.state.allTransactions,doc.data()], lasttransaction: doc})
      })
    }else if(enteredtext[0].toUpperCase() === "S"){
      const transcation = await db.collection("transaction").where('studentId', '==', text).get()
      transcation.docs.map((doc) =>{
        this.setState({allTransactions: [this.state.allTransactions,doc.data()], lasttransaction: doc})
      })
  }
}

  render(){
    return(
      <View style = {styles.container}>
        <View>
          <TextInput
                    style = {styles.input}
                     placeholder = "Enter Book/Student Id"
                     onChangeText = {(text)=>{
                       this.setState({search: text})
                     }}></TextInput>
                     <TouchableOpacity style = {styles.button} onPress = {this.searchTransaction(this.state.search)}>
                       <Text style = {styles.buttonText}>Search</Text>
                     </TouchableOpacity>
        </View>
      <FlatList
      data = {this.state.allTransactions}
      renderItem = {({item})=>(          
      <View>
        <Text style = {{marginTop:50}}>{"Book Id: "+ item.bookId}</Text>
        <Text>{"Student ID: "+ item.studentId}</Text>
        <Text>{"Date: "+ item.date}</Text>
       <Text>{"Transaction Type: "+item.transactionType}</Text>
      </View>
      )}
      keyExtractor = {(item, index)=> index.toString()}
      onEndReached = {this.fetchMoretransactions}
      onEndReachedThreshold = {0.7}
        />
      </View>
    );
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
