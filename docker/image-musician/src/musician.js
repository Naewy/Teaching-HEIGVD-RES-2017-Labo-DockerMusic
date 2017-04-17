var PORT = 3333;
var HOST = '239.255.22.5';

var dgram = require('dgram');
const uuidV4 = require('uuid/v4');

var client = dgram.createSocket('udp4');

function Musician(instrument)
{
    this.uuid = uuidV4();
    this.instrument = instrument;

    switch(instrument)
    {
        case "piano" :
            this.sound = "ti-ta-ti";
            break;

        case "trumpet" :
            this.sound = "pouet";
            break;

        case "flute" :
            this.sound = "trulu";
            break;

        case "violin" :
            this.sound = "gzi-gzi";
            break;

        case "drum" :
            this.sound = "boum-boum";
            break;

        default :
            console.log("This instrument doesn't exist.");
            return;
    }

    Musician.prototype.emitSound = function () {

        var soundEmited = {
            uuid: this.uuid,
            sound: this.sound,
            timestamp: new Date().toJSON()
        };

        var stringJSON = JSON.stringify(soundEmited);

        message = new Buffer(stringJSON);
        client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
            console.log("UDP data send to " + HOST + ":" + PORT + ". Contenu : " + message);
        });
    }

    setInterval(this.emitSound.bind(this), 1000);
}

var instrument = process.argv[2];

var musician = new Musician(instrument);