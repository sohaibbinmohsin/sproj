import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import auth from '@react-native-firebase/auth'
import { useNavigation, DrawerActions } from '@react-navigation/native';

import CustomButton from '../CustomButton'

const CustomDrawer = (props) => {
    const navigation = useNavigation()
    const user = auth().currentUser;

    const onProfilePressed = () => {
        navigation.dispatch(DrawerActions.closeDrawer());
    }
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView 
                {...props}
                contentContainerStyle={{backgroundColor:'#053275', padding: 20}}>
                <CustomButton 
                    text={user.displayName[0].toUpperCase()}
                    onPress={onProfilePressed}
                    type="PROFILE"
                />
                <Text style={{color: 'white', fontSize: 24, margin: 20, fontWeight: 'bold'}}>{user.displayName}</Text>
                <View style={{flex:1, backgroundColor:'#053275', paddingTop: 10}}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{padding: 20, borderTopColor: '#ccc', borderTopWidth:1,}}>
                <Text style={{color: 'white', fontSize: 18}}>Rights reserved by MySwitch</Text>
            </View>
        </View>
    )
}

export default CustomDrawer