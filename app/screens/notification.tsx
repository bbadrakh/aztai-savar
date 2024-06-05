import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import NotificationMessage from './shortNotification';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useGetPostsQuery } from '@/graphql/generated';

const Notifications: React.FC = () => {
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });
  const { user } = useUser();
  const { data, loading, error } = useGetPostsQuery();
  let check = true;
  if (!loaded || !data) return <Text>Font not loaded</Text>;
  if (loading) return <Spinner></Spinner>;
  if (error) return <Text>{error.message}</Text>;
  const { getPosts } = data;
  return (
    <View style={styles.container}>
      <Link href={'..'} style={styles.return}>
        <AntDesign name="arrowleft" size={28} color="black" />
      </Link>
      <Text style={styles.title}>{user?.username}'s notification</Text>
      {getPosts.map((item, index: number) => {
        if (item.userId === user?.id) {
          check = false;
          return (
            <ScrollView style={styles.notificationContainer} key={index}>
              <NotificationMessage
                imageUrl={item.userImage}
                username={item.username}
                description={item.description}
                postId={item.id}
                index={index}
              />
            </ScrollView>
          );
        }
      })}
      {check && (
        <View style={{ alignSelf: 'center', marginTop: 100 }}>
          <Text style={{ fontSize: 18, color: 'gray', width: '60%', fontFamily: 'Mono' }}>
            You have not posted any post yet :D
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  return: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Mono',
    marginTop: 30,
  },
  notificationContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default Notifications;
