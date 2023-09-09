<?php
require ("../config/config.php");


$user = $_SESSION["sarabandalatina_user"];


$response = [];
$response["status"] = false;
$response["response"] = '';


//if($user["admin"] == 1) {
	$sql = "SELECT * FROM utenti ORDER BY cognome";
	require("query.php");

	$response["status"] = true;
	$response["response"] = $rows;
/*
} else {
	$response["status"] = false;
	$response["response"] = 'Non sei admin';
}
*/



echo json_encode($response, JSON_NUMERIC_CHECK);

?>
