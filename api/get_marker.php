<?php
include('../config/db.php');

// Fungsi untuk merespons JSON
function jsonResponse($status, $data = null) {
    echo json_encode(['status' => $status, 'data' => $data]);
    exit();
}

try {
    // Mengambil semua marker dari database
    $stmt = $pdo->query("SELECT * FROM markers");
    $markers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Jika tidak ada marker ditemukan
    if (empty($markers)) {
        jsonResponse('success', []);
    } else {
        jsonResponse('success', $markers);
    }
} catch (PDOException $e) {
    // Menangani kesalahan saat query
    jsonResponse('error', 'Database query failed: ' . $e->getMessage());
}
