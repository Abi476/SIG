<?php
include('../config/db.php'); // Pastikan ini mengarah ke file konfigurasi yang benar

// Ambil input JSON
$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? $data['id'] : null; // Ambil ID dari input JSON

if ($id !== null) {
    try {
        $stmt = $pdo->prepare("DELETE FROM markers WHERE id = ?");
        $stmt->execute([$id]);

        // Cek apakah ada baris yang terpengaruh
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Marker deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Marker not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID is required']);
}