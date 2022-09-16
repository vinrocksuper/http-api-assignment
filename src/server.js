const http = require('http'); // http module
const url = require('url'); // url module
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
  },
};

const jsonUrlStruct = {
  GET: {
    notFound: jsonHandler.notFound,
    '/success': jsonHandler.getData,
    '/badRequest': jsonHandler.badRequestHandler,
    '/unauthorized': jsonHandler.unauthorizedHandler,
    '/forbidden': jsonHandler.forbiddenHandler,
    '/internal': jsonHandler.internalHandler,
    '/notImplemented': jsonHandler.notImpl,
  },
  HEAD: {
    notFound: jsonHandler.notFoundMeta,
  },
};

const xmlUrlStruct = {
  GET: {
    notFound: xmlHandler.notFound,
    '/success': xmlHandler.getData,
    '/badRequest': xmlHandler.badRequestHandler,
    '/unauthorized': xmlHandler.unauthorizedHandler,
    '/forbidden': xmlHandler.forbiddenHandler,
    '/internal': xmlHandler.internalHandler,
    '/notImplemented': xmlHandler.notImpl,
  },
  HEAD: {
    notFound: xmlHandler.notFoundMeta,
  },
};

// function to handle requests
// eslint-disable-next-line consistent-return
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.headers.accept === 'application/json' || !request.headers.accept) {
    if (!jsonUrlStruct[request.method]) {
      return jsonUrlStruct.HEAD.notFound(request, response);
    }
    if (jsonUrlStruct[request.method][parsedUrl.pathname]) {
      jsonUrlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
      jsonUrlStruct[request.method].notFound(request, response);
    }
  } else if (request.headers.accept === 'text/xml') {
    if (!xmlUrlStruct[request.method]) {
      return xmlUrlStruct.HEAD.notFound(request, response);
    }
    if (xmlUrlStruct[request.method][parsedUrl.pathname]) {
      xmlUrlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
      xmlUrlStruct[request.method].notFound(request, response);
    }
    // Use the HTML paths for the index / CSS pages
  } else if (htmlStruct[request.method][parsedUrl.pathname]) {
    htmlStruct[request.method][parsedUrl.pathname](request, response);
    // If manually trying to enter the get, use json methods
  } else if (jsonUrlStruct[request.method][parsedUrl.pathname]) {
    jsonUrlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    jsonUrlStruct[request.method].notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
