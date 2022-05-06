import React, {useState} from 'react'
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const ChangeEmailScreen = () => {
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    const {control, handleSubmit} = useForm()
    const db = firestore()

    const onChangeEmailPressed = data => {
        if(loading){
            return
        }
        setLoading(true)
        const currEmail = auth().currentUser.email
        auth().currentUser.updateEmail(data.email)
        .then(()=>{
            db.collection("users").where('Id','==', currEmail).get().then((snapshots)=>{
                snapshots.docs.forEach(doc => {
                    db.collection("users").doc(doc.id).update({
                        Id: data.email
                    }).then(()=>{
                        Alert.alert('Success', 'Your email address is changed successfully')
                        setLoading(false)
                    }).catch(err => {
                        console.log('Err1')
                        console.log(err.message)
                        Alert.alert('Error', err.message + '\n' + 'Please contact our support team to solve this issue')
                        setLoading(false)
                    })
                })
            }).catch(err => {
                console.log('Err2')
                console.log(err.message)
                Alert.alert('Error', err.message + '\n' + 'Please contact our support team to solve this issue')
                setLoading(false)
            })
        })
        .catch(err => {
            console.log('Err3')
            console.log(err.message)
            Alert.alert('Error', err.message)
            setLoading(false)
        })
    }
    const onHomePressed = () =>{
        navigation.navigate('Home')
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
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
            <Text style={styles.title}>Let's change your email</Text>
            <CustomInput
                name="email"
                placeholder="Email"
                control={control}
                rules={{ 
                    required: 'Email is required',
                    pattern:{ 
                        value: EMAIL_REGEX,
                        message: "Email is invalid"
                    } 
                }}
            />
            <CustomButton text={loading ? "Loading... " : "Change Email"} onPress={handleSubmit(onChangeEmailPressed)} />
            
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
    link: {
        color: '#053275',
        fontWeight: 'bold'
    }
})
export default ChangeEmailScreen