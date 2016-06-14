/**
 * ReviewController
 *
 * @description :: Server-side logic for managing reviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		var user = req.user;
		var data = req.allParams();
		sails.log.debug('Data recieved:', data);

		async.series([
			function canReview(cb) {
				if(!user) {
					cb(new sError.Grant('Review.Not.Authenticated'));
				}
				sails.log.debug('start canReview');

				Recipe.findOne({
					id: data.recipe,
				}).exec(function(err, recipe) {
					if (err) {
						cb(err);
					}

					else if (!recipe) {
						cb(new sError.Service('Review.Not.Found.Recipe'));
					}

					else {
						sails.log.debug('canReview done');
						cb(null, recipe);
					}
				})
			},

			function insertReview(cb) {
				data.author = user.id;
				sails.log.debug('start inserReview');

				Review.create(data).exec(function(err, review) {
					if (err) {
						cb(err);
					}

					else if (!review) {
						cb(new sError.Service('Review.Not.Registered'));
					}

					else {
						sails.log.debug('inserReview done');
						cb(null, review);
					}
				})
			}
		], function afterwards(err, results) {
			if (err) {
				sails.log.error('Server Error:', err);
				return res.serverError(err);
			}

			else {
				sails.log.debug('all worked done!');
				sails.log.debug('results:', results[1]);
				return res.ok(results[1]);
			}
		})
	}
};
