<?php
require ("../config/config.php");


$file_dati = json_decode($_POST['file_dati']);
if(isset($_POST['control'])) {
	$control = $_POST['control'];
} else {
	$control = false;
}

$location = '../file/';

$user = $_SESSION["sarabandalatina_user"];


$response = [];
$response["status"] = false;
$response["response"] = '';


if($user["admin"] == 1) {
	if($control == '1') {
        
		$filename = $_FILES['file']['name'];
		$fileext = pathinfo($filename, PATHINFO_EXTENSION);
		$filesize = $_FILES['file']['size'];
		$filetype = $_FILES['file']['type'];
        /*
        // chiamo il file con data  e ora per univocizzare
        $d = new DateTime();	
        $filename = $d->format('Y_m_d_H_i_s') . ".$fileext";
        */
        
		$move = move_uploaded_file($_FILES['file']['tmp_name'],$location.$filename);


		if($move) {
			$params = [$file_dati->titolo, $file_dati->livello, $filename, $filetype, $filesize, $file_dati->titolo, $file_dati->livello];
			$sql = "INSERT INTO tabella_file
				(titolo, livello, nome, tipo, size)
				VALUES
				(?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE titolo = ?, livello = ?";
			require("query.php");

			$response["status"] = true;
			$response["response"] = $insert;

		} else {
			$response["status"] = false;
			$response["response"] = 'Caricamento file fallito';
		}

	} elseif($control == '2') {
		$params = [$file_dati->titolo, $file_dati->livello, $file_dati->id];
		$sql = "UPDATE tabella_file 
				SET titolo = ?, livello = ? 
				WHERE id = ?";
			require("query.php");

		$response["status"] = true;
		$response["response"] = $update;

	} elseif($control == '3') {
		$path = $location.$file_dati->nome;
		$del = unlink($path);

		if($del) {
			$params = [$file_dati->id];
			$sql = "DELETE FROM tabella_file
					WHERE id = ?";
			require("query.php");

			$response["status"] = true;
			$response["response"] = $delete;
		} else {

			$response["status"] = false;
			$response["response"] = 'Eliminazione fallita';
		}
	}

} else {
	$response["status"] = false;
	$response["response"] = 'Non sei admin';
}


echo json_encode($response);


?>
