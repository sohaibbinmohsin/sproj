// const nodemailer = require('nodemailer')
// import { createTransport } from 'nodemailer'
import React from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'

const HelpMeScreen = () => {
    const navigation = useNavigation()
    const {control, handleSubmit} = useForm()
    // const transporter = createTransport({
    //     service: 'hotmail',
    //     auth:{
    //         user: 'myswitchuser@outlook.com',
    //         pass: 'H3lloH3llo'
    //     }
    // })
    const onHomePressed = () =>{
        navigation.navigate('Home')
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    const onSendMessagePressed = data => {
        // const options = {
        //     from: 'myswitchuser@outlook.com',
        //     to: 'myswitchhelp@outlook.com',
        //     subject: data.subject,
        //     message: 'Username: ' + auth().currentUser.displayName + '\n' + 'User email: ' + auth().currentUser.email + '\n' + 'Query: ' + data.message
        // }
        // transporter.sendMail(options, (err, info)=>{
        //     if(err){
        //         console.log(err)
        //     }
        //     console.log('Sent: '+info.response)
        // })
    }
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View>
            <CustomButton 
                text={auth().currentUser.displayName[0].toUpperCase()}
                onPress={onProfilePressed}
                type="PROFILE"
            />
        </View>
        <View style={styles.root}>
            <Text style={styles.title}>How can we help you?</Text>
            <CustomInput
                name="subject"
                placeholder="Subject"
                control={control}
                rules={{
                    required: 'Subject is required',
                    minLength: {
                        value: 3, 
                        message: 'Subject should be minimum 3 characters long'
                    }
                }}
            />
            <CustomInput
                name="message"
                placeholder="Message"
                type='MESSAGE'
                control={control}
                rules={{
                    required: 'Message is required',
                    minLength: {
                        value: 10, 
                        message: 'Message should be minimum 10 characters long'
                    }
                }}
                multiline={true}
            />
            <CustomButton text="Send Message" onPress={handleSubmit(onSendMessagePressed)} />
            
            <CustomButton text="Home" onPress={onHomePressed} type="SECONDARY" />
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        margin: 10,
    },
    text: {
        color: 'white',
        marginVertical: 10,
    },
})

export default HelpMeScreen