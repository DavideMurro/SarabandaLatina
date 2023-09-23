var app = angular.module('sarabandalatina');
app.controller("gestione_utenti", function($scope, $http, $mdDialog, $rootScope) {
	$scope.mindate = new Date();

	$scope.select_utenti = function() {
		$rootScope.pl_loading = true;

		$http({
            method : "POST",
            url : url + 'ajax/select_utenti.php',
        }).then(
            function success(response) {
                if(response.data.status) {
					$scope.utenti = response.data.response;
                } else {
                    $rootScope.alert_warning(response.data.response);
                }
				$rootScope.pl_loading = false;
            }, 
            function error(response) {
                $rootScope.alert_error(response.statusText);
				$rootScope.pl_loading = false;
            }
        );
	}

	$scope.insert_utente = function(utente, del) {
		$rootScope.pl_loading = true;

		if(utente.mail && utente.password) {
			$http({
	            method : "POST",
	            url : url + 'ajax/insert_utente.php',
	            data: {
	            	utente : utente,
	            	delete : del,
	            }
	        }).then(
	            function success(response) {
	                if(response.data.status) {
	                    $rootScope.toast("Operazione avvenuta con successo!");

	                    $scope.utente_new = {};
	                    $scope.select_utenti();
	                } else {
	                    $rootScope.alert_warning(response.data.response);
	                }
					$rootScope.pl_loading = false;
	            }, 
	            function error(response) {
	                $rootScope.alert_error(response.statusText);
					$rootScope.pl_loading = false;
	            }
	        );

		} else {
			$rootScope.alert_warning("Inserisci tutti i campi babbione!");
			$rootScope.pl_loading = false;
		}
	}
    

});
