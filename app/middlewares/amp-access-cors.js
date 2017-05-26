"use strict";

/**
 * Middleware que irá interceptar todas as requisições a serviços da API e irá garantir que o endpoint seja CORS enable
 */

var url = require('url');

var VALID_AMP_ORIGINS = [/.*\.ampproject\.org/g, /cdn\.edgeamp\.org/g, /amp\.cloudflare\.com/g, /cdn\.ampcache\.org/g];
var VALID_SOURCE_ORIGINS = []; // adicionar os hosts de STG ou PRD

module.exports = function(req, res, next) {
  // Enable CORS only for API requests 
  if (req.url.indexOf('/api/') > -1) {
    // Verify the origin (AMP and publisher domain)
    var requestingOrigin = getOrigin(req);
   if (!isValidOrigin(req, requestingOrigin)) {
      console.log('invalid origin: ' + requestingOrigin);
      // The request is not authorized
      res.sendStatus(401);
      return;
    }

    // Verify the source origin (publisher domain)
    var requestingSourceOrigin = req.query.__amp_source_origin || getOrigin(req);
    if (!isValidSourceOrigin(req, requestingSourceOrigin)) {
      console.log('invalid source origin: ' + requestingSourceOrigin);
      // The request is not authorized
      res.sendStatus(401);
      return;
    }
    console.log('---- valid requesting origins');
    // Return the allowed requesting origin 
    res.header('Access-Control-Allow-Origin', requestingOrigin);
    // Allow CORS credentials
    res.header('Access-Control-Allow-Credentials', 'true');
    // Allow the CORS response to contain the "AMP-Access-Control-Allow-Source-Origin" header.
    res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
    // The source origin that is allowed to read the authorization response 
    res.setHeader('AMP-Access-Control-Allow-Source-Origin', requestingSourceOrigin);
  }

  next();
};

function isValidOrigin(req, origin) {
  if (!origin) {
    // if origin not set verify the request host
    origin = req.protocol + '://' + req.hostname;
  }
  console.log('---- verifying origin: ', origin);

  return matchesAnyOrigin(VALID_AMP_ORIGINS, origin) || isValidSourceOrigin(req, origin);
}

function isValidSourceOrigin(req, sourceOrigin) {
  console.log('---- verifying source origin: ', sourceOrigin);
  if (req.hostname == 'localhost') {
    console.log('no origin check in dev mode');
    return true;
  }

  return matchesAnyOrigin(VALID_SOURCE_ORIGINS, sourceOrigin);
}

function matchesAnyOrigin(validOrigins, origin) {
  if (!origin) {
    return false;
  }
  var host = url.parse(origin).hostname;
  if (!host) {
    return false;
  }
  for (var i = 0; i < validOrigins.length; i++) {
    var urlPattern = validOrigins[i];
    if (host.match(urlPattern)) {
      return true;
    }
  }
  return false;
}

function getOrigin(req) {
  return req.headers.origin || req.protocol + '://' + req.hostname;
}