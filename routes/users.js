'use strict';
var express = require('express'),
    router = express.Router(),
    expressJoi = require('express-joi-validator'),
    Joi = require('joi'),
    userController = require('../controllers/user'),
    isAuthenticated = require(process.cwd() + '/components/passportStrategy').isAuthenticated;

/**
 * @api {get} /users/exist Authenticate user in system
 * @apiGroup Users
 *
 * @apiParam {string{3..64}} username User login.
 * @apiParam {string{3..64}} password User password.
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.get(
    '/v1/users/exist',
    expressJoi({
      query: {
        username: Joi.string().email()
      }
    }),
    userController.exist
);

/**
 * @api {get} /users/me Authenticate user in system
 * @apiGroup Users
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.get(
    '/v1/users/me',
    isAuthenticated,
    userController.me
);

module.exports = router;
