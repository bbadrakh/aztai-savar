import { useAuth } from '@clerk/clerk-expo';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={styles.container}>
      <Ionicons style={styles.logOut} name="log-out-outline" size={32} color={'red'} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  logOut: {
    marginTop: 10,
    marginRight: 20,
  },
});

export default LogoutButton;
