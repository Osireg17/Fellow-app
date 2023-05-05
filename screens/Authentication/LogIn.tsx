import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import * as AppleAuthentication from 'expo-apple-authentication';
import { database } from "../../config/firebase";

import { styles } from "../../styles/Authentication/LogIn.style";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (email === "") {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (password === "") {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const onHandleLogin = () => {
    if (validateFields()) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login Success");
          navigation.navigate("Feeds");
          navigation.reset({
            index: 0,
            routes: [{ name: "Feeds" }],
          })
        })
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrowContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.loginWrapper}>
        <Text style={styles.loginTitle}>Login</Text>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Email Address"
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        {emailError && <Text style={styles.errorText}>Please enter your email.</Text>}
        <TextInput
          style={[styles.input, passwordError ? styles.errorInput : null]}
          placeholder="Password"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        {passwordError && <Text style={styles.errorText}>Please enter your password.</Text>}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={onHandleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        <TouchableOpacity style={styles.appleButton}>
          <AntDesign name="apple1" size={24} color="#fff" />
          <Text style={styles.appleButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <AntDesign name="google" size={24} color="#fff" />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.registerTextContainer}
        onPress={() => navigation.navigate("SignUp")}
        >
      <Text style={styles.registerText}>Register an account</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
