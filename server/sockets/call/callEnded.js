const { emitNotifyToArray } = require("../../helpers/socketHelper");

let callEnded = (io, data, clients, user) => {
  //emit to cancel call
  if (clients[data.id]) {
    emitNotifyToArray(clients, data.id, io, "server--call-ended");
    console.log(data);
  }
};
module.exports = callEnded;
