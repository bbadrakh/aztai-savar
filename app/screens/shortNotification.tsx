import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

interface Type {
  imageUrl: string;
  username: string;
  description: string;
  postId: string;
  index: number;
}

const NotificationMessage: React.FC<Type> = ({
  imageUrl,
  username,
  description,
  postId,
  index,
}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.profile} source={{ uri: imageUrl }}></Image>
      <Link
        href={{ pathname: '/screens/comment', params: { id: postId, index: index } }}
        style={{ width: '100%', marginLeft: 30 }}>
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>{username}'s post</Text>
          <Text style={{ fontWeight: '300', color: 'grey', maxWidth: 200 }}>{description}</Text>
        </View>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '90%',
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginLeft: 20,
  },
});

export default NotificationMessage;
