import { Text, View, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';
import Bell from '../utils/bell';
import { useFonts } from 'expo-font';
import CardWanted from '../components/cardWanted';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Post } from '../types';
import { useGetPostsQuery } from '@/graphql/generated';

const Wanted: React.FC = () => {
  const { data, loading, error } = useGetPostsQuery();
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
  if (loading || !data) {
    return <Spinner />;
  }
  if (error) {
    console.log(error);
  }
  const { getPosts } = data;

  return (
    <View style={styles.container}>
      <Bell />
      <Text style={styles.title}>Wanted animals</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        //@ts-ignore
        data={getPosts}
        renderItem={(info: { index: number; item: Post }) => (
          <View key={info.index}>
            {info.item.type == 'wanted' && (
              <CardWanted
                description={info.item.description}
                imageUrl={info.item.imageUrl}
                latitude={info.item.latitude || ''}
                longitude={info.item.longitude || ''}
                userImage={info.item.userImage}
                username={info.item.username}
                id={info.item.id}
                postId={info.item.id}
                index={info.index}
                userId={info.item.userId}
              />
            )}
          </View>
        )}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 21,
    fontWeight: '500',
    fontFamily: 'Mono',
    alignSelf: 'center',
    paddingBottom: 10,
  },
});

export default Wanted;
