<?php
include('../config/db.php');

// Fungsi untuk merespons JSON
function jsonResponse($status, $message) {
    echo json_encode(['status' => $status, 'message' => $message]);
    exit();
}

// Validasi jika semua field ada
if (!isset($_POST['name'], $_POST['description'], $_POST['latitude'], $_POST['longitude']) || empty($_FILES['photo']['name'])) {
    jsonResponse('error', 'All fields are required.');
}

// Mengambil dan membersihkan input
$name = htmlspecialchars($_POST['name']);
$description = htmlspecialchars($_POST['description']);
$latitude = floatval($_POST['latitude']);
$longitude = floatval($_POST['longitude']);

// Validasi file gambar
$photo = $_FILES['photo']['name'];
$photoTmpName = $_FILES['photo']['tmp_name'];
$photoSize = $_FILES['photo']['size'];
$photoError = $_FILES['photo']['error'];
$photoExt = strtolower(pathinfo($photo, PATHINFO_EXTENSION));

$allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
$maxFileSize = 2 * 1024 * 1024; // 2MB limit

// Validasi ekstensi file
if (!in_array($photoExt, $allowedExt)) {
    jsonResponse('error', 'Only JPG, JPEG, PNG, and GIF files are allowed.');
}

// Validasi ukuran file
if ($photoSize > $maxFileSize) {
    jsonResponse('error', 'File size must be less than 2MB.');
}

// Cek jika terjadi kesalahan saat upload
if ($photoError !== 0) {
    jsonResponse('error', 'There was an error uploading the file.');
}

// Siapkan direktori target
$target_dir = "../uploads/";
$target_file = $target_dir . uniqid('', true) . "." . $photoExt; // Menghindari nama file ganda

// Pindahkan file upload ke direktori target
if (move_uploaded_file($photoTmpName, $target_file)) {
    // Simpan data ke database
    $stmt = $pdo->prepare("INSERT INTO markers (name, description, latitude, longitude, photo) VALUES (?, ?, ?, ?, ?)");
    
    // Eksekusi query
    if ($stmt->execute([$name, $description, $latitude, $longitude, basename($target_file)])) {
        jsonResponse('success', 'Marker added successfully');
    } else {
        jsonResponse('error', 'Failed to save marker to database.');
    }
} else {
    jsonResponse('error', 'File upload failed.');
}
