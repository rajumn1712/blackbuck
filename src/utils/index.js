const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const hasChanged = (values) => {
  let isValid = false;
  for (let key in values) {
    if (!values[key]) isValid = true;
  }
  return isValid;
};
class ErrorMessages {
  error; success; delete; postSuccess; postDelete
  constructor(title = "") {
    this.error = "Something went wrong. please try again!";
  }
}
export { uuidv4, hasChanged };
