<?php
require ("../config/config.php");


$user = $_SESSION["sarabandalatina_user"];


$response = [];
$response["status"] = false;
$response["response"] = '';


$params = [$user["livelloinizio"], $user["livellofine"]];
$sql = "SELECT DISTINCT livello, COUNT(titolo) as numero_video 
		FROM tabella_file 
		WHERE livello >= ? AND livello <= ? 
		GROUP BY livello 
		ORDER BY livello DESC";
require("query.php");

if(!empty($rows)) {
	$response = [];
	$response["status"] = true;
	$response["response"] = $rows;
} else {
	$response = [];
	$response["status"] = false;
	$response["response"] = 'Nessun livello disponibile!';
}


echo json_encode($response);

?>
