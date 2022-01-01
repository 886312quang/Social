const { emitNotifyToArray } = require("../../helpers/socketHelper");

let removeContact = (io, data, clients, user) => {
  let notify = {
    _id: user._id,
  };
  // emit Data
  if (clients[data]) { // data: id
    emitNotifyToArray(
      clients,
      data,
      io,
      "response-remove-contact",
      notify,
    );
  }
};

module.exports = removeContact;
