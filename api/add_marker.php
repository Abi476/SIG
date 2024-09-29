<?php
include('../config/db.php');

$name = $_POST['name'];
$description = $_POST['description'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$photo = $_FILES['photo']['name'];

$target_dir = "../uploads/";
$target_file = $target_dir . basename($photo);

if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
    $stmt = $pdo->prepare("INSERT INTO markers (name, description, latitude, longitude, photo) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $description, $latitude, $longitude, $photo]);

    echo json_encode(['status' => 'success', 'message' => 'Marker added successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'File upload failed']);
}