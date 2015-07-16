import Joi from 'joi';
import {getVisitors, getVisitor, newVisitor} from './VisitorHandler';

let basePath = '/visitors';

export default [
  {
    method: 'GET',
    path: basePath,
    handler: getVisitors,
    config: {
      validate: {

      }
    }
  },
  {
    method: 'GET',
    path: basePath + '/{id}',
    handler: getVisitor,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: basePath,
    handler: newVisitor,
    config: {
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().email().required(),
          company: Joi.string(),
          photoUrl: Joi.string().uri(),
          dates: Joi.object().keys({
            from: Joi.date().iso(),
            to: Joi.date().iso()
          }).min(2).and('from', 'to'),
          needsApproval: Joi.boolean().required()
        }
      }
    }
  }
];
