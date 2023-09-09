var app = angular.module('sarabandalatina');
app.controller("livelli", function($scope, $http, $mdDialog, $rootScope, httpPreConfig, $mdToast, $localStorage) {
	$scope.livelli = [];
	
    
	$scope.select_livelli_utente = function() {
		$http({
			method : "POST",
			url : url + 'ajax/select_livelli_utente.php'
		}).then(
			function success(response) {
				if(response.data.status) {
					$scope.livelli = response.data.response;
				}
				else {
					$rootScope.alert_warning(response.data.response);
				}
				$scope.select_livelli_utente_completed = true;
			}, 
			function error(response) {
				$rootScope.alert_error(response.statusText + " Errore select_lvelli_utente!");
				$scope.select_livelli_utente_completed = true;
			}
		);
	}

	$scope.select_file = function(item) {
		var livello = item.livello;

		$http({
			method : "POST",
			url : url + 'ajax/select_file.php',
			data : {
				livello: livello
			}
		}).then(
			function success(response) {
				if(response.data.status) {
					item.videos = response.data.response;
				}
				else {
					$rootScope.alert_warning(response.data.response);
				}
			}, 
			function error(response) {
				$rootScope.alert_error(response.statusText + " Errore select_lvelli_utente!");
			}
		);
	}
    
    $scope.controlla_videos_switch = function() {
        var esiste = false;
    	angular.forEach($scope.livelli, function(value, key) {
          	//console.log(key, value);
          	if(value.videos_switch) {
            	esiste = true;
            }
        });
        
        return esiste;
    }

});