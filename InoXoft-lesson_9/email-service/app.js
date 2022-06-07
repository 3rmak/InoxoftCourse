const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');

const {
  httpStatusCodes,
  mailCredentials,
  mailHeaderLogoTemplatesEnum,
  mailContentTemplatesEnum,
  mailContentButtonTemplates,
  mailSubjectTemplatesEnum
} = require('./config');

const ErrorHandler = require('./errors/ErrorHandler');

const broadcastTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailCredentials.BROADCAST_EMAIL,
    pass: mailCredentials.BROADCAST_PASS
  }
});

const sendBroadcastMail = async (email, templateName, context = {}) => {
  const { userName, buttonLink } = context;

  if (!userName || !buttonLink) {
    throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'Not fully context');
  }

  const ejsFile = `${templateName}.ejs`;

  const emailContent = mailContentTemplatesEnum[templateName];
  const buttonText = mailContentButtonTemplates[templateName];
  const headerLogo = mailHeaderLogoTemplatesEnum[templateName];

  const html = await ejs
    .renderFile(path.resolve(process.cwd(), 'email-service', 'templates', ejsFile),
      {
        headerLogo,
        userName,
        emailContent,
        buttonText,
        buttonLink
      });

  // console.log(html);

  return broadcastTransport.sendMail({
    from: 'Gorbas Mail Service',
    to: email,
    subject: mailSubjectTemplatesEnum[templateName],
    html
  });
};

module.exports = {
  sendBroadcastMail
};
