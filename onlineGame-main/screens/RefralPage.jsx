import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Icons

const ReferralPage = ({ navigation }) => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem('ApiToken');
      setUserId(token);
    };
    fetchUserId();
  }, []);

  const shareReferralLink = async () => {
    try {
      await Share.share({
        message: `Join me on CashGames: https://cashgames.website/?ref=${userId}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invite Friends</Text>
      <Text style={styles.howItWorks}>How It Works</Text>
      <Text style={styles.instructions}>
        {'\u2022'} <Text style={styles.instructionText}>Share your referral link with friends.</Text>
        {'\n'}
        {'\u2022'} <Text style={styles.instructionText}>Your friends receive bonus coins for joining using your link.</Text>
        {'\n'}
        {'\u2022'} <Text style={styles.instructionText}>Earn <Text style={styles.boldText}>50% lifetime commission</Text> on their earnings.</Text>
      </Text>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>{`https://cashgames.website/?ref=${userId}`}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={shareReferralLink}>
        <Text style={styles.buttonText}>Share Referral Link</Text>
      </TouchableOpacity>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1D3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Roboto', // Modern font
  },
  howItWorks: {
    color: '#FFD700',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  instructions: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 25,
    // textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Roboto',
  },
  instructionText: {
    fontSize: 20,
    color: '#FFD700',
    fontFamily: 'Roboto',
  },
  boldText: {
    fontWeight: '700',
    color: '#FFD700',
  },
  linkContainer: {
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    width: '100%',
    backgroundColor: '#2A2A2A',
  },
  linkText: {
    color: '#FFD700',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#1E1D3D',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
});

export default ReferralPage;
