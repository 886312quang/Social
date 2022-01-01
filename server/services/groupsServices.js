const GroupModel = require("../models/groupModel");

let addNew = (captionId, members, name) => {
  return new Promise(async (resolve, reject) => {
    // Create Group
    let newGroupItem = {
     
    };
    let newGroup = await GroupModel.createNew(newGroupItem);
    resolve(newGroup);
  });
};

module.exports = {
  addNew: addNew,
};
