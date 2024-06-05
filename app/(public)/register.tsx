import { Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Link, Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import SignInWithOAuthGoogle from '../components/signInWithOAuthGoogle';
import Constants from 'expo-constants';

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      alert(err!.errors[0].message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Link href={'..'} style={styles.return}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </Link>
      {!pendingVerification && (
        <Text style={{ fontSize: 26, fontFamily: 'Mono', marginTop: 80 }}>
          Sign in to aztai savar
        </Text>
      )}
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />
      {!pendingVerification && (
        <View style={styles.inputContainer}>
          <SignInWithOAuthGoogle title="Sign up with Google" />
          <TextInput
            autoCapitalize="none"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            style={styles.inputField}
          />
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

          <Button onPress={onSignUpPress} title="Sign up" color={'#6c47ff'}></Button>
        </View>
      )}

      {pendingVerification && (
        <>
          <View style={{ marginTop: 200 }}>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
          </View>
          <Button onPress={onPressVerify} title="Verify Email" color={'#6c47ff'}></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    height: '100%',
    marginTop: Constants.statusBarHeight,
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
  return: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    marginTop: 100,
  },
});

export default Register;
