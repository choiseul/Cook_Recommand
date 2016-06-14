/**
 * RecipeController
 *
 * @description :: Server-side logic for managing recipes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * Recipe RESTful API Get
	 * API Route: GET /recipe?skip=0&limit=30&where={}&sort=id ASC
	 */
	// find: function(req, res) {
	// 	sails.log.debug("recipe find request");
	// 	async.waterfall([
	// 		function findRecipes(cb) {
	// 			var criteria = {
	// 				skip: parseInt(req.query.skip)		|| 0,
	// 				limit: parseInt(req.query.limit)	|| 30,
	// 				sort: req.query.sort				|| 'id ASC',
	// 				where: req.query.where
	// 			};
	//
	// 			// string to JSON
	// 			if (criteria.where) {
	// 				try {
	// 					criteria.where = JSON.parse(criteria.where);
	// 				}
	// 				catch (err) {
	// 					cb (err);
	// 				}
	// 			}
	//
	// 			else {
	// 				delete criteria.where;
	// 			}
	//
	// 			var query = Recipe.find(criteria);
	//
	// 			query.populate('thumbnail')
	// 			.populate('feelings').exec(function(err, recipes) {
	// 				if (err) {
	// 					cb(err);
	// 				}
	//
	// 				cb(null, recipes);
	// 			})
	// 		},
	//
	// 		function matchLikes(recipes, cb) {
	// 			if (!req.user) {
	// 				cb(null, recipes);
	// 			}
	//
	// 			async.forEachOf(recipes, eachRecipe, done);
	//
	// 			function eachRecipe(recipe, index, cb) {
	// 				Like.findOne({
	// 					user: user.id,
	// 					recipe: recipe.id,
	// 				}).exec(function(err, like) {
	// 					if (err) {
	// 						cb(err);
	// 					}
	//
	// 					if (like) {
	// 						recipes[index].wasLiked = like.id;
	// 					}
	//
	// 					cb();
	// 				})
	// 			}
	//
	// 			function done(err) {
	// 				cb(err, recipes);
	// 			}
	// 		}
	// 	], function afterwards(err, results) {
	// 		if (err) {
	// 			return res.negotiate(err);
	// 		}
	//
	// 		return res.ok(results);
	// 	})
	// },

	find: function(req, res) {
		Recipe.find({
			skip: parseInt(req.query.skip)		|| 0,
			limit: parseInt(req.query.limit)	|| 30,
			sort: req.query.sort				|| 'id ASC',
			where: req.query.where
		}).populate('feelings').exec(function(err, recipes) {
			return res.ok(recipes);
		})
	},

	/**
	 * Recipe RESTful API Get One
	 * API Route: GET /recipe/:recipeId
	 */
	findOne: function(req, res) {
		var user = req.user;
        if (!user) {
            return res.forbidden();
        }
		async.series([
			function findRecipe(cb) {
				Recipe.findOne({
					id: req.param('id'),
				}).populateAll().exec(function(err, recipe) {
					if (err) {
						cb(err);
					}

					if (true) {
						Like.findOne({
							user: user.id,
							recipe: recipe.id,
						}).exec(function (err, like) {
							if (err) {
								cb(err);
							}

							if (like) {
								recipe.wasLiked = like.id;
							}

							cb(null, recipe);
						})
					}
				})
			}
		], function afterwards(err, results) {
			if (err) {
				sails.log.error('recipe findOne error:', err);
				return res.serverError(err);
			}

			sails.log.debug('recipe findOne Success:', results);
			return res.ok(results);
		})
	},

	/**
	 * Recipe RESTful API Get associations
	 * API Route: GET /recipe/:recipeId/reviews
	 */
	findReviews: function(req, res) {
		var recipeId = req.param('id');

		sails.log.debug("start findReviews");
		sails.log.debug("recipeId:", recipeId);

		if (!recipeId) {
			return req.notFound();
		}

		async.series([
			function bringReviews(cb) {
				Review.find({
					recipe: recipeId,
				}).populate('author').exec(function(err, reviews) {
					if (err) {
						cb(err);
					}

					cb(null, reviews);
				})
			}
		], function afterwards(err, results) {
			if (err) {
				sails.log.error("something wrong at findReviews:", err);

				return res.negotiate(err);
			}

			sails.log.debug("successfully findReviews responded: ", results[0]);

			return res.ok(results[0]);
		})
	},

	count: function(req, res) {
		Recipe.count().exec(function (err, num) {
			if (err) {
				return res.negotiate(err);
			}

			return res.ok("num: " + num);
		})
	},

	countRecipesWithFeeling: function(req, res) {
		Recipe.find().populate('feelings', {label: 'sweety'}).exec(function (err, recipes) {
			if (err) {
				return res.negotiate(err);
			}
			var result = 0;

			recipes.forEach(function (recipe, idx) {
					result++;
			})

			//return res.ok("num: " + result);
			return res.ok(recipes);
		})
	}

};
