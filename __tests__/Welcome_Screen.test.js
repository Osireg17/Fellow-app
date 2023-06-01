import React from "react";
import Welcome_Screen from "../screens/Welcome_Screen";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => jest.fn(),
    };
}
);

const Stack = createStackNavigator();

describe("<Welcome_Screen />", () => {
    it("renders correctly", () => {
      const { getByText } = 
        render(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Welcome_Screen" component={Welcome_Screen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
      expect(getByText('Welcome to Fellow')).toBeDefined();
      expect(getByText('Log In')).toBeDefined();
      expect(getByText('Sign Up')).toBeDefined();
    });
  
    it("navigates on button press", () => {
      const navigation = { navigate: jest.fn() };
      const { getByText } = render(<Welcome_Screen navigation={navigation} />);
  
      fireEvent.press(getByText("Log In"));
      expect(navigation.navigate).toHaveBeenCalledWith("Login");
  
      fireEvent.press(getByText("Sign Up"));
      expect(navigation.navigate).toHaveBeenCalledWith("SignUp");
    });
  });


