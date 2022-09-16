const { toXML } = require('jstoxml');
const url = require('url'); // url module

// function to respond with a json object
// takes request, response, status code and object to send
const respondXML = (request, response, status, object) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'text/xml',
  };

  console.log(toXML(object));
  // send response with json object
  response.writeHead(status, headers);
  response.write(toXML(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondXMLMeta = (request, response, status) => {
  // object for our headers
  // Content-Type for xml
  const headers = {
    'Content-Type': 'text/xml',
  };

  // send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

const getData = (request, response) => {
  // json object to send
  const responseJSON = {
    message: ' This is a successful response',
  };

  // return 200 with message
  return respondXML(request, response, 200, responseJSON);
};

const badRequestHandler = (request, response) => {
  const responseJSON = {
    response: {
      message: ' Missing valid query parameter set to true.',
      id: 'badRequest',
    },
  };

  if (url.parse(request.url, true).query.valid === 'true') {
    delete responseJSON.id;
    responseJSON.message = ' This request has the required parameters';
    return respondXML(request, response, 200, responseJSON);
  }
  // return 400 with message
  return respondXML(request, response, 400, responseJSON);
};

const unauthorizedHandler = (request, response) => {
  const responseJSON = {
    response: {
      message: ' Missing loggedIn query parameter set to yes.',
      id: 'unauthorized',
    },
  };

  if (url.parse(request.url, true).query.loggedIn === 'yes') {
    delete responseJSON.response.id;
    responseJSON.response.message = ' You have successfully viewed the content.';
    return respondXML(request, response, 200, responseJSON);
  }
  // return 401 with message
  return respondXML(request, response, 401, responseJSON);
};

const forbiddenHandler = (request, response) => {
  const responseJSON = {
    response: {
      message: ' You do not have access to this content.',
      id: 'forbidden',
    },
  };

  // return 403 with message
  return respondXML(request, response, 403, responseJSON);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    response: {
      message: ' The page you are looking for was not found.',
      id: 'notFound',
    },
  };

  // return a 404 with an error message
  respondXML(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondXMLMeta(request, response, 404);
};

const internalHandler = (request, response) => {
  // create error message for response
  const responseJSON = {
    response: {
      message: ' Internal Server Error. Something went wrong.',
      id: 'internalError',
    },
  };

  // return a 500 with an error message
  respondXML(request, response, 500, responseJSON);
};

const notImpl = (request, response) => {
  // create error message for response
  const responseJSON = {
    response: {
      message: ' A get request for this page has not been implemented yet. Check again later for updated content.',
      id: 'notImplemented',
    },
  };

  // return a 501 with an error message
  respondXML(request, response, 501, responseJSON);
};

// set public modules
module.exports = {
  getData,
  notFound,
  notFoundMeta,
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  internalHandler,
  notImpl,
};
