Meteor.startup(function() {
    Meteor.Mailgun.config({
        username: 'postmaster@mg.critterapp.com',
        password: '3b4fef63f848cf9e77438b0ee8bacfd6'
    });
    Meteor.methods({
        sendEmail: function (mailFields) {
            console.log("about to send email...");
            check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text], [String]);

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Meteor.Mailgun.send({
                to: mailFields.to,
                from: mailFields.from,
                subject: mailFields.subject,
                text: mailFields.text
            });
            console.log("email sent!");
        }
    });
});