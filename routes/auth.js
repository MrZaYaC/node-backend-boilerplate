'use strict';

var express = require('express'),
    router = express.Router(),
    expressJoi = require('express-joi-validator'),
    Joi = require('joi'),
    authController = require('../controllers/auth'),
    isAuthenticated = require(process.cwd() + '/components/passportStrategy').isAuthenticated;


/**
 * @apiDefine MyAuthUserResponse
 * @apiSuccess {object} user User info.
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "token": "06240160-5832-40e6-aa3a-e42ce0b18e7e"
 *  }
 */


/**
 * @api {get} /auth Authenticate user in system
 * @apiGroup Auth
 *
 * @apiParam {string} username User email.
 * @apiParam {string{7..64}} password User password.
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.get(
    '/v1/auth',
    expressJoi({
      query: {
        username: Joi.string().email().required(),
        password: Joi.string().min(7).max(64).required()
      }
    }),
    authController.login
);
/**
 * @api {post} /auth Register user in system
 * @apiGroup Auth
 *
 * @apiParam {string} username User email.
 * @apiParam {string{3..64}} password User password.
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.post(
    '/v1/auth',
    expressJoi({
      body: {
        username: Joi.string().email().required(),
        password: Joi.string().min(7).max(64).required(),
        ip: Joi.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
      }
    }),
    authController.signUp
);

/**
 * @api {get} /auth Authenticate user in system
 * @apiGroup Auth
 *
 * @apiParam {string} access_token User facebook access_token.
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.get(
    '/v1/auth/facebook',
    expressJoi({
      query: {
        access_token: Joi.string().required(),
        ip: Joi.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
      }
    }),
    authController.facebook
);

/**
 * @api {get} /auth Authenticate user in system
 * @apiGroup Auth
 *
 * @apiParam {string} access_token User GooglePlus access_token.
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.get(
    '/v1/auth/google',
    expressJoi({
      query: {
        access_token: Joi.string().required(),
        ip: Joi.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
      }
    }),
    authController.google
);

/**
 * @api {delete} /auth Log out user from system
 * @apiGroup Auth
 *
 *
 * @apiUse MyAuthUserResponse
 *
 * @apiError NotFound User with provided credentials was not found.
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 */
router.delete(
    '/v1/auth',
    isAuthenticated,
    authController.logOut
);

module.exports = router;
