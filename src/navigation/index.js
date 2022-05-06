import React from 'react'
import {Alert} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import StartScreen from '../screens/StartScreen';
import GraphScreen from '../screens/GraphScreen/GraphScreen';
import ChangeUsernameScreen from '../screens/ChangeUsernameScreen';
import ChangeEmailScreen from '../screens/ChangeEmailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import HelpMeScreen from '../screens/HelpMeScreen';
import AddNewSwitchScreen from '../screens/AddNewSwitchScreen';

import CustomDrawer from '../components/CustomDrawer'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function DrawerRoutes() {
    return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} 
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: '#327CEB',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#fff',
          drawerLabelStyle: {
            fontSize: 18,
            marginLeft: 2,
          },
          drawerStyle: {backgroundColor: '#053275', width: 260, borderBottomRightRadius: 40}
        }}
        >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Add New Switch" component={AddNewSwitchScreen} />
        <Drawer.Screen name="Change Username" component={ChangeUsernameScreen} />
        <Drawer.Screen name="Change Email Address" component={ChangeEmailScreen} />
        <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
        <Drawer.Screen name="HELP ME" component={HelpMeScreen} />
      </Drawer.Navigator>
    );
  }

const Navigation = () => {
    const navTheme = {
        colors: {
          background: 'transparent',
        },
      }; 
    return(
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
                <Stack.Screen name="Dashboard" component={DrawerRoutes} />
                <Stack.Screen name="Graph" component={GraphScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation