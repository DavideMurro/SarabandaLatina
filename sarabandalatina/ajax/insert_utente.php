<?php
require ("../config/config.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$utente = $request->utente;
if(isset($request->delete)) {
	$delete = $request->delete;
} else {
	$delete = false;
}

$user = $_SESSION["sarabandalatina_user"];


$response = [];
$response["status"] = false;
$response["response"] = '';


if($user["admin"] == 1) {
	if(!$delete) {
		$params = [$utente->mail, $utente->password, $utente->livelloinizio, $utente->livellofine, $utente->nome, $utente->cognome, $utente->count_login, $utente->password, $utente->livelloinizio, $utente->livellofine, $utente->nome, $utente->cognome, $utente->count_login];
		$sql = "INSERT INTO utenti
			(mail, password, livelloinizio, livellofine, nome, cognome, count_login)
			VALUES
			(?, ?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE password = ?, livelloinizio = ?, livellofine = ?, nome = ?, cognome = ?, count_login = ?";
		require("query.php");

		$response["status"] = true;
		$response["response"] = $utente->mail;

	} else {
		$params = [$utente->mail];
		$sql = "DELETE FROM utenti
				WHERE mail = ?";
		require("query.php");

		$response["status"] = true;
		$response["response"] = $delete;
	}

} else {
	$response["status"] = false;
	$response["response"] = 'Non sei admin';
}


echo json_encode($response);

?>
