import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import { Link, useGlobalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetPostsQuery,
} from '@/graphql/generated';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFonts } from 'expo-font';
import { Entypo } from '@expo/vector-icons';

const Comment: React.FC = () => {
  const { user } = useUser();
  const { id } = useGlobalSearchParams();
  const { index } = useGlobalSearchParams();
  const { data, loading, error, refetch } = useGetPostsQuery();
  const [createComment, { data: createdData, loading: createLoading, error: createError }] =
    useCreateCommentMutation();
  const [deleteComment, { data: deletedData, loading: deleteLoading, error: deleteError }] =
    useDeleteCommentMutation();
  const [inputValue, setInputValue] = useState('');
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });

  if (!loaded) {
    return <Spinner />;
  }

  if (loading || !data) {
    return <Spinner />;
  }
  if (error) {
    console.log(error);
  }
  const { getPosts } = data;
  const comments = data?.getPosts[Number(index)].comments;
  useEffect(() => {});
  const handlePress = (e: any) => {
    e.preventDefault();
    createComment({
      variables: {
        input: {
          imageUrl: user?.imageUrl || '',
          postId: data?.getPosts[Number(index)].id,
          text: inputValue,
          username: user?.username || '',
          userId: user?.id || '',
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
    setInputValue('');
  };
  const handleDelete = (id: string) => {
    deleteComment({
      variables: {
        id: id,
      },
      onCompleted: () => {
        refetch();
      },
    });
  };
  return (
    <View style={styles.container}>
      <Link href={'..'} style={styles.return}>
        <AntDesign name="arrowleft" size={28} color="black" />
      </Link>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        {getPosts.map((e, i: number) => {
          if (e.id === id) {
            return (
              <View style={styles.cardBorder} key={i}>
                <View style={styles.profile}>
                  <Image style={styles.avatar} source={{ uri: `${e.userImage}` }} />
                  <Text style={styles.username}>{e.username}</Text>
                </View>
                <View style={styles.body}>
                  <Text style={styles.description}>{e.description}</Text>
                  <Image style={styles.image} source={{ uri: `${e.imageUrl}` }} />
                </View>
              </View>
            );
          }
        })}
        <View style={{ marginBottom: 80 }}>
          <View style={styles.locationTitleContainer}>
            <Text style={{ alignSelf: 'center', fontSize: 20, marginTop: 20, fontFamily: 'Mono' }}>
              Location
            </Text>
            <Entypo name="location-pin" size={24} color="black" style={{ marginTop: 20 }} />
          </View>
          <MapView style={styles.map} provider={PROVIDER_GOOGLE}>
            <Marker
              coordinate={{
                latitude: Number(data.getPosts[Number(index)].latitude),
                longitude: Number(data.getPosts[Number(index)].longitude),
              }}
              description={'Last seen here'}
            />
          </MapView>
          {comments?.length !== 0 &&
            comments?.map((item, index: number) => {
              const checked = item?.userId === user?.id;
              return (
                <View style={styles.commentContainer} key={index}>
                  <View style={styles.profileContainer}>
                    <Image style={styles.avatar} source={{ uri: `${item?.imageUrl}` }} />
                    <View style={{ marginLeft: 10 }}>
                      <Text>{item?.username}</Text>
                      <Text style={{ maxWidth: 150 }}>{item?.text}</Text>
                    </View>
                    {checked && item?.id && (
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <FontAwesome
                          name="trash-o"
                          size={20}
                          color="grey"
                          style={{ marginLeft: 15 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
        </View>
        {comments?.length === 0 && (
          <View
            style={{ alignSelf: 'center', marginTop: 10, paddingBottom: 30, marginBottom: 200 }}>
            <Text style={{ color: 'gray', fontFamily: 'Mono' }}>Be the first one to comment</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TextInput
          style={styles.input}
          clearButtonMode="always"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button size="sm" style={styles.button} onPress={handlePress}>
          Submit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  return: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 5,
    paddingBottom: 10,
  },
  cardBorder: {
    width: 320,
    alignSelf: 'center',
    maxHeight: 'auto',
    paddingBottom: 10,
    marginTop: 10,
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
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
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
  },
  profileContainer: {
    height: 60,
    flexDirection: 'row',
    paddingRight: 15,
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 40,
    left: 10,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 10,
  },
  input: {
    borderWidth: 1,
    height: 30,
    borderRadius: 5,
    width: '80%',
  },
  button: {
    height: 30,
    fontSize: 10,
    fontFamily: 'Mono',
  },
  commentContainer: {
    marginTop: 20,
    marginLeft: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  map: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  locationTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Comment;
