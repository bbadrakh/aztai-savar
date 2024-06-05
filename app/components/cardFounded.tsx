import { View, Text, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { EvilIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Type {
  description: string;
  imageUrl: string;
  latitude: string;
  longitude: string;
  userImage: string;
  username: string;
  id: string;
  postId: string;
  index: number;
}

const CardFounded: React.FC<Type> = ({
  description,
  imageUrl,
  latitude,
  longitude,
  userImage,
  username,
  id,
  postId,
  index,
}) => {
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });
  if (!loaded) {
    return (
      <>
        <Text>Font not found</Text>
      </>
    );
  }

  return (
    <View style={styles.cardBorder}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: `${userImage}` }} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.description}>{description}</Text>
        <Image style={styles.image} source={{ uri: `${imageUrl}` }} />
      </View>
      <Link
        href={{ pathname: '/screens/comment', params: { id: postId, index: index } }}
        style={styles.comment}>
        <EvilIcons name="comment" size={50} color="black" style={{ marginBottom: 20 }} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBorder: {
    width: 320,
    alignSelf: 'center',
    maxHeight: 'auto',
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profile: {
    display: 'flex',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingLeft: 35,
    paddingRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    marginLeft: 30,
    fontWeight: '400',
    color: '#3c3e3c',
    fontFamily: 'Mono',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  body: {
    display: 'flex',
    height: 'auto',
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  description: {
    fontFamily: 'Mono',
    color: '#3c3e3c',
    fontSize: 15,
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 10,
  },
  image: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  comment: {
    alignSelf: 'center',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default CardFounded;
