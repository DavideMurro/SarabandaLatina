<?php
require ("../config/config.php");


$response = [];
$response["status"] = false;
$response["response"] = '';


if(isset($_COOKIE["sarabandalatina_user"])) {
	$_SESSION["sarabandalatina_user"] = unserialize($_COOKIE["sarabandalatina_user"]);
}

if(isset($_SESSION["sarabandalatina_user"])) {
	//mi rifaccio il login
	$username = $_SESSION["sarabandalatina_user"]["mail"];

	$params = [$username];
	$sql = "SELECT mail, nome, cognome, livelloinizio, livellofine, admin  
			FROM utenti 
			WHERE mail = ?";
	require("query.php");

	if(!empty($rows)) {
		$row = $rows[0];

		//mi salvo lo user
		$_SESSION["sarabandalatina_user"] = $row;


		$response["status"] = true;
		$response["response"] = $_SESSION["sarabandalatina_user"];

	} else {
		$response["status"] = false;
		$response["response"] = 'Utente eliminato o inesistente';
	}

} else {
	$response["status"] = false;
	$response["response"] = 'Sessione scaduta';
}


echo json_encode($response);

?>
