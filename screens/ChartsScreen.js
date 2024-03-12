import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
  Switch,
  SafeAreaView,
} from "react-native";

import LoadingOverlay from "../components/ui/LoadingOverlay";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../store/auth-context";
import { GetUsersRequest } from "../api/GetUsersRequest";
import i18n from "../translations/i18n";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  calculateDuration,
  getMonthFromDate,
  calculateDays,
  getYearFromDate,
  filterYearlyData,
  getCountriesByYear,
  getDevicesByYear,
} from "../util/dates";

function ChartsScreen() {
  const [mode, setMode] = useState("");
  const authCtx = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthData, setMonthData] = useState({});
  const [locale, setLocale] = useState(authCtx.currentLocale.toLowerCase());
  const [selectedYear, setSelectedYear] = useState();
  const [years, setYears] = useState([]);
  const [devices, setDevices] = useState({});
  const [devicesByYear, setDevicesByYear] = useState([]);
  const [allDevices, setAllDevices] = useState(false);
  const [yearlyData, setYearlyData] = useState({});
  const [countries, setCountries] = useState({});
  const [countriesByYear, setCountriesByYear] = useState([]);
  const [allYears, setAllYears] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);

  useEffect(() => {
    setLocale(authCtx.currentLocale.toLowerCase());
  }, [authCtx.currentLocale]);

  i18n.locale = locale;

  useEffect(() => {
    setMode(authCtx.currentMode);
  }, [authCtx.currentMode]);

  // useEffect(() => {
  //   getUsers();
  //   const years = Array.from(new Array(20), (val, index) => index + 2023);
  //   setYears(years);

  //   const currentYear = new Date().getFullYear();
  //   setSelectedYear(currentYear);
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await getUsers();
          const years = Array.from(new Array(20), (val, index) => index + 2023);
          setYears(years);

          const currentYear = new Date().getFullYear();
          setSelectedYear(currentYear);
        } catch (error) {
          authCtx.logout();
          console.error("Error retrieving users: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const toggleSwitch = () => {
    setAllYears((previousState) => !previousState);
    setIsEnabled((previousState) => !previousState);
  };

  const toggleSwitch2 = () => {
    setAllDevices((previousState) => !previousState);
    setIsEnabled2((previousState) => !previousState);
  };

  function getRandomColor() {
    const randomComponent = () => Math.floor(Math.random() * 256);

    return `rgba(${randomComponent()}, ${randomComponent()}, ${randomComponent()}, 1)`;
  }

  const getUsers = async () => {
    try {
      let response = await GetUsersRequest(authCtx.token);

      if (response == 401) {
        authCtx.logout();
        console.log("unauthorized");
      } else {
        setUsers(
          response.users.map((user) => ({
            ...user,
            duration: calculateDuration(user.arrival, user.departure),
          }))
        );

        //pie chart data
        const androidCount = response.users.filter(
          (user) => user.device === "android" && user.role === "visitor"
        ).length;
        const iosCount = response.users.filter(
          (user) => user.device === "ios" && user.role === "visitor"
        ).length;
        const unknowCount = response.users.filter(
          (user) =>
            user.device != "ios" &&
            user.device != "android" &&
            user.role === "visitor"
        ).length;

        const devices = [
          {
            name: "android",
            count: androidCount,
            color: "rgba(0, 105, 146, 1)",
            legendFontColor: "#7F7F7F",
          },
          {
            name: "ios",
            count: iosCount,
            color: "rgba(144, 238, 144, 0.8)",
            legendFontColor: "#7F7F7F",
          },
          {
            name: "N/A",
            count: unknowCount,
            color: "rgba(255, 252, 127, 1)",
            legendFontColor: "#7F7F7F",
          },
        ];

        setDevices(devices);

        const yearlyDeviceCounts = getDevicesByYear(response.users);
        const deviceCounts = {};
        const devicesByYear = Object.entries(yearlyDeviceCounts).map(
          ([year, deviceCounts]) => ({
            year: parseInt(year),
            devices: Object.entries(deviceCounts).map(([device, count]) => ({
              name: device == "null" ? "N/A" : device,
              count: count,
              color: getRandomColor(),
              legendFontColor: "#7F7F7F",
            })),
          })
        );

        //console.log(JSON.stringify(devicesByYear));
        setDevicesByYear(devicesByYear);

        const countriesArray = response.users.map((user) => user.country);

        const countryCounts = {};

        countriesArray.forEach((country) => {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        const countries = Object.entries(countryCounts).map(
          ([country, count]) => ({
            name:
              country == "null" || country == "" || country == "undefined"
                ? "N/A"
                : country,
            count: count,
            color: getRandomColor(),
            legendFontColor: "#7F7F7F",
          })
        );

        setCountries(countries);

        const yearlyCountryCounts = getCountriesByYear(response.users);

        const countriesByYear = Object.entries(yearlyCountryCounts).map(
          ([year, countryCounts]) => ({
            year: parseInt(year),
            countries: Object.entries(countryCounts).map(
              ([country, count]) => ({
                name:
                  country == "null" || country == "" || country == "undefined"
                    ? "N/A"
                    : country,
                count: count,
                color: getRandomColor(),
                legendFontColor: "#7F7F7F",
              })
            ),
          })
        );

        setCountriesByYear(countriesByYear);

        // console.log(JSON.stringify(countriesByYear));

        //line chart data
        const yearlyData = {};

        response.users.forEach((user) => {
          if (user.role === "visitor") {
            const arrivalMonth = getMonthFromDate(user.arrival);
            const arrivalYear = getYearFromDate(user.arrival);

            if (!yearlyData[arrivalYear]) {
              yearlyData[arrivalYear] = {
                [4]: { count: 0, totalDays: 0 },
                [5]: { count: 0, totalDays: 0 },
                [6]: { count: 0, totalDays: 0 },
                [7]: { count: 0, totalDays: 0 },
                [8]: { count: 0, totalDays: 0 },
                [9]: { count: 0, totalDays: 0 },
              };
            }

            if ([4, 5, 6, 7, 8, 9].includes(arrivalMonth)) {
              yearlyData[arrivalYear][arrivalMonth].count += 1;
              yearlyData[arrivalYear][arrivalMonth].totalDays += calculateDays(
                user.arrival,
                user.departure,
                arrivalMonth
              );
            }
            

            //scenario where arrival and departure are in different months, for example 28 May - 5 Jun
            const departureMonth = getMonthFromDate(user.departure);
            if (
              [4, 5, 6, 7, 8, 9].includes(departureMonth) &&
              departureMonth !== arrivalMonth
            ) {
              yearlyData[arrivalYear][departureMonth].count += 1;

              const firstDayDepartureMonth = new Date(
                arrivalYear,
                departureMonth,
                1
              );
              yearlyData[arrivalYear][departureMonth].totalDays +=
                calculateDays(
                  firstDayDepartureMonth,
                  user.departure,
                  departureMonth
                );
            }
          }
        });

        setYearlyData(yearlyData);

        //console.log(`yearlyData: ${JSON.stringify(yearlyData)}`);

        setIsLoading(false);
      }
    } catch (error) {
      authCtx.logout();
      console.log("error retrieving users: ", error);
    }
  };

  const filteredMonthlyDataArray = filterYearlyData(yearlyData, selectedYear);

  const totalDaysArray =
    filteredMonthlyDataArray.length > 0
      ? filteredMonthlyDataArray.map((item) => item.totalDays)
      : [0, 0, 0, 0, 0, 0, 0];
  const countArray =
    filteredMonthlyDataArray.length > 0
      ? filteredMonthlyDataArray.map((item) => item.count)
      : [0, 0, 0, 0, 0, 0, 0];

  const countriesData = !allYears
    ? countriesByYear.find((entry) => entry.year === selectedYear)?.countries ||
      []
    : countries;

  const devicesData = !allDevices
    ? devicesByYear.find((entry) => entry.year === selectedYear)?.devices || []
    : devices;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "#FFFAFA" : "#121212" },
      ]}
    >
      {isLoading && (
        <LoadingOverlay
          backgroundColor={mode === "light" ? "#FFFAFA" : "#121212"}
        />
      )}

      {!isLoading && (
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={{
            color: mode === "light" ? "black" : "white",
          }}
          dropdownIconColor={mode === "light" ? "black" : "white"}
          itemStyle={{
            fontSize: 18,
            fontFamily: "poppins",
            color: mode === "light" ? "black" : "white",
          }}
          selectionColor={'mode === "light" ? "#A9A0A01A" : "#000001A"'}
        >
          {years.map((year) => (
            <Picker.Item
              key={year}
              label={year.toString()}
              value={year}
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
          ))}
        </Picker>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isLoading && (
          <View style={styles.chart}>
            <LineChart
              data={{
                labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                datasets: [
                  {
                    data: totalDaysArray,
                  },
                ],
                legend: [
                  `${i18n.t("charts.visitors_per_month")} (${selectedYear})`,
                ],
              }}
              width={Dimensions.get("window").width / 1.05}
              height={220}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                backgroundGradientFromOpacity: mode == "light" ? 1 : 0.8,
                backgroundGradientToOpacity: mode == "light" ? 1 : 0.3,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "7",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        )}

        {!isLoading && (
          <View style={styles.chart}>
            <LineChart
              fromZero={true}
              data={{
                labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                datasets: [
                  {
                    data: countArray,
                  },
                ],
                legend: [
                  `${i18n.t(
                    "charts.booking_number_per_month"
                  )} (${selectedYear})`,
                ],
              }}
              width={Dimensions.get("window").width / 1.05}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: "#4169E1",
                backgroundGradientFrom: "#325fe6",
                backgroundGradientTo: "#2158fc",
                backgroundGradientFromOpacity: mode == "light" ? 1 : 0.8,
                backgroundGradientToOpacity: mode == "light" ? 1 : 0.3,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "7",
                  strokeWidth: "2",
                  stroke: "#4169E1",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        )}

        {!isLoading && (
          <View style={styles.formInputs}>
            <View
              style={[
                styles.detailContainer,
                {
                  backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                },
              ]}
            >
              <Text
                style={[
                  styles.chartTitle,
                  {
                    color: mode === "light" ? "#121212" : "#FFFAFA",
                  },
                ]}
              >
                {i18n.t("charts.devices")}
                {!allDevices
                  ? ` (${selectedYear})`
                  : ` ${i18n.t("charts.all_years")}`}
              </Text>
              <View style={styles.switch}>
                <Image
                  source={require("../assets/images/venn1.png")}
                  style={styles.image}
                />
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch2}
                  value={isEnabled2}
                  style={styles.toggleSwitch}
                />
                <Image
                  source={require("../assets/images/venn2.png")}
                  style={styles.image}
                />
              </View>
              {devicesData.length == 0 && (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="database-off"
                    size={85}
                    color={mode === "light" ? "#121212" : "#FFFAFA"}
                    borderRadius="55"
                  />
                  <Text
                    style={[
                      styles.chartTitle,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    {" "}
                    {i18n.t("charts.noData")}
                  </Text>
                </View>
              )}

              {devicesData.length > 0 && (
                <PieChart
                  data={devicesData}
                  width={Dimensions.get("window").width / 1.05}
                  height={220}
                  chartConfig={{
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "7",
                      strokeWidth: "2",
                      stroke: "#4169E1",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor={"count"}
                  backgroundColor={"transparent"}
                  center={[25, 10]}
                />
              )}
            </View>
          </View>
        )}

        {!isLoading && (
          <View style={styles.formInputs}>
            <View
              style={[
                styles.detailContainer,
                {
                  backgroundColor: mode === "light" ? "#FFFAFA" : "#352A2A",
                },
              ]}
            >
              <Text
                style={[
                  styles.chartTitle,
                  {
                    color: mode === "light" ? "#121212" : "#FFFAFA",
                  },
                ]}
              >
                {i18n.t("charts.countries")}{" "}
                {!allYears ? `(${selectedYear})` : i18n.t("charts.all_years")}
              </Text>

              <View style={styles.switch}>
                <Image
                  source={require("../assets/images/venn1.png")}
                  style={styles.image}
                />
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={styles.toggleSwitch}
                />
                <Image
                  source={require("../assets/images/venn2.png")}
                  style={styles.image}
                />
              </View>
              {countriesData.length == 0 && (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="database-off"
                    size={85}
                    color={mode === "light" ? "#121212" : "#FFFAFA"}
                    borderRadius="85"
                  />
                  <Text
                    style={[
                      styles.chartTitle,
                      {
                        color: mode === "light" ? "#121212" : "#FFFAFA",
                      },
                    ]}
                  >
                    {" "}
                    {i18n.t("charts.noData")}
                  </Text>
                </View>
              )}

              {countriesData.length > 0 && (
                <PieChart
                  data={countriesData}
                  width={Dimensions.get("window").width / 1.05}
                  height={220}
                  chartConfig={{
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "7",
                      strokeWidth: "2",
                      stroke: "#4169E1",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor={"count"}
                  backgroundColor={"transparent"}
                  center={[25, 10]}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChartsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAFA",
  },
  chartTitle: {
    fontFamily: "poppins",
    fontSize: 21,
    padding: 5,
  },
  chart: {
    margin: 10,
  },
  formInputs: {
    borderColor: "#D3D3D3",
    marginHorizontal: 10,
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
  image: {
    zIndex: 99,
    width: 80,
    height: 40,
  },
  switch: {
    flexDirection: "row",
    backgroundColor: "lightblue",
    padding: 11,
    borderRadius: 12,
    marginBottom: 5,
  },
  toggleSwitch: {
    margin: Platform.OS === "ios" ? 5 : 0,
  },
  empty: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
