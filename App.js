import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  ProgressBarAndroid,
} from "react-native";
import StarRating from "./StarRating";
import { Provider } from "react-redux";
import store from "./store/store";

export default function App() {
  // state to store labours list
  const [labourList, setLabourList] = useState([]);
  // state to store labour details
  const [labourDetails, setLabourDetails] = useState({});
  // state to toggle labour popup open or close
  const [labourModalVisible, setLabourModalVisible] = useState(false);
  // state to store search keyword from user
  const [searchQuery, setSearchQuery] = useState("");
  // state to store selected labour id so that to store the rating accordingly
  const [selectedLabourId, setSelectedLabourId] = useState(0);
  // loader states
  const [mainLoader, setMainLoader] = useState(false);
  const [detailsLoader, setDetailsLoader] = useState(false);

  useEffect(() => {
    fetchLabourList();
  }, []);

  // fetching labours list
  const fetchLabourList = async () => {
    try {
      setMainLoader(true);
      await fetch("http://demo3953048.mockable.io/labours")
        .then((response) => response.json())
        .then((response) => {
          setLabourList(response.labours);
          console.log(response);
          setMainLoader(false);
        });
    } catch (error) {
      setMainLoader(false);
    }
  };

  // fetching labour details
  const fetchLabourDetails = async () => {
    try {
      setDetailsLoader(true);
      await fetch("http://demo3953048.mockable.io/labour")
        .then((response) => response.json())
        .then((response) => {
          setLabourDetails(response.labour_info);
          setDetailsLoader(false);
        });
    } catch (error) {
      setDetailsLoader(false);
    }
  };

  // function to open the labour details modal, api call and get selected labour id
  const openLabourModal = (selectedLabourId) => {
    fetchLabourDetails();
    setLabourModalVisible(true);
    setSelectedLabourId(selectedLabourId);
  };
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={[
          labourModalVisible
            ? { flex: 1, backgroundColor: "black", opacity: 0.2 }
            : { flex: 1 },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.head}>
            <Text>Labours</Text>
          </View>
          <TextInput
            placeholder="Search"
            onChangeText={(e) => setSearchQuery(e)}
            style={styles.input}
          />

          {/* display labours list if api call is success */}
          {mainLoader ? (
            <ProgressBarAndroid style={styles.noList} />
          ) : labourList.length ? (
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
            // if api call failed or no data
            <Text>No Lists Available</Text>
          )}

          {/* popup to display labour details */}
          <Modal
            animationType="none"
            transparent={true}
            visible={labourModalVisible}
            onRequestClose={() => {
              setLabourModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* check if labour details exist */}
                {detailsLoader ? (
                  <ProgressBarAndroid style={styles.detailsLoader} />
                ) : Object.keys(labourDetails).length !== 0 ? (
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
                  // if labour details doesn't exist
                  <Text style={styles.noDetails}>No Data Available</Text>
                )}

                {/* component to display star rating */}
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
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
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
    backgroundColor: "white",
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
  detailsLoader: {
    marginVertical: 65,
  },
  noDetails: {
    marginVertical: 65,
    marginLeft: "auto",
    marginRight: "auto",
  },
  noList: {
    marginTop: 70,
  },
});
