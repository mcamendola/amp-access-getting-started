"use strict";

module.exports = function(app) {

    app.get('/materias/((\\d+))', function(req, res, next) {
        var id = parseInt(req.params[0]);  
        if(id > 10) {
            console.log('Matéria não encontrada.')
            res.sendStatus(400);
            return;
        }

        var host = req.get('host');
        var protocol = host.startsWith('localhost') ? 'http' : 'https';

        res.render(`materias/${id}.ejs`, {
            host: protocol + '://' + host
        });
    });

}