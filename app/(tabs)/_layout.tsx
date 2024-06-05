import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

const TabLayout: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });

  if (!loaded)
    return (
      <>
        <Text>Font not found</Text>
      </>
    );
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarLabelStyle: { fontFamily: 'Mono' } }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => <FontAwesome name="paw" size={24} color="black" />,
          tabBarLabel: 'Wanted',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="founded"
        options={{
          tabBarIcon: () => <Ionicons name="locate" size={24} color="black" />,
          tabBarLabel: 'Founded',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="addposter"
        options={{
          tabBarIcon: () => <AntDesign name="plus" size={24} color="black" />,
          tabBarLabel: 'AddPoster',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => <MaterialCommunityIcons name="account" size={26} color="black" />,
          tabBarLabel: 'Account',
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabLayout;
