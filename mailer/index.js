var config            = require(process.cwd() + '/config'),
    nodemailer        = require('nodemailer'),
    emailTemplates    = require('email-templates'),
    path              = require('path'),
    templatesDir      = path.resolve(__dirname, 'templates');

var transporter = nodemailer.createTransport();

module.exports.sendOne = function (templateName, locals, callback) {
  if(!locals.email){return callback(new Error('email address required'))}
  if(!locals.subject){return callback(new Error('subject required'))}
  if(!locals.pageTitle) {locals.pageTitle = locals.subject}

  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      return callback(err);
    }
    // Send a single email
    template(templateName, locals, function (err, html, text) {
      if (err) {
        return callback(err);
      }
      transporter.sendMail({
        from: config.get('mailer:defaultFromAddress'),
        to: locals.email,
        subject: locals.subject,
        html: html,
        // generateTextFromHTML: true,
        text: text
      }, function (err, info) {
        if (err) {
          return callback(err);
        }
        return callback(null, info, html, text);
      });
    });
  });
};
