const moment = require('moment'); // библиотека для указания данного момента времени

function formatMessage(userName,text){
  return {
    username : userName,
    text: text,
    time: moment().format('h:mm a')// hour minutes am/pm
  }
}
module.exports = formatMessage;

