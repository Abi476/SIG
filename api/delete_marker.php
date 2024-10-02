<?php
header('Content-Type: application/json');
include 'db_connection.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $markerId = $data['id'];

    if ($markerId) {
        // Prepare your SQL statement
        $stmt = $conn->prepare("DELETE FROM markers WHERE id = ?");
        $stmt->bind_param("i", $markerId);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Marker ID missing']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
