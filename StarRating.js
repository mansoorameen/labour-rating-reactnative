import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { saveRating } from "./store/action";

const StarRating = ({ selectedLabourId }) => {
  const ratingObj = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <View style={styles.main}>
      <Text style={styles.feedback}>Feedback</Text>
      <View style={{ display: "flex", flexDirection: "row" }}>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <Pressable
              style={styles.button}
              key={index}
              onPress={() => {
                dispatch(saveRating(selectedLabourId, index));
              }}
            >
              <Text
                style={
                  index <=
                  ratingObj?.reduce((acc, item) => {
                    if (item.id === selectedLabourId) return item.rating;
                    else return acc;
                  }, 0)
                    ? styles.starSelected
                    : styles.starRegular
                }
              >
                &#9733;
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
    marginBottom: 80,
  },
  feedback: {
    fontWeight: "bold",
  },
  button: {
    marginRight: 10,
    border: "1px solid yellow",
  },
  starSelected: {
    color: "yellow",
    fontSize: 30,
  },
  starRegular: {
    color: "grey",
    fontSize: 30,
  },
});

export default StarRating;
