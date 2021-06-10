import * as React from 'react';
import { Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import IssueReturnScreen from './screens/IssueReturnScreen';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';

export default class App extends React.Component {
  render(){
  return (
      <AppContainer />
  );
}
}

const TabNavigator = createBottomTabNavigator({
  IssueReturn: IssueReturnScreen,
  Search: SearchScreen,
},

{
  defaultNavigationOptions: ({navigation})=>({
  tabBarIcon: ({})=>{
    const routeName = navigation.state.routeName
    if(routeName==="IssueReturn"){
      return(
        <Image source = {require('./assets/book.png')} style = {{width:32, height:32}}/>
        );
      }
      else if(routeName==="Search"){
        return(
          <Image source = {require('./assets/searchingbook.png')} style = {{width:32, height:32}}/>
        );
      }
    },
  })
});

const switchNavigator = createSwitchNavigator({
  LoginScreen: LoginScreen,
  TabNavigator: TabNavigator,
});

const AppContainer = createAppContainer(switchNavigator);