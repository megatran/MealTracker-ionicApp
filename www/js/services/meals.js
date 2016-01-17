var app = angular.module('mealtrack.services.meals', []);

app.service("MealService", function ($q, AuthService) {
	var self = {
		'page': 0,
		'page_size': '20',
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var d = $q.defer();

			//TODO

			return d.promise;
		},
		'track': function (data) {
			self.isSaving = true;
			var d = $q.defer();

			var Meal = Parse.Object.extend("Meal");
			var user = AuthService.user;
			var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;

			var meal = new Meal();
			meal.set("owner", user);
			meal.set("picture", file);
			meal.set("title", data.title);
			meal.set("category", data.category);
			meal.set("calories", parseInt(data.calories));
			meal.set("created", new Date());

			meal.save(null, {
				success: function(meal){
					console.log('Meal tracked');
					self.results.unshift(meal);
					d.resolve(meal);
				},
				error : function(item, error) {
					$ionicPopup.alert({
						title: "Error saving meal",
						subtitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		}

	};

	return self;
});