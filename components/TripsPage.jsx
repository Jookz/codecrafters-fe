import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import { getUserTrips } from "../utils/users_api";
import { getFlagCountryByName } from "../utils/countries_api";
import { colors } from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function TripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [flags, setFlags] = useState([]);
  const { userState } = useContext(UserContext);
  const user = userState[0];
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      getUserTrips(user.user_id)
        .then((tripsData) => {
          setTrips(tripsData);
          return tripsData;
        })
        .then((tripsData) => {
          const promiseArray = tripsData.map((trip) => {
            return getFlagCountryByName(trip.country);
          });
          return Promise.all(promiseArray);
        })
        .then((flagData) => {
          setFlags(flagData);
        })
        .catch((err) => console.log(err));
  }, [isFocused]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Your Trips</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("AddTrip", { setTrips, setFlags })}
        >
          <Feather name="plus" size={24} color={colors.white} />
        </Pressable>

        {trips.map((trip, index) => {
          const { country, trip_id, location, start_date, end_date } = trip;
          const formattedStartDate = new Date(start_date).toLocaleDateString(
            "en-GB"
          );
          const formattedEndDate = new Date(end_date).toLocaleDateString(
            "en-GB"
          );
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EventsFeed", {
                  tripInfo: { country, start_date, end_date },
                });
              }}
              style={styles.tripCard}
              key={trip_id}
            >
              <Image source={{ uri: flags[index] }} style={styles.flag} />
              <View style={styles.tripInfo}>
                <View style={styles.textWithHeading}>
                  <Text style={styles.heading}>Country: </Text>
                  <Text style={styles.text}>{country}</Text>
                </View>
                <View style={styles.textWithHeading}>
                  <Text style={styles.heading}>City: </Text>
                  <Text style={styles.text}>{location}</Text>
                </View>
                <View style={styles.textWithHeading}>
                  <Text style={styles.heading}>Start: </Text>
                  <Text style={styles.text}>{formattedStartDate}</Text>
                </View>
                <View style={styles.textWithHeading}>
                  <Text style={styles.heading}>End: </Text>
                  <Text style={styles.text}>{formattedEndDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  },
  header: {
    fontFamily: "poppins_bold",
    fontSize: 22,
    color: `${colors.orange}`,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: `${colors.white}`,
  },
  tripCard: {
    flexDirection: "row",
    width: "90%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: `${colors.white}`,
    shadowColor: "#219C90",
    shadowOffset: {
      width: 50,
      height: 12,
    },
    shadowOpacity: 5,
    shadowRadius: 13,
    elevation: 24,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  tripInfo: {
    paddingLeft: 10,
    fontFamily: "poppins_bold",
  },
  flag: {
    width: 80,
    height: 60,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: "black",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  heading: {
    fontFamily: "poppins_bold",
    color: colors.primary,
    fontSize: 12,
    alignSelf: "center",
    textAlign: "center",
  },
  textWithHeading: {
    flexDirection: "row",
  },
  text: {
    fontFamily: "regular",
    color: `${colors.black}`,
    flexWrap: "wrap",
    fontSize: 12,
    fontStyle: "normal",
  },
});
