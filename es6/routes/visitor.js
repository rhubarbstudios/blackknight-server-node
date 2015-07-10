import Joi from 'joi';

export default [
  {
    method: 'GET',
    path: '/foo',
    handler(request, reply) {
      reply({ foo: 'bar'});
    },
    config: {
      validate: {

      }
    }
  }
];
