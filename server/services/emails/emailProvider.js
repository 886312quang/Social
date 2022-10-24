const nodemailer = require("nodemailer");
const Email = require("email-templates");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "quanlyahoochat9898@gmail.com",
    pass: "mfercgzhltgussxw",
  },
  host: 'smtp.gmail.com',
  port: 465,
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log("error with email connection");
    console.log(error);
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "quanlyahoochat9898@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordReset",
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: "Ahoo Chat",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `http://localhost:3000/new-password?resetToken=${passwordResetObject.resetToken}&email=${passwordResetObject.userEmail}`,
      },
    })
    .catch((error) => {
      console.log("error sending password reset email");
      console.log(error);
    });
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "quanlyahoochat9898@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: user.local.email,
      },
      locals: {
        productName: "Ahoo Chat",
        name: user.userName,
      },
    })
    .catch((error) => {
      console.log("error sending change password email");
      console.log(error);
      return res.status(500).json({ message: error });
    });
};

exports.verifyEmailAccount = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "quanlyahoochat9898@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "verifyEmailAccount",
      message: {
        to: user.local.email,
      },
      locals: {
        productName: "Ahoo Chat",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `http://localhost:3000/verify-email?token=${user.local.verifyToken}&email=${user.local.email}`,
      },
    })
    .catch((error) => {
      console.log("error sending password reset email");
      console.log(error);
    });
};
