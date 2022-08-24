
var imaps = require('imap-simple');
const fs = require("fs");
const {EmailAccountSettings} = require("./settings.js");
const simpleParser = require('mailparser').simpleParser;


class EmailAccount {
    constructor(){
     this.emails = [];
        this.config = {
            imap: {
                user: EmailAccountSettings.user,
                password: EmailAccountSettings.password,
                host: EmailAccountSettings.host,
                port: EmailAccountSettings.port,
                tls:  EmailAccountSettings.tls,
                keepalive: {
                    idleInterval: 60 * 1000 // re-IDLE every minute
                  }                
            }
        };
    }

    on(listiner, cb){
      if(listiner == "NEW_EMAIL"){
        setInterval(async ()=>{
            const data = await imaps.connect(this.config).then(function (connection) {

                return connection.openBox('INBOX').then(function () {
                    var searchCriteria = [
                        'UNSEEN'
                    ];
            
                    var fetchOptions = {
                        bodies: ['HEADER', 'TEXT'],
                        markSeen: false
                    };
            
                    return connection.search(searchCriteria, fetchOptions).then(function (results) {
                        var subjects = results.map(function (res) {
                            return res.parts.filter(function (part) {
                                return part.which === 'HEADER';
                            })[0].body.subject[0];
                        });

                        var subjects2 = results.map(function (res) {
                            return res.parts.filter(function (part) {
                                return part.which !== 'ATTRIBUTES';
                            })[0];
                        });
                        connection.end();
                        if((!subjects.length == 0) && (!subjects2.length == 0)){
                            return {
                                betreff: subjects[subjects.length -1],
                                email_id: subjects2[subjects2.length -1].body["message-id"][0]
                            }
                        }else{
                            return false;
                        }
                    });
                });
            });
            if(!this.emails.includes(data.betreff)){
                this.emails.push(data.betreff);
                cb(data);
            }
        },3000)
      }else{
        throw Error();
      }
    }

    async deleteEmails(cb){
        const data = await imaps.connect(this.config).then(function (connection) {
            return connection.openBox('INBOX').then(function () {
                var searchCriteria = [
                    'UNSEEN'
                ];
        
                var fetchOptions = {
                    bodies: ["TEXT", ""],
                    markSeen: true
                };

                return connection.search(searchCriteria, fetchOptions).then(function (results) {
                    const res = results[results.length - 1];

                    //console.log(res);

                    var all = res.parts[1]
                    var id = res.attributes.uid;
                    var idHeader = "Imap-Id: "+id+"\r\n";
                    simpleParser(idHeader+all.body, (err, mail) => {
                        //console.log(mail.subject);
                        //console.log(mail.html);

                        //console.log(mail.attachments);

                        const response = {
                            subject: mail.subject,
                            html: mail.html,
                            attachments: mail.attachments,
                            from: mail.from.value[0].address,
                            attachmentsLength: mail.attachments.length
                        }

                        cb(response);
                    });
                    
                    const uuid = results[results.length - 1].attributes.uid;
                     connection.moveMessage(uuid, "SPAM",()=>{});
                     connection.deleteMessage(uuid, ()=>{});

                })
            });
        })
    }
}

module.exports = {
    EmailAccount
}