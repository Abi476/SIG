<?php
include('../config/db.php');

$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

$stmt = $pdo->prepare("UPDATE markers SET name = ?, description = ?, latitude = ?, longitude = ? WHERE id = ?");
$stmt->execute([$name, $description, $latitude, $longitude, $id]);

echo json_encode(['status' => 'success', 'message' => 'Marker updated successfully']);