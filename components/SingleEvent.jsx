import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import moment from "moment";
import { colors } from "../constants/colors";
import { Feather } from "@expo/vector-icons";
import { attendEvent, fetchAttending, saveEvent, fetchSavedEvents } from "../api";
import { UserContext } from "../contexts/UserContext";
import {getUserTrips} from "../utils/users_api";

export default function SingleEvent({ navigation, route }) {
  const { event } = route.params;
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [isAttendDisabled, setIsAttendDisabled] = useState(false);
  const [isSavedDisabled, setIsSavedDisabled] = useState(false);


const handleAttend= () => {
  attendEvent(event.event_id, user.user_id)
  .then((result) => {
    if(result.status === 201){
      navigation.goBack();
    }
  })
}

const handleSave = () => {
  saveEvent(event.event_id, user.user_id)
  .then((result) => {
    if(result.status === 201){
      navigation.goBack();
    }
  })
}

useEffect(() => {
  fetchAttending(user.user_id).then((result) => {
    result.map((fetchedEvent) => {
      if (fetchedEvent.event_id === event.event_id) {
        setIsAttendDisabled(true);
      }
    })
})},[])

useEffect(() => {
  fetchSavedEvents(user.user_id)
  .then(result => {
    result.data.eventsSaved.map((fetchedEvent) => {
      if (fetchedEvent.event_id === event.event_id) {
        setIsSavedDisabled(true);
      }
    })
  })
}, [])


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>{event.short_description}</Text>

        <Image src={event.event_picture} style={styles.eventImage} />
        <Text style={styles.text}>
          <Feather name="map-pin" size={18} color={colors.blue} padding={20} />
          {event.location}
        </Text>
        <Text style={styles.date}>
          {moment(event.date).format("dddd Do MMMM YYYY ")}
        </Text>
        <Text style={styles.date}>{moment(event.date).format("h:mm a")}</Text>
        <Text style={styles.body}>{event.description}</Text>

        <Text>Map:</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={ isAttendDisabled ? styles.disabled : styles.button}
          disabled={isAttendDisabled}>
            <Text
              style={styles.buttonText}
              onPress={handleAttend}
            >
              Attend
            </Text>
          </Pressable>
          <Pressable onPress={handleSave} style={ isSavedDisabled ? styles.disabled : styles.button}
          disabled={isSavedDisabled}>
            <Text style={styles.buttonText}>Save for later</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  disabled: {
    color: colors.grey,
    alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  paddingHorizontal: 29,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: colors.lightGrey,
  borderWidth: 1,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  borderBottomRightRadius: 15,
  borderBottomLeftRadius: 15,
  paddingBottom: 10,
  marginBottom: 10,
  marginRight: 10,
  marginLeft: 10,
},
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 29,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingBottom: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  text: {
    fontFamily: "regular",
    color: `${colors.black}`,
    flexWrap: "wrap",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 5,
  },
  header: {
    fontFamily: "poppins_bold",
    fontSize: 22,
    color: `${colors.orange}`,
    textAlign: "center",
    width: 410,
    flexWrap: "wrap",
  },
  date: {
    fontFamily: "poppins_bold",
    color: `${colors.orange}`,
    fontSize: 12,
  },
  body: {
    fontFamily: "regular",
    color: `${colors.black}`,
    flexWrap: "wrap",
    fontSize: 13,
    fontStyle: "normal",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "poppins_bold",
    letterSpacing: 0.25,
    color: "white",
  },
  eventImage: {
    width: 350,
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
  },
});
