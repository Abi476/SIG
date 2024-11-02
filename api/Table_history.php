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
        $markerId = (int) $markerId;

        try {
            // Persiapkan pernyataan SQL untuk menghapus marker
            $stmt = $pdo->prepare("DELETE FROM markers WHERE id = :id");
            $stmt->bindParam(':id', $markerId, PDO::PARAM_INT);

            // Eksekusi pernyataan SQL
            if ($stmt->execute()) {
                // Jika marker berhasil dihapus, ambil data marker yang dihapus untuk history
                $historyStmt = $pdo->prepare("SELECT * FROM markers WHERE id = :id");
                $historyStmt->bindParam(':id', $markerId, PDO::PARAM_INT);
                $historyStmt->execute();

                // Ambil data marker untuk disimpan dalam history
                $markerData = $historyStmt->fetch(PDO::FETCH_ASSOC);
                
                // Hanya insert ke history jika data marker ditemukan
                if ($markerData) {
                    $historyInsertStmt = $pdo->prepare("INSERT INTO marker_history (marker_id, action, name, description, latitude, longitude, photo) 
                                                        VALUES (:marker_id, 'delete', :name, :description, :latitude, :longitude, :photo)");
                    $historyInsertStmt->bindParam(':id', $Id, PDO::PARAM_INT);
                    $historyInsertStmt->bindParam(':name', $markerData['name']);
                    $historyInsertStmt->bindParam(':description', $markerData['description']);
                    $historyInsertStmt->bindParam(':latitude', $markerData['latitude']);
                    $historyInsertStmt->bindParam(':longitude', $markerData['longitude']);
                    $historyInsertStmt->bindParam(':photo', $markerData['photo']);
                    $historyInsertStmt->execute();
                }

                // Ambil semua data dari tabel marker_history
                $historyFetchStmt = $pdo->prepare("SELECT * FROM marker_history");
                $historyFetchStmt->execute();
                $historyData = $historyFetchStmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode(['status' => 'success', 'message' => 'Marker berhasil dihapus', 'history' => $historyData]);
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
