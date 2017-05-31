"use strict";

module.exports = function(app) {

    app.post('/api/amp-access/pingback', function(req, res, next){
        console.log('pingback: ', {
            rid: req.query.rid, 
            url: req.query.url, 
            ref: req.query.ref
        });

        if (!req.query.rid) { // READER_ID é uma informação obrigatória
            console.log('O parametro rid (READER_ID) é obrigatório.')
            res.sendStatus(400);
            return;
        }

        // Nesse endpoint que teremos de contabilizar uma visualização para a matéria

        res.status(200).end();
    });

}