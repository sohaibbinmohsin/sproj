import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const CustomButton = ({onPress, text, type = 'PRIMARY', bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: '100%',

    padding: 15,
    marginVertical: 6,

    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#053275',
  },

  container_SECONDARY: {
    borderColor: '#053275',
    backgroundColor: 'white',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  container_PROFILE: {
    width: 67,
    height: 67,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#327CEB',
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 20,
    margin: 20,
  },

  container_SIGNOUT: {
    width: 150,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#053275',
    marginTop: 30,
    margin: 20,
  },

  container_SWITCHOFF: {
    width: 150,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'red',
    marginTop: 30,
    margin: 20,
  },

  container_DELETE: {
    width: 150,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#800000',
    margin: 20,
    marginTop: 30,
  },

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_SECONDARY: {
    color: '#053275',
  },

  text_TERTIARY: {
    color: 'white',
  },

  text_PROFILE: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
});

export default CustomButton;
