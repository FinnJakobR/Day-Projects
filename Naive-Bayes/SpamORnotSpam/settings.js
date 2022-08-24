const EmailAccountSettings = {
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


module.exports = {EmailAccountSettings, bayesSettings, EmailBotSettings, DashboardSettings};