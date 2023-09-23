<?php
require ("../config/config.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$username = $request->username;
$password = $request->password;
if(isset($request->ricordami)) {
	$ricordami = $request->ricordami;
} else {
	$ricordami = false;
}



$response = [];
$response["status"] = false;
$response["response"] = '';

$params = [$username, $password];
$sql = "SELECT mail, nome, cognome, livelloinizio, livellofine, admin, count_login 
		FROM utenti 
		WHERE mail = ? AND password = ?";
require("query.php");

if(!empty($rows)) {
	$row = $rows[0];
	$row["count_login"] = intVal($row["count_login"]) + 1;

	//mi salvo lo user
	$_SESSION["sarabandalatina_user"] = $row;
	if($ricordami) {
		setcookie("sarabandalatina_user", serialize($row), time() + (86400*365), "/"); // 86400 = 1 day
	} else {
		unset($_COOKIE["sarabandalatina_user"]);
		setcookie("sarabandalatina_user", "", time()-1, "/");
	}

	// aumento il count del login!
	$params = [$row["count_login"], $row["mail"]];
	$sql = "UPDATE utenti
			SET count_login = ?
			WHERE mail = ?";
	require("query.php");


	$response = [];
	$response["status"] = true;
	$response["response"] = $row;
} else {
	$response = [];
	$response["status"] = false;
	$response["response"] = 'Login errato!';
}


echo json_encode($response);

?>
