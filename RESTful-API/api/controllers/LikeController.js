/**
 * LikeController
 *
 * @description :: Server-side logic for managing likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		var recipe = req.param('id');
		var user = req.user;

		async.series([
			function canLike(cb) {
				if (!user) {
					cb(new sError.Grant('Like.Not.Authenticated'));
				}

				Like.findOne({
					user: user.id,
					recipe: recipe,
				}).exec(function(err, like) {
					if (err) {
						cb(err);
					}

					if (like) {
						cb(new sError.Service('Like.Duplicated'));
					}

					else {
						cb(null, like);
					}
				})
			},

			function validRecipe(cb) {
				Recipe.findOne({
					id: recipe,
				}).exec(function(err, recipe) {
					if (err) {
						cb(err);
					}

					if(!recipe) {
						cb(new sError.Service('Like.Recipe.Not.Found'));
					}

					cb(null, recipe);
				})
			},

			function addLike(cb) {
				Like.create({
					user: user.id,
					recipe: recipe,
				}).exec(function(err, like) {
					if (err) {
						cb(err);
					}

					cb(null, like);
				})
			}
		], function afterwards(err, results) {
			if (err) {
				return res.serverError(err);
			}

			return res.ok(results);
		})
	},

	destroy: function(req, res) {
		var criteria = {};
		var recipe = req.param('id');
		var user = req.user;

		if (recipe) {
			criteria.recipe = recipe;
		}

		async.series([
			function canDestroy(cb) {
				if (!user) {
					cb(new sError.Grant('Like.Not.Authenticated'));
				}

				Like.findOne({
					user: user.id,
					recipe: recipe,
				}).exec(function(err, like) {
					if (err) {
						cb(err);
					}

					if (!like) {
						cb(new sError.Service('Like.Not.Found'));
					}

					else {
						cb(null, like);
					}
				})
			},

			function validRecipe(cb) {
				Recipe.findOne({
					id: recipe,
				}).exec(function(err, recipe) {
					if (err) {
						cb(err);
					}

					if(!recipe) {
						cb(new sError.Service('Like.Recipe.Not.Found'));
					}

					else {
						cb(null, recipe);
					}
				})
			},

			function destroyLike(cb) {
				Like.destroy(criteria).exec(function(err, like) {
					if (err) {
						cb(err);
					}

					else {
						cb(null, like);
					}
				})
			}
		], function afterwards(err, results) {
			if (err) {
				return res.serverError(err);
			}

			return res.ok(results);
		})
	}
};
