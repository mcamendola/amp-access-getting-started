"use strict";

module.exports = function(app) {

    app.get('/api/amp-access/authorization.json', function(req, res, next){
        if (!req.query.rid) { // READER_ID é uma informação obrigatória
            console.log('O parametro rid (READER_ID) é obrigatório.')
            res.sendStatus(400);
            return;
        }

        console.log('endpoint authorization invoked! rid=' + req.query.rid);

        // JSON de resposta do método em formato livre
        var response = {
            'autorizado': true
        };

        res.json(response);
    });

}