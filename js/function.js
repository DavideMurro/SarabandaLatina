var app = angular.module('sarabandalatina', ['ngMaterial', 'ngStorage']);

app.factory('httpPreConfig', ['$http', '$rootScope', function($http, $rootScope, $localStorage) {
	$http.defaults.transformRequest.push(function (data) {
		$rootScope.$broadcast('httpCallStarted');
		return data;
	});
	$http.defaults.transformResponse.push(function(data){
		$rootScope.$broadcast('httpCallStopped');
		return data;
	})
	return $http;
}]);


app.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
		return new Date(date).toLocaleDateString();
	};
});
app.directive('mdDatepicker', function () {
	function link(scope, element, attrs, ngModel) {
		var parser = function (val) {
			//val = new Date(val).toLocaleDateString();
			val = new Date(val);
			val = new Date(Date.UTC(val.getFullYear(), val.getMonth(), val.getDate(), val.getHours(), val.getMinutes(), val.getSeconds()));
			return val;
		};
		var formatter = function (val) {
			if (!val || val == "00-00-0000") {
				//return val;
			} else if(typeof val === 'object') { 
				return val;
			} else {
				val = val.split("-");
				val = new Date(val[2], val[1]-1, val[0]);
				return val;
			}
		};
		ngModel.$parsers.push(parser);
		ngModel.$formatters.push(formatter);
	}
	return {
		require: 'ngModel',
		link: link,
		restrict: 'EA',
		priority: 1
	}
});

app.directive('scroll', [function() {
	return {
		link: function (scope, elem, attrs) {
			elem.on('scroll', function (e) {
				if($(elem).scrollTop() + $(elem).innerHeight() >= $(elem)[0].scrollHeight) {
					var scope = angular.element($(elem)).scope();
					scope.$apply(function(){
						scope[attrs.rubrica].limit += scope.limit;
					})
				}
			});
		}
	}
}]);

app.directive('elemReady', function( $parse ) {
	return {
		restrict: 'A',
		link: function( $scope, elem, attrs ) {    
			elem.ready(function(){
			$scope.$apply(
				function(){
					var func = $parse(attrs.elemReady);
					func($scope);
				})
			})
		}
	}
});

