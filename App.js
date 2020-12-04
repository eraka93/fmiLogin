import 'react-native-gesture-handler';
import React, { useState, useEffect  }  from 'react';
import { Button, Text, TextInput, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import client from "./components/api.js";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Welcome = ({ navigation }) => {

  const [user,setUser] = useState();
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  useEffect(()=>{
    async function fetchData() {
      try{
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();    
  },[])

  const logOut = () => {
    AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    navigation.push('Welcome');
  }

  if(isLoggedIn){
    return (
      <View style={styles.container}>
        <Text>Profil korisnika</Text>
        <Button 
            style={styles.but}
            title={'Prikazi podatke korisnika'}
            onPress={() => navigation.push('Details', {users: user} )}
        />
        <Button 
            style={styles.but}
            title={'Izloguj se'}
            onPress={logOut}
        />
      </View>
    );
  }
  else{
    return (
        <View style={styles.container}>
          <Text>Dobrodošli!</Text>
          <Text>Da bi ste videli podatke korisnika molimo vas da se ulogujete</Text>
          <Button title={'Uloguj se'} style={styles.input} onPress={() => navigation.push('LoginScreen')}/>      
        </View>
    );
  }
};


const Details = ({ navigation, route }) => {


  /*
  useEffect(() => {
    client.get("/candidates/me/").then((res) => {
      console.log(res.data);
    });
  },[])  */
  
  /*const [tipUsera, setTipUsera] = useState('Neodredjen');
  if(route.params.users.is_candidate) setTipUsera('Kandidat');
  if(route.params.users.is_employer) setTipUsera('Poslodavac'); */
    
  return (
    <View style={styles.container}>
      <Text>Email korisnika: {route.params.users.email}</Text>
      <Text>Username: {route.params.users.username}</Text>
      <Text>ID: {route.params.users.id}</Text>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const onPress = () => {
    client
    .post("/auth/users/login/", {
        username: username,
        password: password,
    })
    .then((res) => {
        if(res){
          console.log(res.data);
          AsyncStorage.setItem('user', JSON.stringify(res.data));  
          navigation.push('Welcome');
        }
    });   
  }

  return (
      <View style={styles.container}>
        <TextInput
          defaultValue={username}
          onChangeText={username => setUsername(username)}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          defaultValue={password}
          onChangeText={password => setPassword(password)}
          placeholder={'Password'}
          style={styles.input}
          secureTextEntry={true}
        />        
        <Button
          title={'Login'}
          style={styles.input}  
          onPress={onPress}
        />
      </View>
    );
};

export default function App() {
  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">   
          <Stack.Screen name="Welcome" component={Welcome}  options={{ title: 'Welcome' }}/>          
          <Stack.Screen name="LoginScreen"  component={LoginScreen} options={{ title: 'Sign In' }}/>    
          <Stack.Screen name="Details"  component={Details} options={{ title: 'User Profile' }}/>   
        </Stack.Navigator>
      </NavigationContainer>
    );
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
