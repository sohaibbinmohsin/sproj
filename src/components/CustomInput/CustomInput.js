import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Controller } from 'react-hook-form'

const CustomInput = ({control, name, rules={}, type='NORMAL', placeholder, secureTextEntry, multiline=false}) => {
    return (
        <Controller 
            control={control}
            name={name}
            rules={rules}
            render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                <View style={[styles.container, styles[`container_${type}`], {borderWidth: 2 ,borderColor: error ? 'red' : 'black'}]}>
                    <TextInput 
                        placeholder={placeholder}
                        placeholderTextColor='white'
                        value={value} 
                        onChangeText={onChange} 
                        onBlur={onBlur}
                        style={styles.text}
                        secureTextEntry={secureTextEntry}
                        multiline={multiline}
                    />
                    </View>
                    {error && (<Text style={{color:'red', alignSelf: 'stretch'}}>{error.message || Error}</Text>)}
                </>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#053275',
        width: '100%',
        height: 55,
        borderRadius: 5,

        paddingHorizontal: 20,
        marginVertical: 6, 
    },
    container_NORMAL: {

    },
    container_MESSAGE: {
        height: 155,
        flexShrink: 1
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
})

export default CustomInput
