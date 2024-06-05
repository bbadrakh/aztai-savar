import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import Constants from 'expo-constants';
import { useUser } from '@clerk/clerk-expo';
import LogoutButton from '../utils/logout';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Profile = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [username, setUsername] = useState(user?.username);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [loaded] = useFonts({
    Mono: require('../../assets/fonts/Mono.ttf'),
  });
  const onSaveUser = async () => {
    setError('');
    try {
      const result = await user!.update({
        firstName: firstName!,
        lastName: lastName!,
        username: username!,
      });
      console.log('Result:', result);
    } catch (e: any) {
      setError(e.errors[0].message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    setModal(!modal);
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  console.log(user);

  if (!loaded) {
    return;
  }
  return (
    <View style={styles.container}>
      <LogoutButton />
      <Text style={{ textAlign: 'center', fontFamily: 'Mono' }}>
        Good to see you {user!.firstName} {user!.lastName} 🚀
      </Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
          }}>
          <Image source={{ uri: `${image?.uri || user!.imageUrl}` }} style={styles.profile} />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
          }}>
          <Pressable style={styles.centeredView} onPress={() => setModal(!modal)}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setModal(!modal)} style={styles.modalSetter}>
                <Image
                  source={{ uri: `${image?.uri || user!.imageUrl}` }}
                  style={styles.modalProfile}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 40 }} onPress={pickImage}>
                <Text>Upload profile picture</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        <View style={styles.textContainer}>
          <Text style={{ marginLeft: 30, fontSize: 19, fontWeight: '800', fontFamily: 'Mono' }}>
            {user?.username || 'Anonymous user'}
          </Text>
          <Text style={{ fontFamily: 'Mono', fontSize: 9, marginLeft: 16, color: 'grey' }}>
            {user?.id}
          </Text>
        </View>
        <TouchableOpacity
          style={{ marginLeft: 10, marginTop: 22 }}
          onPress={async () => {
            await Clipboard.setStringAsync(user!.id);
          }}>
          <FontAwesome5 name="clipboard" size={18} color="#2f2f2f" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Username" onChangeText={setUsername} style={styles.inputField} />
        <TextInput placeholder="First Name" onChangeText={setFirstName} style={styles.inputField} />
        <TextInput placeholder="Last Name" onChangeText={setLastName} style={styles.inputField} />
        {error && <Text style={{ color: 'red', fontFamily: 'Mono', fontSize: 16 }}>{error}</Text>}
        <Button onPress={onSaveUser} title="Update account" color={'#6c47ff'}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    width: '100%',
    height: '100%',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Mono',
    paddingLeft: 40,
    paddingRight: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  textContainer: {
    display: 'flex',
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbbb',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalSetter: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
export default Profile;
