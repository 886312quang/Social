const transValidation = {
  email_incorrect: "Email có dạng example@gmail.com",
  gender_incorrect: "????????????????????????????@@.",
  password_incorrect:
    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường chữ hoa và kí tự.",
  password_confirmation_incorrect: "Nhập lại mật khẩu không chính xác.",
  update_userName: "Username không quá 17 ký tự và không chứa ký tự đặc biệt.",
  update_gender: "Dữ liệu giới tính có vấn đề @@",
  update_address: "Địa chỉ giới hạn từ 3-30 ký tự.",
  update_phone: "Số điện thoại bắt đầu từ 0 và giới hạn 11 số.",
  keyword_incorrect: "Lỗi tìm kiếm",
  message_text_emoji_incorrect: "Tin nhắn tối đa 400 ký tự",
};

const transErrors = {
  account_in_use:
    "Email đã được sử dụng vui lòng tạo tài khoản với email khác.",
  account_removed:
    "Tài khoản này đã bị gỡ khỏi hệ thống vui lòng liên hệ với bộ phận hỗ trợ.",
  account_notActive:
    "Email đã được đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.",
  undefine_token: "Tài khoản đã kích hoạt.",
  login_fail: "Sai tài khoản hoặc mật khẩu.",
  server_errors:
    "Có lỗi server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để được giải quyết xin cám ơn.",
  avatar_type_errors: "Kiểu file không hợp lệ chỉ nhận file jpg & png",
  avatar_size_errors: "Ảnh upload phải nhỏ hơn 1 MB",
  imageMessage_type_errors: "Kiểu file không hợp lệ chỉ nhận file jpg & png",
  imageMessage_size_errors: "Ảnh upload kích thước tối đa nhỏ hơn 1 MB",
  attachmentMessage_size_errors: "Tệp tin đính kèm upload tối đa nhỏ hơn 1 MB",
  account_undefine: "Tài khoản không tồn tại.",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
  user_new_password_failed: "Mật khẩu mới phải thay đổi.",
  conversation_not_found: "Cuộc trò chuyện không tồn tại.",
};

const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản ${userEmail} đã được tạo, vui lòng kiểm tra email của bạn để active trước khi đăng nhập.`;
  },
  accountActive:
    "Kích hoạt tài khoản thành công. Bạn có thể đăng nhập vào ứng dụng",
  loginSuccess: (userName) => {
    return `Chào mừng ${userName} đến với Ahoo chat`;
  },
  logoutSuccess: "Đăng xuất thành công.",
  updatedAvatar: "Cập nhật ảnh đại diện thành công.",
  updatedUserInfo: "Cập nhật thông tin thành công.",
  updatedPassword: "Cập nhật mật khẩu thành công.",
  deleteFileSuccess: "Xóa thành công.",
};

const transMail = {
  subject: "Ahoo xác nhận kích hoạt tài khoản. ",
  template: (linkVerify) => {
    return `
      <h2>Email xác nhận tài khoản trên ứng dựng ahoo chat.</h2>
      <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Chào mừng bạn đến với ahoo chat.</h4>
    `;
  },
  send_failed:
    "Có lỗi trong quá trình gửi mail xác nhận vui lòng liên hệ với bộ phận hỗ trợ để được hướng dẫn.",
};

module.exports = {
  transValidation,
  transErrors,
  transSuccess,
  transMail,
};
