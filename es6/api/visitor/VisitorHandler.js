import Visitor from './Visitor';
import Boom from 'boom';

export default {
  getVisitors(request, reply) {
    Visitor.find().sort('firstName')
      .then((visitors) => {
        reply(visitors);
      });
  },

  getVisitor(request, reply) {
    Visitor.findById(request.params.id)
      .then(reply)
      .catch(() => {
        return reply(Boom.notFound());
      });
  },

  newVisitor(request, reply) {
    let v = request.payload;

    if (v.dates) {
      v.from = v.dates.from;
      v.to = v.dates.to;
      delete v.dates;
    }

    if (v.from > v.to) {
      return reply(Boom.conflict('Invalid date range'));
    }

    Visitor.update({ email: v.email }, v, { upsert: true })
      .then(visitor => {
        return reply(visitor);
      })
      .catch(e => {
        return reply(Boom.badImplementation(e));
      });
  }
};
