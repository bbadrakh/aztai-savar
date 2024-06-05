import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { TouchableOpacity, View, Text } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuthGoogle: React.FC<any> = ({ title }: { title: string }) => {
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

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
        backgroundColor: '#fb3b1e',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
      }}>
      <AntDesign name="googleplus" size={24} color="white" />
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 10,
            fontFamily: 'Mono',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInWithOAuthGoogle;
