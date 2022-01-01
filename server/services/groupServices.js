const GroupModel = require("./../models/chatGroupsModel");

let addNew = (captionId, members, name) => {
  return new Promise(async (resolve, reject) => {
    // Create Group
    let newGroupItem = {
      name: name,
      userId: captionId,
      userAmount: members.length,
      messageAmount: 0,
      members: members,
    };
    let newGroup = await GroupModel.createNew(newGroupItem);
    resolve(newGroup);
  });
};

module.exports = {
  addNew: addNew,
};
