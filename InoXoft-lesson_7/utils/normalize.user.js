module.exports = {
  normalization: (user) => {
    const fieldsToRemove = ['password'];

    for (const item of fieldsToRemove) {
      delete user[item];
    }

    return user;
  }
};
