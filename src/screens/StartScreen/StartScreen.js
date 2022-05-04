import React from 'react'
import {View, Alert, Image, StyleSheet, useWindowDimensions, ScrollView} from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../../assets/images/Logo1.png'

const StartScreen = () => {
    const navigation = useNavigation()
    const {height} = useWindowDimensions()
    const onGetStartedPressed = () => {
        navigation.navigate('SignIn')
    }
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.root}>
            <Image 
                source={Logo} 
                style={[styles.logo, {height: height*0.3}]} 
                resizeMode="contain"
            />
            <CustomButton text="Get Started" onPress={onGetStartedPressed}/>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        padding: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        alignSelf: 'center',
        maxWidth: 300,
        maxHeight: 300,
        margin: 60,
    }
})

export default StartScreen