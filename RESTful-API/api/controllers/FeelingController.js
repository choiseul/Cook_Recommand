/**
 * FeelingController
 *
 * @description :: Server-side logic for managing feelings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addRecipe: function (req, res) {
		var feelingId = req.param('id');
		var recipeId = req.param('recipe');

		async.series([
			function insertFeeling (cb) {
				Feeling.findOne({
					id: feelingId,
				}).exec(function(err, feeling) {
					if (err) {
						cb(err);
					}

					feeling.recipes.add(recipeId);
					feeling.countRecipes++;

					feeling.save(function(err, feeling) {
						if (err) {
							cb(err);
						}

						cb(null, feeling);
					})
				})
			},
		], function afterwards(err, results) {
			if (err) {
				return res.negotiate(err);
			}

			return res.ok(results);
		})
	},

	removeRecipe: function(req, res) {
		var feelingId = req.param('id');
		var recipeId = req.param('recipe');

		async.series([
			function detachFeeling (cb) {
				Feeling.findOne({
					id: feelingId,
				}).exec(function (err, feeling) {
					feeling.recipes.remove(recipeId);
					feeling.countRecipes--;

					feeling.save(function(err, feeling) {
						if (err) {
							cb(err);
						}

						cb(null, feeling);
					})
				})
			},
		], function afterwards(err, results) {
			if (err) {
				return res.negotiate(err);
			}

			return res.ok(results);
		})
	},

	deleteAll: function(req, res) {
		Feeling.destroy().exec(function (err, destroyed) {
			return res.ok(destroyed);
		})
	},

	count: function(req, res) {
		Feeling.count().exec(function (err, num) {
			if (err) {
				return res.negotiate(err);
			}

			return res.ok("num: " + num);
		})
	},
};
