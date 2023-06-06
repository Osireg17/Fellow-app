import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Settings from "../../screens/Profile/Settings";

describe("<Settings />", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Settings />);
    // Test that the settings view, the title, and the logout button are displayed.
    expect(getByTestId('settings-view')).toBeTruthy();
    expect(getByTestId('settings-title')).toBeTruthy();
    expect(getByTestId('logout-button')).toBeTruthy();
  });

  it("allows clicking on the logout button", () => {
    const { getByTestId } = render(<Settings />);
    const logoutButton = getByTestId('logout-button');
  
    // Simulate a button press.
    fireEvent.press(logoutButton);
  });
});
