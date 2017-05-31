"use strict";

module.exports = function(app) {

    app.get('/login', function(req, res, next) {
        var params = {
            rid: req.query.rid, 
            url: req.query.url, 
            ref: req.query.ref
        };

        console.log('pingback: ', params);

        res.render('login/index', params)
    });

}