export const generateUsername = (firstName, lastName) => {
    return `${firstName.trim().toLowerCase()}_${lastName.trim().toLowerCase()}`;
  };
  