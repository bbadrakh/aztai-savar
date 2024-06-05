import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Text, TouchableOpacity, View } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuthFacebook = () => {
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View
      style={{
        height: 50,
        width: '80%',
        backgroundColor: '#006FB9',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        flexDirection: 'row',
        alignSelf: 'center',
      }}>
      <FontAwesome5 name="facebook" size={22} color="white" />
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 10,
            fontFamily: 'Mono',
          }}>
          Login with facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInWithOAuthFacebook;
