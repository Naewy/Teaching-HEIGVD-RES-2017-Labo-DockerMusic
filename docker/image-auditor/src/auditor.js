var PORT_UDP = 3333;
var MULTICAST = '239.255.22.5';
var PORT_TCP = 2205;

var dgram = require('dgram');
var auditor = dgram.createSocket('udp4');

var net = require('net');
var server = net.createServer();

server.on('connection', handleConnection);
server.listen(PORT_TCP, function () {
    console.log("TCP server listening on port : " + PORT_TCP);
});

function handleConnection(connection) {
    console.log("New client from : " + connection.remoteAddress + ':' + connection.remotePort);

    connection.setEncoding('utf8');
    connection.write(JSON.stringify(liste) + '\n');
    connection.end();
}

function Musician(uuid, sound, activeSince)
{
    this.uuid = uuid;

    switch(sound)
    {
        case "ti-ta-ti" :
            this.instrument = "piano";
            break;

        case "pouet" :
            this.instrument = "trumpet";
            break;

        case "trulu" :
            this.instrument = "flute";
            break;

        case "gzi-gzi" :
            this.instrument = "violin";
            break;

        case "boum-boum" :
            this.instrument = "drum";
            break;

        default :
            console.log("This sound " + sound + " is invalid.");
            return;
    }

    this.activeSince = new Date(activeSince);
}

function updateList()
{
    for(var i = 0; i < liste.length; i++)
    {
        if(new Date() - liste[i].activeSince >= 5000)
        {
            console.log("Delete the inactive musician");
            liste.splice(i, 1);
        }
    }
}

auditor.bind(PORT_UDP, function () {
    console.log("Joining multicast pool");
    auditor.addMembership(MULTICAST);
});

auditor.on('message', function(msg, source) {
    console.log("Datagram received from " + source.port + ". \nIt contains : " + msg);

    var musician = JSON.parse(msg);
    var index;

    for(index = 0; index < liste.length; index++)
    {
        if(musician.uuid == liste[index].uuid)
        {
            console.log("musician already exist, update it's last emited time");
            liste[index].activeSince = new Date(musician.timestamp);
            break;
        }
    }

    if(index == liste.length)
    {
        console.log("Musician not in the list, we create it and push it in the liste");
        liste.push(new Musician(musician.uuid, musician.sound, musician.timestamp));
    }
});

var liste = [];

setInterval(updateList, 1000);
