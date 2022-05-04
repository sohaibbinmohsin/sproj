import React from 'react'
import { Alert } from 'react-native'
import CustomButton from '../CustomButton/CustomButton'

const SocialSignInButton = () => {
    const onSignInGoogle = () => {
        console.warn('onSignInGoogle')
    }
    const onSignInFacebook = () => {
        console.warn('onSignInFacebook')
    }
    // const onSignInApple = () => {
    //     console.warn('onSignInApple')
    // }
    return(
        <>
            <CustomButton 
                text="Sign In with Facebook" 
                onPress={onSignInFacebook} 
                bgColor='#e7eaf4' 
                fgColor='#4765a9' 
            />
            <CustomButton 
                text="Sign In with Google" 
                onPress={onSignInGoogle} 
                bgColor='#fae9ea' 
                fgColor='#dd4d44' 
            />
            {/* <CustomButton
                text="Sign In with Apple"
                onPress={onSignInApple}
                bgColor='#e3e3e3'
                fgColor='#363636'
            /> */}
        </>
    )
}

export default SocialSignInButton