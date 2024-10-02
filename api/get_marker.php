<?php
include('../config/db.php');

$stmt = $pdo->query("SELECT * FROM markers");
$markers = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($markers);