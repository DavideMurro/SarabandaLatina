<?php
require ("../config/config.php");


$respose = false;


unset($_COOKIE["sarabandalatina_user"]);
setcookie("sarabandalatina_user", "", time()-1, "/");

$_SESSION = array();
session_destroy();


$respose = true;

echo $respose;

?>