import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import Bell from '../utils/bell';
import { useUser } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useCreatePostMutation, useGetPostsQuery } from '@/graphql/generated';
import { Entypo } from '@expo/vector-icons';

const AddPoster: React.FC = () => {
  const [status, getPermission] = Location.useForegroundPermissions();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>();
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState(false);
  const { user } = useUser();
  const [imageUrl, setImageUrl] = useState();
  const [createPost, { data: createdData, loading: createLoading, error: createError }] =
    useCreatePostMutation();
  const { data, loading, error, refetch } = useGetPostsQuery();
  const [draggableMarker, setDraggableMarker] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });
  // const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
  // const [libraryStatus, requestLibraryPermission] = ImagePicker.uxseMediaLibraryPermissions();
  useEffect(() => {
    Location.getCurrentPositionAsync({}).then((location) => {
      console.log('location', location.coords);
      setDraggableMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  }, []);

  if (!loaded) {
    return <Spinner />;
  }

  // if (!cameraStatus || !cameraStatus.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Give camera permission</Text>
  //       <Button title="Enable camera" onPress={requestCameraPermission} />
  //     </View>
  //   );
  // }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    setModal(!modal);
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
    setModal(!modal);
  };

  const uploadImage = async (type: string) => {
    if (image) {
      if (description) {
        const data = new FormData();
        data.append('file', {
          name: 'image',
          //@ts-ignore
          type: image.type,
          uri: image.uri,
        });
        let realImageUrl = '';
        const imageResponse = await fetch(
          `https://aztai-savar-backend.vercel.app/api/file/upload`,
          {
            method: 'POST',
            body: data,
          },
        );
        const imageData = await imageResponse.json();
        realImageUrl = imageData.url;
        console.log(realImageUrl);
        if (realImageUrl && user?.username) {
          createPost({
            variables: {
              input: {
                userId: user?.id,
                username: user?.username,
                userImage: user?.imageUrl,
                description: description,
                latitude: `${draggableMarker.latitude}`,
                longitude: `${draggableMarker.longitude}`,
                imageUrl: realImageUrl,
                type: type,
              },
            },
            onCompleted: () => {
              refetch();
            },
          });
        }
        setDescription('');
        setImage(undefined);
        Alert.alert(`Post with ${type} type has been posted successfully.`);
      } else {
        Alert.alert('Description not found');
      }
    } else {
      Alert.alert('Image not found');
    }
  };

  const uploadImageFounded = async (type: string) => {
    if (image) {
      if (description) {
        const data = new FormData();
        data.append('file', {
          name: 'image',
          //@ts-ignore
          type: image.type,
          uri: image.uri,
        });
        let realImageUrl = '';
        const imageResponse = await fetch(
          `https://aztai-savar-backend.vercel.app/api/file/upload`,
          {
            method: 'POST',
            body: data,
          },
        );
        const imageData = await imageResponse.json();
        realImageUrl = imageData.url;
        console.log(realImageUrl);
        if (realImageUrl && user?.username) {
          createPost({
            variables: {
              input: {
                userId: user?.id,
                username: user?.username,
                userImage: user?.imageUrl,
                description: description,
                latitude: `${draggableMarker.latitude}`,
                longitude: `${draggableMarker.longitude}`,
                imageUrl: realImageUrl,
                type: type,
              },
            },
            onCompleted: () => {
              refetch();
            },
          });
        }
        setDescription('');
        setImage(undefined);
        Alert.alert(`Post with ${type} type has been posted successfully.`);
      } else {
        Alert.alert('Description not found');
      }
    } else {
      Alert.alert('Image not found');
    }
  };

  return (
    <View style={styles.container}>
      <Bell />
      <ScrollView
        style={styles.body}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profile} />
          <Text style={{ marginLeft: 40, fontSize: 22, fontFamily: 'Mono' }}>{user?.username}</Text>
        </View>
        <TextInput
          placeholder="Description here"
          style={{ marginTop: 20, marginLeft: 30, width: '80%', height: 'auto' }}
          clearButtonMode="always"
          multiline={true}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
          }}>
          <Pressable style={styles.centeredView} onPress={() => setModal(!modal)}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={pickImage}>
                <FontAwesome name="photo" size={30} color="black" style={{ alignSelf: 'center' }} />
                <Text style={{ marginTop: 10, fontFamily: 'Mono' }}>
                  Choose a picture from gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 20 }} onPress={captureImage}>
                <FontAwesome
                  name="camera"
                  size={30}
                  color="black"
                  style={{ alignSelf: 'center' }}
                />
                <Text style={{ marginTop: 10, fontFamily: 'Mono' }}>Take a picture</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        <TouchableOpacity style={styles.addPhoto} onPress={() => setModal(!modal)}>
          {image == null && (
            <MaterialIcons
              name="add-to-photos"
              size={40}
              color="black"
              style={{ marginVertical: 140 }}
            />
          )}
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{ width: '100%', height: 300, borderRadius: 10 }}
            />
          )}
        </TouchableOpacity>
        <View style={{ marginTop: 20 }}>
          <View style={styles.locationTitleContainer}>
            <Text style={{ fontSize: 20, fontFamily: 'Mono' }}>Location</Text>
            <Entypo name="location-pin" size={24} color="black" />
          </View>
          <MapView
            style={styles.mapview}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
            zoomEnabled
            onPress={(e) => {
              setDraggableMarker(e.nativeEvent.coordinate);
            }}>
            <Marker
              draggable
              coordinate={{
                latitude: draggableMarker.latitude,
                longitude: draggableMarker.longitude,
              }}
              onDragEnd={(e) => setDraggableMarker(e.nativeEvent.coordinate)}
            />
          </MapView>
        </View>
      </ScrollView>
      <View style={styles.typeContainer}>
        <TouchableOpacity style={styles.wantedButton} onPress={() => uploadImage('wanted')}>
          <Text style={{ fontFamily: 'Mono' }}>Wanted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foundedButton}
          onPress={() => uploadImageFounded('founded')}>
          <Text style={{ fontFamily: 'Mono' }}>Founded</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  body: {
    height: 'auto',
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    paddingTop: 30,
    display: 'flex',
    paddingBottom: 20,
  },
  identity: {
    display: 'flex',
    flexDirection: 'row',
    height: 'auto',
    alignItems: 'center',
    alignSelf: 'center',
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  addPhoto: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    marginTop: 20,
    borderColor: 'gray',
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccc',
    opacity: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    opacity: 1,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mapview: {
    width: 300,
    height: 300,
    marginBottom: 50,
    borderRadius: 20,
    alignSelf: 'center',
  },
  locationTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foundedButton: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  wantedButton: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});

export default AddPoster;
