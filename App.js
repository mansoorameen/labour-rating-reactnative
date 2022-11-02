import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import StarRating from "./StarRating";
import { Provider } from "react-redux";
import store from "./store/store";

export default function App() {
  const [labourList, setLabourList] = useState([]);
  const [labourDetails, setLabourDetails] = useState({});
  const [labourModalVisible, setLabourModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [firstApiCall, setFirstApiCall] = useState(0);
  const [selectedLabourId, setSelectedLabourId] = useState(0);

  useEffect(() => {
    fetchLabourList();
  }, []);

  const fetchLabourList = async () => {
    try {
      await fetch("http://demo3953048.mockable.io/labours")
        .then((response) => response.json())
        .then((response) => {
          setLabourList(response.labours);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLabourDetails = async () => {
    try {
      await fetch("http://demo3953048.mockable.io/labour")
        .then((response) => response.json())
        .then((response) => {
          setLabourDetails(response.labour_info);
          setFirstApiCall(1);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const openLabourModal = (selectedLabourId) => {
    !firstApiCall && fetchLabourDetails();
    setLabourModalVisible(true);
    setSelectedLabourId(selectedLabourId);
  };
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <View style={styles.head}>
          <Text>Labours</Text>
        </View>
        <TextInput
          placeholder="Search"
          onChangeText={(e) => setSearchQuery(e)}
          style={styles.input}
        />

        {labourList.length ? (
          labourList
            .filter((search) => {
              if (searchQuery === undefined) return search;
              else if (searchQuery === "") {
                return search;
              } else if (
                search.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
                return search;
              else return null;
            })
            .map((item) => (
              <View
                style={styles.card}
                key={item?.id}
                onStartShouldSetResponder={() => openLabourModal(item.id)}
              >
                <Text style={styles.text}>{item?.name}</Text>
                <Text style={styles.text}>
                  Quantity - {item?.quantity} {item?.unit}
                </Text>
              </View>
            ))
        ) : (
          <Text>No Lists Available</Text>
        )}
        <StatusBar style="auto" />

        <Modal
          animationType="slide"
          transparent={true}
          visible={labourModalVisible}
          onRequestClose={() => {
            setLabourModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {Object.keys(labourDetails).length !== 0 ? (
                <View>
                  <Text style={styles.heading}>{labourDetails?.name}</Text>
                  <Text>{labourDetails?.description}</Text>
                  <View style={styles.flexDiv}>
                    <View>
                      <Text>Quantity </Text>
                      <Text>Start Date</Text>
                      <Text>End Date</Text>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                      <Text>- </Text>
                      <Text>-</Text>
                      <Text>-</Text>
                    </View>
                    <View>
                      <Text>
                        {labourDetails?.quantity} {labourDetails?.unit}
                      </Text>
                      <Text>{labourDetails?.start_date}</Text>
                      <Text>{labourDetails?.end_date}</Text>
                    </View>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: labourDetails.progress
                            ? `${labourDetails?.progress}%`
                            : 0,
                        },
                      ]}
                    ></View>
                  </View>
                </View>
              ) : (
                <Text>No Data Available</Text>
              )}
              <StarRating selectedLabourId={selectedLabourId} />

              <Pressable
                style={styles.button}
                onPress={() => setLabourModalVisible(false)}
              >
                <Text style={styles.textStyle}>APPROVE</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0)",
    paddingHorizontal: 30,
  },
  head: {
    marginTop: 50,
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    borderRadius: 20,
    backgroundColor: "#E3E3E3",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  card: {
    backgroundColor: "#AADEDA",
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    fontColor: "white",
  },
  text: {
    color: "white",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  centeredView: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 20,
    width: 350,
    height: 450,
  },
  heading: {
    fontWeight: "bold",
  },
  flexDiv: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#E3E3E3",
    borderColor: "#E3E3E3",
    borderWidth: 2,
    borderRadius: 5,
  },
  progress: {
    height: 11,
    flexDirection: "row",
    backgroundColor: "#AADEDA",
    marginTop: -2.6,
    marginLeft: -2,
    borderColor: "#AADEDA",
    borderWidth: 2,
    borderRadius: 5,
  },
  button: {
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    backgroundColor: "#AADEDA",
    marginTop: 20,
    alignItems: "center",
  },
  textStyle: {
    color: "white",
  },
});
