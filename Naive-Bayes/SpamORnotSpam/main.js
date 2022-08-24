const fs = require("fs");
var bayes = require('bayes');
const { EmailAccount } = require("./imap");
const nodemailer = require('nodemailer');
const {DashboardSettings, EmailBotSettings, bayesSettings, EmailSenderSettings} = require("./settings.js");

const express = require('express')
const app = express()
const port = DashboardSettings.port;

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var NEW_EMAIL = [];


io.on('connection', (socket) => {
    console.log('a user connected');

    var lastEmail = NEW_EMAIL[NEW_EMAIL.length -1];

    socket.emit("FIRST_CONNECTION", NEW_EMAIL);


    socket.on("NEW_LEARNING_PROCESS",async(data)=>{
      await NEW_LEARNING(data);
    })

    setInterval(()=>{
        //console.log(NEW_EMAIL);
        if(NEW_EMAIL.length > 0 && NEW_EMAIL[NEW_EMAIL.length -1] != lastEmail){
            socket.emit("NEW_EMAIL", NEW_EMAIL[NEW_EMAIL.length -1]);
            lastEmail = NEW_EMAIL[NEW_EMAIL.length -1];
        }
    },1000)
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
})

server.listen(port, () => {
  console.log(`Dashboard listening on port ${port}`)
})

var classifier = bayes();


let transport = nodemailer.createTransport({
    host: EmailBotSettings.host,
    port: EmailBotSettings.port,
    auth: {
      user: EmailBotSettings.user,
      pass: EmailBotSettings.password
    },
    tls: EmailBotSettings.tls
 });

const MODEL_PATH = bayesSettings.path1;
const MODEL_PATH1 = bayesSettings.path2;

async function TrainModel(d, c){
    await classifier.learn(d,c);
}

async function NEW_LEARNING(data){
    
    NEW_EMAIL = [];

    //console.log(data);

    for (let index = 0; index < data.length; index++) {
        if(data[index].isSpam){
            await TrainModel(data[index].subject, "SPAM");
            fs.writeFileSync(bayesSettings.path2, `\n${data[index].subject}`,{flag: "a"});
        }else{
            await TrainModel(data[index].subject, "NOT_SPAM");
            fs.writeFileSync(bayesSettings.path1,`\n${data[index].subject}`,{flag: "a"});
        }
        
    }

    //console.log(classifier.toJson());
}

function ReadData(path){
 const data = fs.readFileSync(path, "utf-8");

 return data.split("\n");
}


function listenForNewEmails(){
    console.log("listen for new Emails");
    const Account = new EmailAccount();
    Account.on("NEW_EMAIL", async (email)=>{
        if(email == false) return;
        console.log("New Email Recieved! " + email.betreff);
        const predict = await PredictEmail(email.betreff);
        console.log(predict);
        if(predict == "NOT_SPAM"){
            await Account.deleteEmails(async(forwardEmailData)=>{
                SendEmail(forwardEmailData);
            NEW_EMAIL.push({subject: forwardEmailData.subject, isSpam: false});
            });
        }else{
            await Account.deleteEmails(async(forwardEmailData)=>{
                NEW_EMAIL.push({subject: forwardEmailData.subject, isSpam: true});
            });
        }
    })
}


async function SendEmail(data){
    var attch = [];
    if(data.attachmentsLength > 0 ){
        attch = prepareAttachments(data);
    }
    const mailOptions = {
        from: {
            name: EmailSenderSettings.name,
            address: EmailSenderSettings.senderAdress
        }, // Sender address
        to:  EmailSenderSettings.to, // List of recipients
        subject: data.from + " wants to send you a Email", // Subject line
        html: data.html,
        attachments: attch
   };

   transport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
       console.log("Email Send");
    }
});
   return;
}


function prepareAttachments(data){
    return {
        filename: data.attachments[0].filename,
        content: data.attachments[0].content,
        contentType: data.attachments[0].contentType
    }
}




async function PredictEmail(Email){
 const prediction = await classifier.categorize(Email);

 return prediction;
}

async function onload(){
    const positive = ReadData(MODEL_PATH)
    const negative = ReadData(MODEL_PATH1);

    console.log("Training the KI....")
    
    for (let index = 0; index < positive.length; index++) {
        await TrainModel(positive[index], "NOT_SPAM")
        
    }

    for (let index = 0; index < negative.length; index++) {
        await TrainModel(negative[index], "SPAM")
    }

    console.log("sucessfull trained");


    listenForNewEmails();
}


onload();
