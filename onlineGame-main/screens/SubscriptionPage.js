import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  I18nManager
} from "react-native";
import ImageSlider from "./ImageSlider";
import axios from "axios";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const SubscriptionPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cc, setCc] = useState("");
  const [did, setDid] = useState(uuid.v4());
  const [apiToken, setApiToken] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await axios.get("https://ipinfo.io/json?token=285fe0806df8ea");
        setCc(res.data.country);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };

    fetchCountryCode();
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !cc || !did) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://cashgames.website/api/register",
        {
          name,
          email,
          password,
          cc,
          did,
          rb: "none",
        },
      );

      let jsonD = JSON.parse(response.data.data);
      console.log(jsonD);
      if (jsonD.status === 1) {
        const authkey = jsonD.message;
        const apiKey = jsonD.u;


        // Store tokens in AsyncStorage
        await AsyncStorage.setItem("AuthToken", authkey);
        await AsyncStorage.setItem("ApiToken", apiKey);

        setApiToken(apiKey); // Set the apiToken in state
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Error", response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name={I18nManager.isRTL ? "chevron-forward-outline" : "chevron-back-outline"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      <View style={styles.topSection}>
        <Text style={styles.appName}>Big Reward</Text>
        <ImageSlider />
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#131224",
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    [I18nManager.isRTL ? 'right' : 'left']: 10,
    zIndex: 1,
  },  
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    fontFamily: "Roboto", // You may need to import and load this font
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700", // Gold color for "Big Reward"
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#6200ea",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 32,
    textAlign: "center",
  },
  link: {
    color: "#6200ea",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderColor: "#6200ea",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#3d0066",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#6200ea",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#3d0066",
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    color: "white",
    height: 50,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  passwordToggle: {
    padding: 10,
  },
  button: {
    backgroundColor: "#6A5DA5",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubscriptionPage;
