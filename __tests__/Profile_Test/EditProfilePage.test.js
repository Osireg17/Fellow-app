import React from 'react';
import { render, fireEvent} from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';


import EditProfilePage from '../../screens/Profile/EditProfilePage';


describe("<EditProfilePage />", () => {
    it("renders correctly", () => {
      const { getByTestId } = render(<EditProfilePage />);
  
      // Avatar, Inputs, and Button are displayed
      expect(getByTestId('avatar')).toBeTruthy();
      expect(getByTestId('username-input')).toBeTruthy();
      expect(getByTestId('favorite-verse-input')).toBeTruthy();
      expect(getByTestId('church-input')).toBeTruthy();
      expect(getByTestId('save-changes-button')).toBeTruthy();
    });
  
    it("has correct placeholder text", () => {
      const { getByPlaceholderText } = render(<EditProfilePage />);
    
      // Inputs have correct placeholder text
      expect(getByPlaceholderText('Username')).toBeTruthy();
      expect(getByPlaceholderText('Favorite Verse')).toBeTruthy();
      expect(getByPlaceholderText('Church')).toBeTruthy();
    });
  
    it("allows click on save changes button", async () => {
      const { getByTestId } = render(<EditProfilePage />);
      const saveChangesButton = getByTestId('save-changes-button');
    
      // Simulate a button press
      await fireEvent.press(saveChangesButton);
    });
  });

