import React, {useState} from 'react'
import { Alert, Text, View, StyleSheet, ScrollView, TextInput, Pressable, Button } from 'react-native'
import CustomButton from '../../components/CustomButton'
import SwitchButton from '../../components/SwitchButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useRoute } from '@react-navigation/native'

const HomeScreen = ({route}) => {
    const navigation = useNavigation()
    // const route = useRoute()
    const db = firestore()
    // const {control, handleSubmit} = useForm({defaultValues: {email: route?.params?.email, initial: route?.params?.initial, switchDisplayArrr: route?.params?.switchDisplayArrr}})
    var switchesId = []
    var switchData = {}
    var switchDisplayArr = []
    // const { screen } = route.params
    // console.log(route.params.screen)
    // const {Email} = route.params
    // const email = route?.params?.email
    // console.log('here', Email)
    // console.log('here', navigation.getParam('switchDisplayArrr'))
    // var switchDisplayArrr = [{"iPower": "1", "onoff": "off", "text": "SWITCH ON"}, {"iPower": "1", "onoff": "on", "text": "SWITCH OFF"}, {"iPower": "1", "onoff": "on", "text": "SWITCH OFF"}]
    
    const [rend, setRend] = useState(false)
    
    auth().onAuthStateChanged(user => {
        if(!user){
            Alert.alert('Logged Out', 'User has been logged out')
            navigation.navigate('Start')
        }
      })
    const onSignOutPressed = async() => {
        try{
            auth().signOut()
        } catch(e){
            Alert.alert('Error', e.message)
        }
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    const addNewSwitch = () => {
        // console.warn('add new switch')
        navigation.navigate('Add New Switch')
    }

    const extractSwitchesData = async _ => {
        // cosnsole.log('**************************************************')
        try{
            db.collection("users").where('Id','==', auth().currentUser.email).get().then(snapshot => {
                snapshot.docs.forEach(doc=>{
                    if(doc.data()['SwitchIds']){
                        switchesId = doc.data()['SwitchIds']
                        switchesId.forEach(id =>{
                            db.collection("switches").where('Id','==', id).get().then(snapshot => {
                                snapshot.docs.forEach(doc=>{
                                    // console.log(doc.data())
                                    switchData[id] = doc.data()
                                    var live = (doc.data()['Live']) ? 'on' : 'off'
                                    var text = (doc.data()['Live']) ? 'SWITCH OFF' : 'SWITCH ON'
                                    switchDisplayArr.push({
                                        iPower: doc.data()['Instantaneous Power'].toString(),
                                        onoff: live,
                                        text: text
                                    })
                                    // console.log(switchData)
                                    // console.log(switchDisplayArr)
                                })
                                setRend(true)
                            })
                        })
                    }
                })
            })
        }catch(err){
            Alert.alert('Error', 'Error while extracting data. Please check if your internet is stable')
        }
        // setTimeout(extractSwitchesData, 1000);
    }
    extractSwitchesData()
    const displaySwitches = () => {
        // if(rend){
        //     console.log(switchDisplayArrr)
        //     console.log('Inside display')
        //         switchDisplayArrr.map(buttonInfo => {
        //         <SwitchButton
        //             iPower={buttonInfo.iPower}
        //             onoff={buttonInfo.onoff}
        //             text={buttonInfo.text}
        //         />
        //     })
        //     setRend(false)
        // }
        console.log('here')
        console.log(switchDisplayArr)
        switchDisplayArr.map(buttonInfo => {
            return(
            <SwitchButton
                iPower={buttonInfo.iPower}
                onoff={buttonInfo.onoff}
                text={buttonInfo.text}
            />
            )
        })
        // setTimeout(displaySwitches, 2000)
    }
    var initialArr = [
        {
            id: 1,
            color: "blue",
            text: "text1"
        },
        {
            id: 2,
            color: "red",
            text: "text2"
        },
    ];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const display = () => {
        demo().then(()=>{
            console.log('ok')
            return(
                <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <CustomButton 
                    text={auth().currentUser.displayName[0].toUpperCase()}
                    onPress={onProfilePressed}
                    type="PROFILE"
                />
                <CustomButton
                    text="SIGN OUT"
                    onPress={onSignOutPressed}
                    type="SIGNOUT"
                />
                </View>
                <View style={{marginTop: 10}}>
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>TOTAL UNITS</Text>
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>CONSUMED</Text>
                <View style={styles.container}>
                <TextInput
                    value = "32.0"
                    editable = {false}
                    style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
                    // multiline={true}
                />
                </View>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {/* {
                    
                    
                    demo()
                } */}
                {displaySwitches()}
                {/* {
                    switchDisplayArrr.map(buttonInfo => {
                        return(
                        <SwitchButton
                            iPower={buttonInfo.iPower}
                            onoff={buttonInfo.onoff}
                            text={buttonInfo.text}
                        />
                        )
                    })
                } */}
                {/* <SwitchButton /> */}
                {/* {
                    initialArr.map((prop, key) => {
                        return (
                            <Button
                            style={{fontSize: 20, color: 'green'}}
                            styleDisabled={{color: 'red'}}
                            // onPress={() => this._handlePress()}
                            title="Press Me"
                          >
                            Press Me
                          </Button>
                        );
                    })
                } */}
                <Pressable
                    onPress={addNewSwitch}
                    style={{ height:165, width:150, borderRadius: 14, margin: 20, backgroundColor: '#327ceb'}}>
                        <Text
                            style={{fontSize: 18, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginTop: 70}}
                        >NEW SWITCH</Text>
                </Pressable>
            </View>
            </View>
            
            )
        })
    }
    
    async function demo() {
        for (let i = 0; i < 6; i++) {
            console.log(`Waiting ${i} seconds...`);
            await sleep(i * 1000);
        }
        console.log('Done');
    }

    // setTimeout(HomeScreen, 5000)
    return(
        // <ScrollView showsHorizontalScrollIndicator={false}>
        // <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        //     <CustomButton 
        //         text={auth().currentUser.displayName[0].toUpperCase()}
        //         onPress={onProfilePressed}
        //         type="PROFILE"
        //     />
        //     <CustomButton
        //         text="SIGN OUT"
        //         onPress={onSignOutPressed}
        //         type="SIGNOUT"
        //     />
        // </View>
        // <View style={{marginTop: 10}}>
        //     <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>TOTAL UNITS</Text>
        //     <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>CONSUMED</Text>
        //     <View style={styles.container}>
        //     <TextInput
        //         value = "32.0"
        //         editable = {false}
        //         style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
        //         // multiline={true}
        //     />
        //     </View>
        // </View>
        // <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        //     {/* {
                
                
        //         demo()
        //     } */}
        //     {displaySwitches()}
        //     {/* {
        //         switchDisplayArrr.map(buttonInfo => {
        //             return(
        //             <SwitchButton
        //                 iPower={buttonInfo.iPower}
        //                 onoff={buttonInfo.onoff}
        //                 text={buttonInfo.text}
        //             />
        //             )
        //         })
        //     } */}
        //     {/* <SwitchButton /> */}
        //     {/* {
        //         initialArr.map((prop, key) => {
        //             return (
        //                 <Button
        //                 style={{fontSize: 20, color: 'green'}}
        //                 styleDisabled={{color: 'red'}}
        //                 // onPress={() => this._handlePress()}
        //                 title="Press Me"
        //               >
        //                 Press Me
        //               </Button>
        //             );
        //         })
        //     } */}
        //     <Pressable
        //         onPress={addNewSwitch}
        //         style={{ height:165, width:150, borderRadius: 14, margin: 20, backgroundColor: '#327ceb'}}>
        //             <Text
        //                 style={{fontSize: 18, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginTop: 70}}
        //             >NEW SWITCH</Text>
        //     </Pressable>
        // </View>
        // </ScrollView>
        <ScrollView showsHorizontalScrollIndicator={false}>
        {display()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // width: '100%',
        height: 40,
        width: 122,
        borderRadius: 14,
        alignSelf: 'center',

        paddingHorizontal: 20,
        marginVertical: 6, 
    },
})

export default HomeScreen