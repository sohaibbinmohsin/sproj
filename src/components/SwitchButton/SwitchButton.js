import React from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'

const SwitchButton = ({ onPress1, onPress2, iPower='0.0', onoff='on', text="SWITCH OFF"}) => {
    return(
        <View>
        <Pressable onPress={onPress1} 
            style={[
                styles.container, 
                ]}>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>INSTANTANEOUS</Text>
                        <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>POWER(kW)</Text>
                        <View style={styles.powerDisplay}>
                            <TextInput
                                value = {iPower}
                                editable = {false}
                                style={{color: 'black', fontSize: 18, alignSelf:'center'}}
                            />
                        </View>
                    </View>
        </Pressable>
        <Pressable onPress={onPress2} 
            style={[
                styles.onoff,
                styles[`onoff_${onoff}`]
                ]}>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}} >
                            {text}</Text>
                    </View>
        </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 119,
        width: 150,
        padding: 15,
        margin: 20,
        marginBottom: 0,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        backgroundColor: '#327CEB'
    },
    onoff: {
        height: 46,
        width: 150,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        // padding: 20,
        margin: 20,
        marginTop: 0,
    },
    onoff_on: {
        backgroundColor: '#E80E0E'
    },
    onoff_off: {
        backgroundColor: '#053275'
    },
    powerDisplay: {
        backgroundColor: 'white',
        height: 40,
        width: 122,
        // alignSelf: 'center',

        // paddingHorizontal: 20,
        // padding: 2,
        marginVertical: 8, 
    }
})

export default SwitchButton