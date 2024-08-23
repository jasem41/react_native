import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import Modal from 'react-native-modal';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [apiToken, setApiToken] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const token = await AsyncStorage.getItem("AuthToken");

      try {
        const res = await axios.post("https://cashgames.website/api/profile", {}, {
          headers: {
            "Authorization": token,
          },
        });
        const data = res.data;
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
        const apiTokenStored = await AsyncStorage.getItem("ApiToken");
        setApiToken(apiTokenStored);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfileInfo();
  }, []);

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("AuthToken");

    try {
      const res = await axios.post("https://cashgames.website/api/profile/update", {
        type: '2',
        data: name,
      }, {
        headers: {
          "Authorization": token,
        },
      });
      if (res.data.status === 1) {
        alert('Profile updated successfully');
      } else {
        alert('Profile update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Profile update failed');
    }
  };

  const handleDeleteProfile = async () => {
    setModalVisible(true);
  };

  const confirmDeleteProfile = async () => {
    const token = await AsyncStorage.getItem("AuthToken");

    try {
      await axios.post("https://cashgames.website/api/me/del", {}, {
        headers: {
          "Authorization": token,
        },
      });
      alert('Profile deleted successfully');
      navigation.navigate("Login");
    } catch (err) {
      console.error(err);
      alert('Profile deletion failed');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  const handleUpdateAvatar = async () => {
    const token = await AsyncStorage.getItem("AuthToken");

    let formData = new FormData();
    formData.append('image', {
      uri: newAvatar,
      name: 'avatar.jpg',
      type: 'image/jpeg'
    });

    try {
      const res = await axios.post("https://cashgames.website/api/profile/update/avatar", formData, {
        headers: {
          "Authorization": token,
          'Content-Type': 'multipart/form-data'
        },
      });
      if (res.data.status === 1) {
        setAvatar(newAvatar);
        setNewAvatar(null);
        alert('Avatar updated successfully');
      } else {
        alert('Avatar update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Avatar update failed');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AuthToken");
      navigation.navigate("Login");
    } catch (err) {
      console.error(err);
      alert('Logout failed');
    }
  };

  const copyToClipboard = async () => {
    Clipboard.setString(apiToken);
    alert('API Token copied to clipboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>

          {/* New Earn by referral Button */}
          <TouchableOpacity style={styles.referralButton} onPress={() => navigation.navigate("Refral")}>
            <Text style={styles.referralButtonText}>Earn by referral</Text>
          </TouchableOpacity>

          {avatar || newAvatar ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: avatar || newAvatar }} style={styles.avatar} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="person-circle" size={100} color="white" style={styles.avatarIcon} />
            </TouchableOpacity>
          )}
          {!avatar && !newAvatar && (
            <Text style={styles.changeText}>Change Profile Picture</Text>
          )}
          {newAvatar && (
            <TouchableOpacity style={styles.button} onPress={handleUpdateAvatar}>
              <Text style={styles.buttonText}>Upload New Avatar</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          <Text style={styles.label}>User ID:</Text>
          <View style={styles.apiTokenContainer}>
            <TextInput style={[styles.input, styles.apiTokenInput]} value={apiToken} editable={false} />
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyIcon}>
              <Ionicons name="copy-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Buttons Aligned Side by Side */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteProfile}>
              <Text style={styles.buttonText}>Delete Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure you want to delete your profile?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.closeButton, styles.confirmButton]}
              onPress={confirmDeleteProfile}
            >
              <Text style={styles.closeButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#131224",
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: "white",
  },
  card: {
    width: '100%',
    padding: 16,
    backgroundColor: '#1E1D3D',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoutIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  referralButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    padding: 8,
    borderRadius: 5,
  },
  referralButtonText: {
    color: '#1E1D3D',
    fontWeight: 'bold',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarIcon: {
    marginBottom: 16,
  },
  changeText: {
    color: "white",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#2E2D4F',
    borderRadius: 8,
    color: 'white',
  },
  apiTokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  apiTokenInput: {
    flex: 1,
  },
  copyIcon: {
    marginLeft: 8,
  },
  button: {
    padding: 12,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#D11A2A',
    flex: 1,
    marginRight: 8,
  },
  updateButton: {
    flex: 1,
  },
  buttonText: {
    color: '#1E1D3D',
    fontWeight: 'bold',
  },
  modalView: {
    backgroundColor: "#2E2D4F",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalText: {
    color: "white",
    marginBottom: 16,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#FFD700',
  },
  cancelButton: {
    backgroundColor: '#D11A2A',
  },
  closeButtonText: {
    color: '#1E1D3D',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