app.controller("start", function($scope, $http, $mdDialog, $rootScope, httpPreConfig, $mdToast, $localStorage) {
	$rootScope.limit = 20;
	$rootScope.minDate = new Date();


	$scope.login_controlla = function() {
		$http({
			method : "POST",
			url : url + 'ajax/login_controlla.php'
		}).then(
			function success(save) {
				if(save.data.status) {
					$scope.utente = save.data.response;
				}
				else {
					// $rootScope.alert_error(save.data.response);
					// window.location = "index.html";
					$scope.utente = null;
				}
                $scope.login_controlla_completed = true;
			}, 
			function error(response) {
				// $rootScope.alert_error(response.statusText + " \n\n Non c'è connessione!");
				// $scope.logout();
				$scope.utente = null;
                $scope.login_controlla_completed = true;
			}
		);
	}
	$scope.login_controlla();

	$scope.logout = function() {
		$http({
			method : "POST",
			url : url + 'ajax/logout.php'
		}).then(function success(save) {
			if(save.data) {
				$scope.utente = null;
				localStorage.clear();
				window.location = "index.html";
			}
			else {
				$rootScope.alert_error("Logout fallito");
			}

		}, function error(response) {
			// $rootScope.alert_error(response.statusText + " \n\n Non c'è connessione!");
			window.location = "index.html";
		});
	}
	// LOCATION
	$scope.get_page = function() {
		return document.location.pathname.match(/[^\/]+$/)[0];
	};


	// salvo nel localstorage l apertura del menu
	$scope.set_menu_operazioni = function(menu_operazioni) {
		$localStorage.menu_operazioni = menu_operazioni;
	};

	$rootScope.go_to = function(path) {
		location.href = path;
	}


	// per ng-repeat un numero di volte pari a quanto passi nella funzione (ng-repeat="i in range(n, d)")
	$rootScope.range = function(n, divisore) {
		if(n) {
			n = parseInt(n / divisore);
			if(n < 1) {
				n = 1;
			}
		} else {
			n = 0;
		}
		return new Array(n);
	};


	$rootScope.alert_error = function(text) {
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('Errore! :(')
				.textContent(text)
				.ariaLabel('Alert Dialog Demo')
				.ok('Ok!')
		);
	}
	$rootScope.alert_warning = function(text) {
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('Attenzione!')
				.textContent(text)
				.ariaLabel('Alert Dialog Demo')
				.ok('Ok!')
		);
	}
	$rootScope.alert_success = function(text) {
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('Completato!')
				.textContent(text)
				.ariaLabel('Alert Dialog Demo')
				.ok('Ok!')
		);
	}


	var last = {
		bottom: false,
		top: true,
		left: false,
		right: true
	};
  
	$scope.toastPosition = angular.extend({},last);
	$scope.getToastPosition = function() {
		sanitizePosition();

		return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
	};
	function sanitizePosition() {
	  var current = $scope.toastPosition;
  
	  if ( current.bottom && last.top ) current.top = false;
	  if ( current.top && last.bottom ) current.bottom = false;
	  if ( current.right && last.left ) current.left = false;
	  if ( current.left && last.right ) current.right = false;
  
	  last = angular.extend({},current);
	}
	$rootScope.toast = function(text) {
		var pinTo = $scope.getToastPosition();
		$mdToast.show(
			$mdToast.simple()
			.textContent(text)
			.position(pinTo )
			.hideDelay(3000)
		);
	}

});
app.directive('ngFocusWait', function($timeout) {
	return {
		link: function (scope, element, attrs) {
			//consiglio di rinominare la function....
			scope.$watch(attrs.ngFocusWait, function (val) {
				if (angular.isDefined(val) && val) {
					$timeout(function () {element[0].focus();}, 200);
				}
			}, true);

			element.bind('blur', function () {
				if (angular.isDefined(attrs.ngFocusWaitLost)) {
					scope.$apply(attrs.ngFocusWaitLost);
				}
			});
		}
	};
});
// per tenere il menu mdFabSpeedDialDirective bloccato aperto
app.config( $provide => { 
	$provide.decorator('mdFabSpeedDialDirective', ($delegate, $controller) => {
		let directive = $delegate[0];

		let controllerName = directive.controller;

		directive.controller = (['$scope', '$element', '$animate', '$mdUtil', '$mdConstant', ($scope, $element, $animate, $mdUtil, $mdConstant) => {

			let controller = $controller(controllerName, {$scope : $scope, $element : $element, $animate : $animate, $mdUtil : $mdUtil, $mdConstant : $mdConstant});
			controller.close = () => {return};
			return controller;
		}]);

		return $delegate;
	});
});

app.filter('filter_rubrica', function() {
	return function(righe, filtri_columns, filtri_model, search, limit) {
		var filtered = new Array();
		if (!righe) return filtered;
		angular.forEach(righe, function(item, key) {

			if (limit && filtered.length == limit) return;

			var filtri_ok = true;
			if (filtri_model) angular.forEach(filtri_model, function(filtro, nome_filtro) {
				if (!filtri_ok) return;
				if (filtro != -1 && item[nome_filtro] != filtro) filtri_ok = false;
			});

			if (filtri_ok) {
				if (filtri_columns && search && search != "") {
					filtri_ok = false;
					angular.forEach(filtri_columns, function(column, nome_column) {
						if (!column.visible || filtri_ok) return;
						if (item[nome_column].toLowerCase().indexOf(search.toLowerCase()) != -1) filtri_ok = true;
					});
					if (filtri_ok) filtered.push(item);
				} else {
					filtered.push(item);
				}
			}
		});
		return filtered;
	};
});

Number.prototype.format = function(n, x, s, c) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
		num = this.toFixed(Math.max(0, ~~n));

	return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


// dialog
function DialogController($scope, $mdDialog, message) {
	$scope.message = message;

	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}

