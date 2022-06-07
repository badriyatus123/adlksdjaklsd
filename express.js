var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

module.exports = function (conn) {
  app.get('/', (req, res) => res.send('Home Page Route'));
  app.post('/msg', async (req, res) => {
    const { number, message } = req.body
    if (!number || !message) {
      res.send({status: 'failed', error:'number and message are required'})
    } else {
      try {
        await conn.sendMessage(`${number}@s.whatsapp.net`, { text: message })
        res.send({ status: 'success' })
      } catch (e) {
        console.log(e)
        res.send({ status: 'failed', error: e })
      }
    }
  })
  //PORT
  app.listen(3000, function () {
    console.log('listening on port 3000');
  });
}
