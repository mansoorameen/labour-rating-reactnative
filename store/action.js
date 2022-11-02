export const saveRating = (id, rating) => {
  return {
    type: "SAVE_RATING",
    payload: { id: id, rating: rating },
  };
};
