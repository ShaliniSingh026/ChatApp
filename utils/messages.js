const moment = require('moment');
var current = new Date();
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
function generateLocationMessage(username, latitude, longitude) {
    return {
        username,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        time: moment().format('h:mm a')
    }

}
module.exports = { formatMessage, generateLocationMessage };