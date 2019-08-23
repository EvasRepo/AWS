'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
exports.userServicePoc = (event, context, callback) => {
    console.log(event);

    switch (event.httpMethod) {
        case 'DELETE':
            deleteItem(event, callback);
            break;
        case 'GET':
            getItem(event, callback);
            break;
        case 'POST':
            saveItem(event, callback);
            break;
        case 'PUT':
            updateItem(event, callback);
            break;
        default:
            sendResponse(404, 'Unsupported method "${event.httpMethod}"', callback);
    }
};

function saveItem(event, callback) {
    const item = JSON.parse(event.body);

    item.pk = uuidv1();

    databaseManager.saveItem(item).then(response => {
        console.log(response);
        sendResponse(200, item.pk, callback);
    }, (reject) =>{
        sendResponse(400, reject, callback);
    });
}

function getItem(event, callback) {
    const itemId = event.pathParameters.pk;

    databaseManager.getItem(itemId).then(response => {
        console.log(response);
        if(response)
            sendResponse(200, response, callback);
        else
        sendResponse(404, "Please pass a valid itemId", callback);

    },(reject) =>{
        sendResponse(400, reject, callback);
    });
}

function deleteItem(event, callback) {
    const itemId = event.pathParameters.pk;

    databaseManager.deleteItem(itemId).then(response => {
        sendResponse(200, 'DELETE ITEM', callback);
    }, (reject) => {
        sendResponse(400, reject, callback);
    });
}

function updateItem(event, callback) {
    const itemId = event.pathParameters.pk;

    const body = JSON.parse(event.body);

    databaseManager.updateItem(itemId, body).then(response => {
        console.log(response);
        sendResponse(200, response, callback);
    }, (reject) => {
        sendResponse(400, reject, callback);
    });
}

function sendResponse(statusCode, message, callback) {

     const response = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, response);
};

