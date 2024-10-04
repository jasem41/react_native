import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import { GlobalProvider } from "./context/GlobalContext";
import messaging from '@react-native-firebase/messaging';



export default function App() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    // console.log("Token:", token);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    })
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    })
  }, []);

  return (
    <GlobalProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
}
