module.exports = {
  normalization: (user) => {
    const fieldsToRemove = [
      'password',
      'isActive',
      '__v'
    ];
    user = user.toObject();

    fieldsToRemove.forEach((field) => {
      delete user[field];
    });

    return user;
  },

  nameNormalizator: (name = '') => {
    if (!name) {
      return '';
    }

    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Crème Brulée -> Creme Brulee
    name = name.replace(/[0123456789.,{}<>?$#@%+&":*()]/g, ' ');
    name = name.split(' ').filter((char) => !!char); // Creme      Brulee => [Creme,Brulee]
    name = name.map((str) => str.toLowerCase());
    name = name.map((str) => str.charAt(0).toUpperCase() + str.slice(1)); // brulee -> 'B' + 'rulee'
    name = name.join(' ').trim();

    return name;
  }
};
