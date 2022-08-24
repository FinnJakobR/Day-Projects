# SpamAI in Node js
A spam AI built with the Native-Bayes algorithm to classify an email as spam or not spam based on the email subject. 
## Motivation
During my university summer vacation, I wanted to do some research on artificial intelligence. I read books and watched videos on the subject. My goal was to create an exercise project on the topic, which does not have to do with neural networks. <br /> <br />That's when I got an idea. I have so many different emails that you lose track of which ones are important and which ones are not. All email accounts of me are some kind of spam accounts, I get so many emails there, that it's easy to lose the overview, which are important and which are not. <br /> <br />Then I had the idea why not just solve it with Ki. The main idea was to write an email bot, which can solve by AI if the email is relevant or not.  If the email is relevant. Send it to my main email address. Also I built a dashboard which shows the classified email subjects and I can choose there if spam or not spam, so the ki learns correctly. 
## implementation
In the early beginnings, I wanted to write this project in Python, since I'll need that for my studies at some point anyway. But I'm desperate, I sat hours just to understand the basics of python. That's why I gave up coding with python, I have to start with a "simpler" project first. <br /> <br />Then I switched to Node js. The second problem with this project was the NLP (Natural Language Processing), at first I wanted to use this in this project, but I quickly realized that I won't be able to do it in one day. So the program only deletes punctuation, smileys and whitespaces. I also had problems with Imap in the beginning. Imap is a whole science and it was hard to understand how imap servers are built. But after a few videos I understood it. 
## Use 
First, you have to clone this projekt, then make 
```npm install``` in the Cloned Directory <br />
When If the installation was successful open ```settings.js```<br /><br />

```settings.js``` should look like this: <br />

```javascript
const EmailAcoountSettings={
    user: '',
    password: '',
    host: '',
    port: 993,
    tls: true,
}

const DashboardSettings = {
    port: 3000
}


const EmailBotSettings = {
    user: '',
    password: '',
    host: '', //you need the SMTP URL from your email Account
    port: 587,
    tls: true,
}

const bayesSettings = {
    path1: "",
    path2: "",
}
``` 
<br />

Add your ```Email-Account-Data```, after that your are ready to go :)

## Dashboard

![Dashboard](https://github.com/FinnJakobR/Day-Projects/blob/main/Naive-Bayes/SpamORnotSpam/Dashboard.png?raw=true)

## What i learned

- [x] How to Use Naive Bayes
- [x] What is Text Classification
- [x] Basics of SMTP and IMAP
- [x] Basic of Natural Language Processing 

