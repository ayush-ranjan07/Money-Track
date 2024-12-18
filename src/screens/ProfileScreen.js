import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';

const { height, width } = Dimensions.get('screen');

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

  const currencyOptions = ['USD', 'EUR', 'INR', 'GBP', 'AUD'];

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedDetails = await AsyncStorage.getItem('userDetails');
      const storedPicture = await AsyncStorage.getItem('profilePicture');
      if (storedDetails) {
        setUserDetails(JSON.parse(storedDetails));
        setEditedDetails(JSON.parse(storedDetails));
      }
      if (storedPicture) {
        setProfilePicture(storedPicture);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    if (!editedDetails.name || !editedDetails.age || !editedDetails.monthlyIncome || !editedDetails.currency) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const updatedDetails = { ...userDetails, ...editedDetails };
      await AsyncStorage.setItem('userDetails', JSON.stringify(updatedDetails));
      setUserDetails(updatedDetails);
      setIsModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error('Error saving user details:', error);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'No image selected.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image.');
      } else {
        const uri = response.assets[0].uri;
        setProfilePicture(uri);
        await AsyncStorage.setItem('profilePicture', uri);
      }
    });
  };

  const handleCurrencySelect = (currency) => {
    setEditedDetails({ ...editedDetails, currency });
    setCurrencyModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profile}>

      <Image style={styles.logo} source={require('../../assets/profile.png')} />
      <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsModalVisible(true)}
            >
            <Icon name="edit" size={20} color="#fff" />
            
          </TouchableOpacity>
            </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            style={styles.profileImage}
            source={profilePicture ? { uri: profilePicture } : require('../../assets/defaultavatar.jpg')}
          />
        </TouchableOpacity>
        <View styles={{flexDirection:'column'}}>
          <Text style={styles.hello}>Hello,</Text>
          <Text style={styles.name}>{userDetails?.name || 'Champion'}</Text>

        </View>
      </View>
      {userDetails ? (
        <>
          
            
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{userDetails.age}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Monthly Income</Text>
            <Text style={styles.value}>{userDetails.currency } {userDetails.monthlyIncome}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Currency</Text>
            <Text style={styles.value}>{userDetails.currency}</Text>
          </View>

          
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}

      {/* Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={editedDetails.name || ''}
              onChangeText={(value) => setEditedDetails({ ...editedDetails, name: value })}
              placeholder="First Name"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              value={editedDetails.age || ''}
              onChangeText={(value) => setEditedDetails({ ...editedDetails, age: value })}
              placeholder="Enter age"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedDetails.monthlyIncome || ''}
              onChangeText={(value) => setEditedDetails({ ...editedDetails, monthlyIncome: value })}
              placeholder="Enter monthly income"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => setCurrencyModalVisible(true)}
              style={styles.currencyButton}
            >
              <Text style={styles.currencyButtonText}>
                {editedDetails.currency || 'Select Currency'}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
              >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <Modal visible={isCurrencyModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <FlatList
              data={currencyOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCurrencySelect(item)}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setCurrencyModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  profile:{
    flexDirection:'row',
    justifyContent:'space-between'
    
  },
  header: {
    alignItems: 'center',
    margin: 20,
    flexDirection:'row',
    
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#F3FF90',
  },
  fieldContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 8,
    borderColor: '#F3FF90',
    borderWidth:2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    
    color: 'white',
  },
  value: {
    fontSize: 20,
    color: '#06D001',
    marginTop: 5,
    fontWeight: 'bold'
  },
  editButton: {
    backgroundColor: '#06D001',
    marginRight:20,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    height:35,
    width:35,
    justifyContent: 'center',
    borderRadius:50,
    marginTop:35,
  },
  loadingText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10, 
    width: '80%',
    borderWidth:2,
    borderColor:'#F3FF90'
  },
  modalTitle: {
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#F3FF90', 
    marginBottom: 20
  },
  input: {
    borderWidth: 1, 
    borderColor: '#059212', 
    marginBottom: 15, 
    padding: 10, 
    color: 'white', 
    borderRadius: 5
  },
  currencyButton: {
    borderWidth: 1,
    borderColor: '#059212',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  currencyButtonText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#06D001',
    paddingVertical: 10,
    borderRadius: 8,
    height:45,
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal:30,
  },
  saveText: {
    color: 'black',
    fontSize: 16,
    fontWeight:'bold'
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal:25,
    height:45,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:'bold'
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color:'white'
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent:'center',
    alignItems:'center'
    
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal:20
  },
  logo:{width:100,height:25,marginBottom: 0,marginTop:40,left:20},
  hello:{color:'gray',fontSize:25,marginBottom:-10,fontWeight:'bold',marginHorizontal:10},
  name:{color:'white',fontSize:45,marginHorizontal:10,fontWeight:'bold'}
});
export default ProfileScreen;


