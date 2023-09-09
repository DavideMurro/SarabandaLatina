<?php
require ("../config/config.php");


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
if(isset($request->livello)) {
	$livello = $request->livello;
} else {
	$livello = null;
}


$response = [];
$response["status"] = false;
$response["response"] = '';


$where = "";
if($livello) {
	$params = [$livello];
	$where = "WHERE livello=?";
}

$sql = "SELECT * FROM tabella_file 
		$where 
		ORDER BY id ASC";
require("query.php");

if(!empty($rows)) {
	$response = [];
	$response["status"] = true;
	$response["response"] = $rows;
} else {
	$response = [];
	$response["status"] = false;
	$response["response"] = 'Nessun video disponibile per questo livello!';
}


echo json_encode($response, JSON_NUMERIC_CHECK);

?>
