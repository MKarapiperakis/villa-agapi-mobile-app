import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { Input, Button } from "react-native-elements";
import i18n from "../translations/i18n";
import { useNavigation } from "@react-navigation/native";

function PreviewBookingRequestScreen({ route, navigation }) {
  const { request } = route.params;
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [name, setName] = useState(request.name);
  const [comments, setComments] = useState(request.comments);
  const [email, setEmail] = useState(request.email);
  const [startDate, setStartDate] = useState(request.start_date);
  const [endDate, setEndDate] = useState(request.end_date);
  const [requestDate, setRequestDate] = useState(request.request_date);
  const [infoMessage, setInfoMessage] = useState(request.info_message);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  const nav = useNavigation();
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;
  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  useEffect(() => {
    nav.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: mode === "light" ? "#000000" : "#ffffff", // Text color
    });
  }, [nav, mode]);

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        },
      ]}
    >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formInputs}>
            <View
              style={[
                styles.detailContainer,
                {
                  backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                },
              ]}
            >
              {/* name */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={name}
                  label={i18n.t("admin.booking_request.full_name")}
                  disabled={true}
                />
              </View>

              {/* email */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={email}
                  label={i18n.t("admin.booking_request.email")}
                  disabled={true}
                />
              </View>

              {/* comments */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={comments}
                  label={i18n.t("admin.booking_request.comments")}
                  disabled={true}
                  multiline={true}
                />
              </View>

              {/* startDate */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={startDate}
                  label={i18n.t("admin.booking_request.from")}
                  disabled={true}
                />
              </View>

              {/* endDate */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={endDate}
                  label={i18n.t("admin.booking_request.to")}
                  disabled={true}
                />
              </View>

              {/* requestDate */}
              <View style={styles.row}>
                <Input
                  style={[
                    styles.input,
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(255, 255, 255, 1)",
                    },
                  ]}
                  labelStyle={[
                    {
                      color:
                        mode === "light" ? "#000000" : "rgba(245, 245, 245, 1)",
                    },
                  ]}
                  value={requestDate}
                  label={i18n.t("admin.booking_request.request_date")}
                  disabled={true}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default PreviewBookingRequestScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  detailContainer: {
    flexDirection: "column", // Change this line
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    padding: 25,
    margin: 10,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    marginHorizontal: 10,
    padding: 2,
  },
  input: {
    paddingHorizontal: 3,
    borderColor: "#1A1110",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "poppins",

    marginLeft: 2,

    borderBottomWidth: 0,
    width: "90%",
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
  },
  label2: {
    fontFamily: "poppins",
    fontSize: 21,
    padding: 0,
    margin: 10,
  },
  calendar: {
    width: width / 1.3,
    borderRadius: 11,
    marginVertical: 5,
    padding: 5,
  },
});
