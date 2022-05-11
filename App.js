/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import Navigation from './src/navigation';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';

console.reportErrorsAsExceptions = false;

const App = () => {
  return (
    <Provider store={Store}>
      <SafeAreaView style={styles.root}>
        <Navigation />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
