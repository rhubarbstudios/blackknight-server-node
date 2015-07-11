import Visitor from './Visitor';
import Boom from 'boom';

export default {
  getVisitors(request, reply) {
    Visitor.find().sort('firstName')
      .then((visitors) => {
        reply(visitors);
      });
  },

  newVisitor(request, reply) {
    let v = request.payload;

    if (v.dates) {
      v.from = v.dates.from;
      v.to = v.dates.to;
      delete v.dates;
    }

    Visitor.update({ email: v.email }, v, { upsert: true })
      .then((visitor) => {
        reply(visitor);
      })
      .catch((e) => {
        reply(Boom.badImplementation(e));
      });
  }
};
