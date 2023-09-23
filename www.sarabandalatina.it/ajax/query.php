<?php
$stmt = $dbh->prepare($sql);
if(isset($params) && $params) {
	$stmt->execute($params);
} else {
	$stmt->execute();
}

//Controllo che tipo di query è per sapere cosa restituire
$command = explode(' ',trim($sql))[0];

if($command == "SELECT") {
	$rows = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$rows[] = $row;
	}
}

if($command == "INSERT") {
	if($stmt->rowCount() > 0) {
		$insert = $dbh->lastInsertId();
	}
}

if($command == "UPDATE") {
	$update = $stmt->rowCount();
}

if($command == "DELETE") {
	$delete = $stmt->rowCount();
}

?>