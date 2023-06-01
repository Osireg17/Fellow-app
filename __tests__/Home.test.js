import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the MainFeed component
import MainFeed from '../screens/Home';

// Mocking the firebase functions
jest.mock("../config/firebase", () => ({
  database: {
    user: jest.fn(),
  },
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: {
      uid: '123', // you can mock it with any user id.
    },
  }),
}));

const Stack = createStackNavigator();

describe("<MainFeed />", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainFeed">
          <Stack.Screen name="MainFeed" component={MainFeed} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Home')).toBeDefined();
  });

  it("navigates to Profile on profile button press", () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<MainFeed navigation={navigation} />);

    fireEvent.press(getByText("Profile"));
    expect(navigation.navigate).toHaveBeenCalledWith("Profile");
  });
});
