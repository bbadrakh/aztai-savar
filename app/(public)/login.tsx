import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SignInWithOAuthFacebook from '../components/signInWithOAuthFacebook';
import SignInWithOAuthGoogle from '../components/signInWithOAuthGoogle';
import { useFonts } from 'expo-font';

const Login: React.FC = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });

  const onSignInPress = async () => {
    if (!isLoaded) {
      return null;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      console.log('data: ', completeSignIn);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ paddingBottom: 60, fontSize: 26, fontFamily: 'Mono' }}>
        Login to aztai savar
      </Text>
      <View style={styles.oauth}>
        <SignInWithOAuthGoogle title="Login with Google" />
      </View>
      <Spinner visible={loading} />
      <TextInput
        autoCapitalize="none"
        placeholder="Enter your email..."
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      <Button onPress={onSignInPress} title="Login" color="#6c47ff" />

      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text style={{ color: '#0011de', textDecorationLine: 'underline' }}>
            Forgot password?
          </Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text style={{ color: '#0011de', textDecorationLine: 'underline' }}>
            Don't have account
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  oauth: {
    display: 'flex',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
});

export default Login;
