var app = angular.module('sarabandalatina');
app.controller("gestione_file", function($scope, $http, $mdDialog, $rootScope) {
	$scope.mindate = new Date();

	$scope.select_file = function() {
		$rootScope.pl_loading = true;

   		$scope.files = [];
        
		$http({
            method : "POST",
            url : url + 'ajax/select_file.php',
        }).then(
            function success(response) {
                if(response.data.status) {
					$scope.files = response.data.response;
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

	$scope.insert_file = function(file_dati, control) {
		$rootScope.pl_loading = true;

		var fd = new FormData();
	  	var file = document.getElementById('file').files[0];
	  	fd.append('file', file);
	  	fd.append('file_dati', JSON.stringify(file_dati));
	  	fd.append('control', control);

		if(file_dati) {
			$http({
	            method : "POST",
	            url : url + 'ajax/insert_file.php',
	            data: fd,
   				headers: {'Content-Type': undefined},
	        }).then(
	            function success(response) {
	                if(response.data.status) {
	                    $rootScope.toast("Operazione avvenuta con successo!");

	                    $scope.file_new = {};
	                    $scope.select_file();
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
