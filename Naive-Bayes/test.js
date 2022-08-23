var imaps = require('imap-simple');

var config = {
    imap: {
        user: 'finn.reinhardt2@gmx.de',
        password: 'Schwante',
        host: 'imap.gmx.net',
        port: 993,
        tls: true,
    }
};


async function XDXD(){
    const data = await imaps.connect(config).then(function (connection) {

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
    
                //console.log(subjects[subjects.length - 1]);
    
                return subjects[subjects.length -1];
                // =>
                //   [ 'Hey Chad, long time no see!',
                //     'Your amazon.com monthly statement',
                //     'Hacker Newsletter Issue #445' ]
            });
        });
    });


    console.log(data);
}

XDXD();
