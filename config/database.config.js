module.exports = {
    "mongo": {
        "database": "mongodb://oneswitch:dB7Du7INDeLMTlas@ds117489.mlab.com:17489/oneswitch?authMechanism=SCRAM-SHA-1",
        "options": {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000, //ms
            poolSize: 10
        },
        "initialRetryTime": 1000 //ms
    }
}
