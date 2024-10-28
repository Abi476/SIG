<?php
include('../config/db.php');

// Validate and sanitize user input data
$data = json_decode(file_get_contents("php://input"), true);

$id = filter_var($data['id'], FILTER_VALIDATE_INT);
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$description = filter_var($data['description'], FILTER_SANITIZE_STRING);
$latitude = filter_var($data['latitude'], FILTER_VALIDATE_FLOAT);
$longitude = filter_var($data['longitude'], FILTER_VALIDATE_FLOAT);

if (!$id || !$name || !$description || !$latitude || !$longitude) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
    exit;
}

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("UPDATE markers SET name = ?, description = ?, latitude = ?, longitude = ? WHERE id = ?");
    $stmt->execute([$name, $description, $latitude, $longitude, $id]);
    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Marker updated successfully']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => 'Failed to update marker: ' . $e->getMessage()]);
}
?>
