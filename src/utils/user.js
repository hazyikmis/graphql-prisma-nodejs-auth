const getFirstName = (fullName) => {
  return fullName.split(" ")[0];
};

const isValidPassword = (pwd) => {
  return pwd.length >= 8 && !pwd.toLowerCase().includes("password");
};

module.exports = { getFirstName, isValidPassword };
