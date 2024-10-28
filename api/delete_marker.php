<?php
header('Content-Type: application/json');
include('../config/db.php'); // Sertakan file koneksi

// Pastikan metode request adalah DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Ambil data dari body request
    $data = json_decode(file_get_contents("php://input"), true);
$markerId = $data['id'] ?? null;
    
    // Cek apakah markerId dikirim
    if (isset($data['id']) && !empty($data['id'])) {
// Konversi ke integer untuk keamanan
        
        try {
            // Persiapkan pernyataan SQL untuk menghapus marker
            $stmt = $pdo->prepare("DELETE FROM markers WHERE id = :id");
            $stmt->bindParam(':id', $markerId, PDO::PARAM_INT);

            // Eksekusi pernyataan SQL
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Marker berhasil dihapus']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Kesalahan saat menghapus marker']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Kesalahan database: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Marker ID tidak ditemukan']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid']);
}

// Tidak perlu menutup koneksi PDO secara eksplisit, akan ditutup secara otomatis saat skrip selesai.
?>
