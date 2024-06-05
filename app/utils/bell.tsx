import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const Bell: React.FC = () => {
  return (
    <View style={styles.container}>
      <Link href={'/screens/notification'} style={styles.bell}>
        <FontAwesome5 name="bell" size={30} color="black" />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
  bell: {
    marginRight: 40,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});

export default Bell;
