import { Text, StyleSheet, View, FlatList } from 'react-native';
import Constants from 'expo-constants';
import Bell from '../utils/bell';
import CardFounded from '../components/cardFounded';
import { Post } from '../types';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useGetPostsQuery } from '@/graphql/generated';

const Founded: React.FC = () => {
  const { data, loading, error } = useGetPostsQuery();
  if (loading || !data) return <Spinner />;
  if (error) return <Text>{error.message}</Text>;
  const { getPosts } = data;
  return (
    <View style={styles.container}>
      <Bell />
      <Text style={styles.title}>Founded animals</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        //@ts-ignore
        data={getPosts}
        renderItem={(info: { index: number; item: Post }) => (
          <View key={info.index}>
            {info.item.type == 'founded' && (
              <CardFounded
                description={info.item.description}
                imageUrl={info.item.imageUrl}
                latitude={info.item.latitude || ''}
                longitude={info.item.longitude || ''}
                userImage={info.item.userImage}
                username={info.item.username}
                id={info.item.id}
                postId={info.item.id}
                index={info.index}
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
    paddingBottom: 10,
    fontSize: 21,
    fontWeight: '500',
    fontFamily: 'Mono',
    alignSelf: 'center',
  },
});

export default Founded;
