function updateItemById(array : Array<any>, id : string, newData : any) {
  const index = array.findIndex(item => item.id === id);
  if (index !== -1) {
    // Merge the new data with the existing item
    array[index] = { ...array[index], ...newData };
  }
  return array;
}

export default updateItemById;