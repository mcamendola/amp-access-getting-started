"use strict";

module.exports = function(app) {

    app.get('/api/amp-access/authorization.json', function(req, res, next){
        console.log('authorization: ', {
            rid: req.query.rid, 
            url: req.query.url, 
            ref: req.query.ref
        });

        if (!req.query.rid) { // READER_ID é uma informação obrigatória
            console.log('O parametro rid (READER_ID) é obrigatório.')
            res.sendStatus(400);
            return;
        }

        // JSON de resposta do método em formato livre
        var response = {
            'autorizado': false,
            'views': 1,
            'maxViews': 3
        };

        res.json(response);
    });

}