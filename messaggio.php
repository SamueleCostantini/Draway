<?php
$host="localhost";
$user="root";
$pass="";
$db="my_draway";
$conn= new mysqli($host,$user,$pass,$db);
if($conn->connect_errno!=0){
    die("non connesso");
}
if(!isset($_GET['mail'])){die("Campo mail vuoto!. Devi inserire un indirizzo mail per ottenere una risposta!<br><a href='index.html'>Torna alla home-></a>");}
$mail=$_GET['mail'];
$messaggio=$_GET['messaggio'];
$mail = trim($mail);

$query="INSERT INTO utente(mail, messaggio) VALUES ('$mail','$messaggio') ";
//
if ($conn->query($query) === TRUE) {
    echo "Messaggio inviato! Provvederemo a rispondere al piu presto. Controlla la tua casella Email!<br><a href='index.html'>Torna alla home-></a>";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}

$conn->close();
?>