import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import i18n from "../translations/i18n";
import { DataTable, ThemeProvider } from "react-native-paper";
import { AuthContext } from "../store/auth-context";
import { GetUsersRequest } from "../api/GetUsersRequest";
import { availabilityRequest } from "../api/AvailabilityRequest";
import { GetBookingRequest } from "../api/GetBookingRequest";
import LoadingOverlay from "./ui/LoadingOverlay";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  getMonthFromDate,
  getDayFromDate,
  getYearFromDate,
} from "../util/dates";
import { Input, Button } from "react-native-elements";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { DeleteBookingRequest } from "../api/DeleteBookingRequest";
import { DeleteMarkerRequest } from "../api/DeleteMarker";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Calendar } from "react-native-calendars";
import { MarkersRequest } from "../api/MarkersRequest";
import MapView, { Marker, Cluster, Callout } from "react-native-maps";
import MapV from "react-native-map-clustering";

function AdminComponent() {
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageBookingRequest, setPageBookingRequest] = useState(0);
  const [pageMarker, setPageMarker] = useState(0);
  const itemsPerPage = 5;
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("ascending");
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const [filterMarkerInput, setFilterMarkerInput] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const navigation = useNavigation();
  const [disabledDates, setDisabledDates] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [filterPickerVisible, setFilterPickerVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isMarkerDelete, setIsMarkerDelete] = useState(false);
  const [pins, setPins] = useState([]);
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;

  useFocusEffect(
    React.useCallback(() => {
      const getUsers = async () => {
        try {
          const response = await GetUsersRequest(authCtx.token);

          if (response === 401) {
            authCtx.logout();
            console.log("unauthorized");
          } else {
            setUsers(response.users);
            setFilteredUsers(response.users);
          }
        } catch (error) {
          authCtx.logout();
          console.error("Error retrieving users: ", error);
        } finally {
        }
      };

      const getAvailability = async () => {
        try {
          const response = await availabilityRequest();

          if (!!response) {
            let res = response.disabledDates;
            const datesArray = res.map((item) => new Date(item.date));

            setDisabledDates(datesArray);
          }
        } catch (error) {
          authCtx.logout();
          console.log("Error retrieving availability: ", error);
        } finally {
        }
      };

      const getBookingRequests = async () => {
        try {
          setIsLoading(true);
          const response = await GetBookingRequest(authCtx.token);

          if (response === 401) {
            authCtx.logout();
            console.log("unauthorized");
          } else {
            setBookingRequests(response);
          }
        } catch (error) {
          authCtx.logout();
          console.log("Error retrieving booking requests: ", error);
        } finally {
        }
      };

      const getMarkers = async () => {
        try {
          setIsLoading(true);
          const response = await MarkersRequest();

          let markers = response.markers.map((item, index) => ({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            title: item.title,
            type: item.type,
            icon: item.icon,
            keyWords: item.keyWords,
          }));

          setPins(markers);
        } catch (error) {
          authCtx.logout();
          console.log("error retrieving markers: ", error);
        } finally {
        }
      };

      // getUsers();
      // getBookingRequests();
      // getAvailability();
      // getMarkers();
      setIsLoading(true);
      Promise.all([
        getUsers(),
        getBookingRequests(),
        getAvailability(),
        getMarkers(),
      ]).then(() => {
        setIsLoading(false);
      });
      setFilterInput("");
      setFilterField("name");
      setFilterMarkerInput("");
    }, [])
  );

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  const sortDates = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const keyA = a[sortColumn].toLowerCase();
      const keyB = b[sortColumn].toLowerCase();

      if (keyA < keyB) return sortDirection === "ascending" ? -1 : 1;
      if (keyA > keyB) return sortDirection === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  const handleFilterChange = (text) => {
    setFilterInput(text);
  };

  const filterUsers = () => {
    const filtered = users.filter((user) =>
      user[filterField].toLowerCase().includes(filterInput.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  };

  const filterMarkers = () => {
    const filtered = pins.filter((marker) =>
      marker["type"].toLowerCase().includes(filterMarkerInput.toLowerCase())
    );
    setFilteredMarkers(filtered);
    setPageMarker(0);
  };

  useEffect(() => {
    filterUsers();
  }, [filterInput]);

  useEffect(() => {
    filterMarkers();
  }, [filterMarkerInput]);

  useEffect(() => {
    sortDates();
  }, [sortColumn, sortDirection]);

  const paginatedUsers = filteredUsers.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const paginatedBookingRequests =
    bookingRequests.length > 0
      ? bookingRequests.slice(
          pageBookingRequest * itemsPerPage,
          (pageBookingRequest + 1) * itemsPerPage
        )
      : [];

  const paginatedMarkers =
    filteredMarkers.length > 0
      ? filteredMarkers.slice(
          pageMarker * itemsPerPage,
          (pageMarker + 1) * itemsPerPage
        )
      : pins.slice(pageMarker * itemsPerPage, (pageMarker + 1) * itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
  };
  const handlePageChange2 = (selectedPage) => {
    setPageBookingRequest(selectedPage);
  };

  const handlePageChange3 = (selectedPage) => {
    setPageMarker(selectedPage);
  };

  const clearInput = () => {
    setFilterInput("");
  };

  const getPLaceHolder = () => {
    return `Search by ${filterField}`;
  };

  const INITIAL_REGION = {
    latitude: 35.26335507678177,
    longitude: 25.238502809890747,
    latitudeDelta: 0.6,
    longitudeDelta: 0.6,
  };

  const disabledDatesArray = disabledDates || [];

  const markedDatesObject = disabledDatesArray.reduce((acc, date) => {
    const formattedDate = date.toISOString().split("T")[0];
    acc[formattedDate] = {
      disabled: true,
      disableTouchEvent: true,
      selectedColor: "#3498db",
    };
    return acc;
  }, {});

  const deleteButton = (id) => {
    setIsDelete(true);
    const updatedBookingRequests = [...bookingRequests];
    const indexToDelete = updatedBookingRequests.findIndex(
      (request) => request.id === id
    );

    if (indexToDelete !== -1) {
      updatedBookingRequests.splice(indexToDelete, 1);
      setBookingRequests(updatedBookingRequests);
      deleteRequest(id);
    }
  };

  const removeMarker = (id) => {
    setIsMarkerDelete(true);
    console.log(`Id to delete is ${id}`);
    const updatedMarkers = [...filteredMarkers];

    const indexToDelete = updatedMarkers.findIndex(
      (request) => request.id === id
    );

    if (indexToDelete !== -1) {
      updatedMarkers.splice(indexToDelete, 1);
      setFilteredMarkers(updatedMarkers);
    }

    deleteMarker(id);
  };

  const deleteRequest = async (id) => {
    try {
      let response = await DeleteBookingRequest(id, authCtx.token);

      if (response == 200) {
        setPageBookingRequest(0);
        setIsDelete(false);
        showMessage({
          message: "Booking Request has been deleted successfully",
          type: "success",
          icon: (props) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="white"
              style={styles.flash}
            />
          ),
        });
      } else {
        showMessage({
          message: "Error deleting booking request, please try again later",
          type: "danger",
          icon: (props) => (
            <MaterialIcons
              name="error"
              size={18}
              color="white"
              style={styles.flash}
            />
          ),
        });
      }
    } catch (error) {}
  };

  const deleteMarker = async (id) => {
    try {
      let response = await DeleteMarkerRequest(id, authCtx.token);

      if (response == 200) {
        setPageMarker(0);
        setIsMarkerDelete(false);
        showMessage({
          message: "Marker has been deleted successfully",
          type: "success",
          icon: (props) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="white"
              style={styles.flash}
            />
          ),
        });
      } else {
        showMessage({
          message: "Error deleting marker, please try again later",
          type: "danger",
          icon: (props) => (
            <MaterialIcons
              name="error"
              size={18}
              color="white"
              style={styles.flash}
            />
          ),
        });
      }
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: mode === "light" ? "#FFFAFA" : "#121212",
        },
      ]}
    >
      {isLoading && (
        <LoadingOverlay
          backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
        />
      )}

      <SafeAreaView>
        {!isLoading && (
          <React.Fragment>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View></View>
              {/* USERS TABLE */}
              <View
                style={[
                  styles.container2,
                  { backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A" },
                ]}
              >
                <DataTable
                  style={[
                    styles.table,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      { color: mode === "light" ? "#121212" : "#FFFAFA" },
                    ]}
                  >
                    {i18n.t("admin.users_table")}
                  </Text>
                  <Input
                    placeholder={getPLaceHolder()}
                    maxLength={20}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={filterInput}
                    leftIcon={
                      <Ionicons name="search" size={23} color={"#3498db"} />
                    }
                    rightIcon={
                      <View>
                        {filterInput.length > 0 && (
                          <Ionicons
                            name="close"
                            size={23}
                            color={"red"}
                            onPress={clearInput}
                          />
                        )}

                        {filterInput.length == 0 && !filterPickerVisible && (
                          <Ionicons
                            name="caret-down-outline"
                            size={23}
                            color={"#3498db"}
                            onPress={() =>
                              setFilterPickerVisible(!filterPickerVisible)
                            }
                          />
                        )}

                        {filterInput.length == 0 && filterPickerVisible && (
                          <Ionicons
                            name="caret-up-outline"
                            size={23}
                            color={"#3498db"}
                            onPress={() =>
                              setFilterPickerVisible(!filterPickerVisible)
                            }
                          />
                        )}
                      </View>
                    }
                    leftIconContainerStyle={styles.icon}
                    rightIconContainerStyle={[styles.rightIcon]}
                    onChangeText={handleFilterChange}
                    inputContainerStyle={styles.searchBar}
                    style={[
                      styles.input,
                      { color: mode === "light" ? "#121212" : "#FFFAFA" },
                    ]}
                  />
                  {filterPickerVisible && filterInput.length == 0 && (
                    <Picker
                      style={[
                        styles.picker,
                        { color: mode === "light" ? "black" : "white" },
                      ]}
                      selectedValue={filterField}
                      onValueChange={(itemValue) => {
                        setFilterField(itemValue);
                      }}
                      selectionColor={
                        'mode === "light" ? "#A9A0A01A" : "#000001A"'
                      }
                      dropdownIconColor={mode === "light" ? "black" : "white"}
                    >
                      <Picker.Item
                        label="Name"
                        value="name"
                        color={
                          mode === "light"
                            ? "#121212"
                            : Platform.OS === "android"
                            ? "black"
                            : Platform.OS === "ios"
                            ? "white"
                            : "#FFFAFA"
                        }
                      />
                      <Picker.Item
                        label="Country"
                        value="country"
                        color={
                          mode === "light"
                            ? "#121212"
                            : Platform.OS === "android"
                            ? "black"
                            : Platform.OS === "ios"
                            ? "white"
                            : "#FFFAFA"
                        }
                      />
                      <Picker.Item
                        label="Role"
                        value="role"
                        color={
                          mode === "light"
                            ? "#121212"
                            : Platform.OS === "android"
                            ? "black"
                            : Platform.OS === "ios"
                            ? "white"
                            : "#FFFAFA"
                        }
                      />
                    </Picker>
                  )}
                  <DataTable.Header backgroundColor="#4169E1">
                    <DataTable.Title
                      sortDirection={sortDirection}
                      textStyle={styles.header}
                      theme={{ colors: { text: "white", color: "white" } }}
                      onPress={() => {
                        setSortColumn("arrival");
                        setSortDirection(
                          sortDirection === "ascending"
                            ? "descending"
                            : "ascending"
                        );
                      }}
                    >
                      Arrival
                    </DataTable.Title>
                    <DataTable.Title textStyle={styles.header}>
                      Username
                    </DataTable.Title>

                    <DataTable.Title textStyle={styles.header}>
                      Country
                    </DataTable.Title>
                    <DataTable.Title textStyle={styles.header}>
                      Role
                    </DataTable.Title>
                  </DataTable.Header>
                  {paginatedUsers.map((user) => (
                    <DataTable.Row
                      key={user.id}
                      onPress={() => {
                        navigation.navigate("Edit User", { user });
                        Keyboard.dismiss();
                      }}
                    >
                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >{`${getDayFromDate(user.arrival)}/${
                        getMonthFromDate(user.arrival) + 1
                      }/${getYearFromDate(user.arrival)}`}</DataTable.Cell>
                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >
                        <Ionicons
                          name="radio-button-on-outline"
                          size={8}
                          borderRadius="55"
                          color={user.is_active ? "#4169E1" : "red"}
                        />
                        {user.name}
                      </DataTable.Cell>

                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >
                        {user.country.length > 0 ? user.country : "N/A"}
                      </DataTable.Cell>

                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >
                        {user.role}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>

                <View
                  style={[
                    styles.footer,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Button
                    buttonStyle={{ width: 150 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                      borderWidth: 2,
                      borderColor: "#00F",
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={
                      <Ionicons name="person-add" size={20} color="#FFFAFA" />
                    }
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => {
                      navigation.navigate("Add User");
                    }}
                    title="Add User"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                  />
                  <DataTable.Pagination
                    style={[
                      styles.page,
                      {
                        backgroundColor:
                          mode === "light" ? "#FFFAFA" : "#352A2A",
                      },
                    ]}
                    page={page}
                    numberOfPages={Math.ceil(
                      filteredUsers.length / itemsPerPage
                    )}
                    onPageChange={handlePageChange}
                    label={
                      <Text
                        style={{
                          color: mode === "light" ? "#121212" : "#FFFAFA",
                        }}
                      >
                        {page + 1} of{" "}
                        {Math.ceil(filteredUsers.length / itemsPerPage)}
                      </Text>
                    }
                  />
                </View>
              </View>

              {/* BOOKING REQUESTS */}
              {bookingRequests.length > 0 ? (
                <View
                  style={[
                    styles.container2,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <DataTable
                    style={[
                      styles.table,
                      {
                        backgroundColor:
                          mode === "light" ? "#FFFAFA" : "#352A2A",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.title,
                        { color: mode === "light" ? "#121212" : "#FFFAFA" },
                      ]}
                    >
                      {i18n.t("admin.booking_requests")}
                    </Text>
                    <DataTable.Header backgroundColor="#4169E1">
                      <DataTable.Title textStyle={styles.header}>
                        Name
                      </DataTable.Title>
                      <DataTable.Title textStyle={styles.header}>
                        Request Date
                      </DataTable.Title>

                      <DataTable.Title></DataTable.Title>
                    </DataTable.Header>

                    {paginatedBookingRequests.map((request) => (
                      <DataTable.Row
                        key={request.id}
                        onPress={() => {
                          navigation.navigate("Booking Request", { request });
                          Keyboard.dismiss();
                        }}
                      >
                        <DataTable.Cell
                          textStyle={[
                            styles.cell,
                            { color: mode === "light" ? "#121212" : "#FFFAFA" },
                          ]}
                        >
                          {request.name}
                        </DataTable.Cell>

                        <DataTable.Cell
                          textStyle={[
                            styles.cell,
                            { color: mode === "light" ? "#121212" : "#FFFAFA" },
                          ]}
                          style={styles.cell}
                        >
                          {request.request_date}
                        </DataTable.Cell>

                        <DataTable.Cell
                          textStyle={styles.cell}
                          style={styles.buttonCell}
                        >
                          <Button
                            disabled={isDelete}
                            buttonStyle={{
                              width: 36,
                              height: 36,
                              borderRadius: 50,
                              backgroundColor: "#DC143C",
                              marginTop: 3,
                            }}
                            linearGradientProps={null}
                            icon={
                              <Ionicons name="trash" size={20} color="white" />
                            }
                            iconContainerStyle={{ background: "#000" }}
                            loadingProps={{ animating: true }}
                            onPress={() => {
                              deleteButton(request.id);
                            }}
                          />
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>

                  <View>
                    <View
                      style={[
                        styles.footer2,
                        {
                          backgroundColor:
                            mode === "light" ? "#FFFAFA" : "#352A2A",
                        },
                      ]}
                    >
                      <DataTable.Pagination
                        style={styles.pageBookingRequest}
                        page={pageBookingRequest}
                        numberOfPages={Math.ceil(
                          bookingRequests.length / itemsPerPage
                        )}
                        onPageChange={handlePageChange2}
                        // label={`${pageBookingRequest + 1} of ${Math.ceil(
                        //   bookingRequests.length / itemsPerPage
                        // )}`}

                        label={
                          <Text
                            style={{
                              color: mode === "light" ? "#121212" : "#FFFAFA",
                            }}
                          >
                            {pageBookingRequest + 1} of{" "}
                            {Math.ceil(bookingRequests.length / itemsPerPage)}
                          </Text>
                        }
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={[
                    styles.empty,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    {i18n.t("admin.booking_requests")}
                  </Text>

                  <MaterialCommunityIcons
                    name="database-off"
                    size={85}
                    borderRadius="55"
                    color={mode === "light" ? "#121212" : "#FFFAFA"}
                  />
                  <Text
                    style={[
                      styles.title,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    {i18n.t("charts.noData")}
                  </Text>
                </View>
              )}
              {/* AVAILABILITY */}
              {disabledDates.length > 0 ? (
                <View
                  style={[
                    styles.availability,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      { color: mode === "light" ? "#121212" : "#FFFAFA" },
                    ]}
                  >
                    {i18n.t("admin.availability")}
                  </Text>
                  <Calendar
                    hideExtraDays={true}
                    style={[
                      styles.calendar,
                      { backgroundColor: "transparent" },
                    ]}
                    theme={{
                      calendarBackground: "transparent",
                    }}
                    markedDates={markedDatesObject}
                  />
                  <Button
                    buttonStyle={{ width: 250 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                      borderWidth: 2,
                      borderColor: "#00F",
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={
                      <MaterialCommunityIcons
                        name="calendar-edit"
                        size={20}
                        color="#FFFAFA"
                      />
                    }
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => {
                      navigation.navigate("Availability", {
                        markedDatesObject,
                      });
                    }}
                    title="Edit Availability"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.empty,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    Availability
                  </Text>

                  <MaterialCommunityIcons
                    name="database-off"
                    size={85}
                    borderRadius="55"
                    color={mode === "light" ? "#121212" : "#FFFAFA"}
                  />
                  <Text
                    style={[
                      styles.title,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    No data found{" "}
                  </Text>
                  <Button
                    buttonStyle={{ width: 250 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                      borderWidth: 2,
                      borderColor: "#00F",
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={
                      <MaterialCommunityIcons
                        name="calendar-plus"
                        size={20}
                        color="#FFFAFA"
                      />
                    }
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => {
                      navigation.navigate("Availability", {
                        markedDatesObject,
                      });
                    }}
                    title="Edit Availability"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                  />
                </View>
              )}

              {/* MARKERS */}
              <View
                style={[
                  styles.markers,
                  { backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A" },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { color: mode === "light" ? "#121212" : "#FFFAFA" },
                  ]}
                >
                  {i18n.t("admin.locations")}
                </Text>

                <DataTable
                  style={[
                    styles.table,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Picker
                    style={[
                      styles.picker,
                      { color: mode === "light" ? "black" : "white" },
                    ]}
                    dropdownIconColor={mode === "light" ? "black" : "white"}
                    selectionColor={
                      'mode === "light" ? "#A9A0A01A" : "#000001A"'
                    }
                    selectedValue={filterMarkerInput}
                    onValueChange={(itemValue) => {
                      setFilterMarkerInput(itemValue);
                    }}
                  >
                    <Picker.Item
                      label="All"
                      value=""
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Food"
                      value="food"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Bank"
                      value="bank"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Drink"
                      value="drink"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Beach"
                      value="beach"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Market"
                      value="market"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Health"
                      value="health"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Fast Food"
                      value="fastFood"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Activities"
                      value="activities"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Monuments"
                      value="monuments"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                    <Picker.Item
                      label="Gas Station"
                      value="gas_station"
                      color={
                        mode === "light"
                          ? "#121212"
                          : Platform.OS === "android"
                          ? "black"
                          : Platform.OS === "ios"
                          ? "white"
                          : "#FFFAFA"
                      }
                    />
                  </Picker>

                  <DataTable.Header backgroundColor="#4169E1">
                    <DataTable.Title textStyle={styles.header}>
                      Title
                    </DataTable.Title>
                    <DataTable.Title textStyle={styles.header}>
                      Type
                    </DataTable.Title>
                    <DataTable.Title></DataTable.Title>
                  </DataTable.Header>
                  {paginatedMarkers.map((marker) => (
                    <DataTable.Row key={marker.id}>
                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >
                        {marker.title}
                      </DataTable.Cell>

                      <DataTable.Cell
                        textStyle={[
                          styles.cell,
                          { color: mode === "light" ? "#121212" : "#FFFAFA" },
                        ]}
                      >
                        {marker.type}
                      </DataTable.Cell>
                      <DataTable.Cell
                        textStyle={styles.cell}
                        style={styles.buttonCell}
                      >
                        <Button
                          disabled={isMarkerDelete}
                          buttonStyle={{
                            width: 36,
                            height: 36,
                            borderRadius: 50,
                            backgroundColor: "#DC143C",
                            marginTop: 3,
                          }}
                          linearGradientProps={null}
                          icon={
                            <Ionicons name="trash" size={20} color="white" />
                          }
                          iconContainerStyle={{ background: "#000" }}
                          loadingProps={{ animating: true }}
                          onPress={() => {
                            removeMarker(marker.id);
                          }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
                <View
                  style={[
                    styles.footer,
                    {
                      backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                    },
                  ]}
                >
                  <Button
                    buttonStyle={{ width: 140 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                      borderWidth: 2,
                      borderColor: "#00F",
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={
                      <MaterialCommunityIcons
                        name="map-marker-plus"
                        size={20}
                        color="#FFFAFA"
                      />
                    }
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => {
                      navigation.navigate("Add Marker");
                    }}
                    title="Add Marker"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                  />
                  <DataTable.Pagination
                    style={[
                      styles.page,
                      {
                        backgroundColor:
                          mode === "light" ? "#FFFAFA" : "#352A2A",
                      },
                    ]}
                    page={pageMarker}
                    numberOfPages={Math.ceil(
                      filteredMarkers.length > 0
                        ? filteredMarkers.length / itemsPerPage
                        : pins.length / itemsPerPage
                    )}
                    onPageChange={handlePageChange3}
                    // label={`${pageMarker + 1} of ${Math.ceil(
                    //   filteredMarkers.length > 0
                    //     ? filteredMarkers.length / itemsPerPage
                    //     : pins.length / itemsPerPage
                    // )}`}

                    label={
                      <Text
                        style={{
                          color: mode === "light" ? "#121212" : "#FFFAFA",
                        }}
                      >
                        {pageMarker + 1} of{" "}
                        {Math.ceil(
                          filteredMarkers.length > 0
                            ? filteredMarkers.length / itemsPerPage
                            : pins.length / itemsPerPage
                        )}
                      </Text>
                    }
                  />
                </View>
                {Platform.OS === "android" && (
                  <MapV
                    initialRegion={INITIAL_REGION}
                    style={styles.map}
                    //provider={Platform.OS === "android" ? "google" : ""}
                    provider="google"
                    showsCompass={true}
                    showsTraffic={true}
                    showsBuildings={false}
                    showsIndoors={true}
                    zoomControlEnabled={false}
                    minZoomLevel={0}
                    maxZoomLevel={20}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    loadingEnabled={true}
                  >
                    {filteredMarkers.length > 0
                      ? filteredMarkers.map((marker) => (
                          <Marker
                            key={marker.id}
                            tracksViewChanges={false}
                            coordinate={{
                              latitude: marker.latitude,
                              longitude: marker.longitude,
                            }}
                            title={marker.title}
                          >
                            <Ionicons
                              name={marker.icon}
                              size={31}
                              color="#4169E1"
                            />
                            <Callout
                              // onPress={() => handleMarkerPress(marker.id)}
                              style={styles.markerPin}
                            >
                              <Text style={styles.pinText}>{marker.title}</Text>
                            </Callout>
                          </Marker>
                        ))
                      : pins.map((pin) => (
                          <Marker
                            key={pin.id}
                            tracksViewChanges={false}
                            coordinate={{
                              latitude: pin.latitude,
                              longitude: pin.longitude,
                            }}
                            title={pin.title}
                          >
                            <Ionicons
                              name={pin.icon}
                              size={31}
                              color="#4169E1"
                            />
                            <Callout
                              // onPress={() => handleMarkerPress(pin.id)}
                              style={styles.markerPin}
                            >
                              <Text style={styles.pinText}>{pin.title}</Text>
                            </Callout>
                          </Marker>
                        ))}
                  </MapV>
                )}

                {Platform.OS === "ios" && (
                  <MapV
                    initialRegion={INITIAL_REGION}
                    style={styles.map}
                    showsCompass={true}
                    showsTraffic={true}
                    showsBuildings={false}
                    showsIndoors={true}
                    zoomControlEnabled={false}
                    minZoomLevel={0}
                    maxZoomLevel={20}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    loadingEnabled={true}
                  >
                    {filteredMarkers.length > 0
                      ? filteredMarkers.map((marker) => (
                          <Marker
                            key={marker.id}
                            tracksViewChanges={false}
                            coordinate={{
                              latitude: marker.latitude,
                              longitude: marker.longitude,
                            }}
                            title={marker.title}
                          >
                            <Ionicons
                              name={marker.icon}
                              size={31}
                              color="#4169E1"
                            />
                            <Callout
                              // onPress={() => handleMarkerPress(marker.id)}
                              style={styles.markerPin}
                            >
                              <Text style={styles.pinText}>{marker.title}</Text>
                            </Callout>
                          </Marker>
                        ))
                      : pins.map((pin) => (
                          <Marker
                            key={pin.id}
                            tracksViewChanges={false}
                            coordinate={{
                              latitude: pin.latitude,
                              longitude: pin.longitude,
                            }}
                            title={pin.title}
                          >
                            <Ionicons
                              name={pin.icon}
                              size={31}
                              color="#4169E1"
                            />
                            <Callout
                              // onPress={() => handleMarkerPress(pin.id)}
                              style={styles.markerPin}
                            >
                              <Text style={styles.pinText}>{pin.title}</Text>
                            </Callout>
                          </Marker>
                        ))}
                  </MapV>
                )}
              </View>
            </ScrollView>
          </React.Fragment>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default AdminComponent;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 11,
  },
  cell: {
    fontFamily: "poppins",
    fontSize: 12,
    marginHorizontal: 4,
  },
  buttonCell: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontFamily: "poppinsBold",
    fontSize: 12,
    marginHorizontal: 4,
    color: "white",
  },
  table: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 16,
    fontFamily: "poppins",
    fontSize: 12,
  },
  page: {
    backgroundColor: "#FFFAFA",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: 21,
    padding: 0,
    margin: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFAFA",
    padding: 5,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  footer2: {
    backgroundColor: "#FFFAFA",
    padding: 5,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  input: {
    color: "#121212",
    borderBottomWidth: 0,
    width: "90%",
    fontFamily: "poppins",
    marginTop: 1,
  },
  requests: {
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "grey",
    paddingVertical: 15,
  },
  rightIcon: {
    borderColor: "gray",
    borderLeftWidth: 1,
    paddingHorizontal: 5,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column", // This makes the children Views align horizontally.
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#FFFAFA",
    margin: 5,
    marginBottom: 15,
  },
  calendar: {
    width: width / 1.3,
    borderRadius: 11,
    marginVertical: 5,
    padding: 5,
  },
  availability: {
    borderTopWidth: 0,
    borderColor: "grey",
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#FFFAFA",
    margin: 5,
    marginBottom: 15,
  },
  markers: {
    flexDirection: "column", // This makes the children Views align horizontally.
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#FFFAFA",
    margin: 5,
  },
  markerPin: {
    flex: 1,
    width: 70,
    textAlign: "center",
    justifyContent: "center",
  },
  pinText: {
    fontSize: 13,
    textAlign: "center",
    flex: 1,
    fontFamily: "poppins",
  },
  map: {
    minHeight: 250,
    minWidth: "100%",
  },

  picker: {
    flex: 1,
  },
  container2: {
    borderTopWidth: 0,
    borderColor: "grey",
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#FFFAFA",
    margin: 5,
    marginBottom: 15,
  },
  flash: {
    marginRight: 2,
  },
});
