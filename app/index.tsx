import { Text, View, ActivityIndicator } from "react-native";
import Login from './../components/Login'
import { Redirect } from "expo-router";
import { Colors } from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {user ? <Redirect href="/mytrip" /> : <Login />}
    </View>
  );
}
