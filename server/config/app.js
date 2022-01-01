const app = {
  max_event_listeners: 30,
  avatar_directory: "server/public/images/users",
  images_message_directory: "server/public/images/message",
  attachment_message_directory: "server/public/images/files",
  avatar_type: ["image/png", "image/jpg", "image/jpeg"],
  avatar_limit_size: 2097152, // 1mb
  imageMessage_type: ["image/png", "image/jpg", "image/jpeg"],
  imageMessage_limit_size: 2097152, // 1mb
  attachmentMessage_limit_size: 2097152, // 1mb
  general_avatar_group_chat: "groupchat.png",
};

module.exports = app;
