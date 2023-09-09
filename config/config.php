<?php
$server = "localhost";
$username = "sarabandalatina";
$password = "sarabandalatina";
$db = "sarabandalatina";

try {
    $dbh = new PDO("mysql:host=$server;dbname=$db", $username, $password);
    $dbh->exec("set names utf8");
}
catch (PDOException $e) {
    echo "Connessione database fallita: " . $e->getMessage() . "\n";
    exit;
}
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
