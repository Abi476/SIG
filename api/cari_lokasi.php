<?php
// Buat koneksi ke database
$mysqli = new mysqli('localhost', 'root', '', 'sig');

// Periksa koneksi
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Ambil istilah pencarian dari POST dan hindari SQL Injection
$searchTerm = isset($_POST['searchTerm']) ? trim($mysqli->real_escape_string($_POST['searchTerm'])) : '';

// Siapkan pernyataan SQL dengan parameter LIKE
$stmt = $mysqli->prepare("SELECT * FROM markers WHERE name = ?");
$searchTermLike = '%' . $searchTerm . '%';
$stmt->bind_param('ss', $searchTermLike, $searchTermLike);

// Eksekusi pernyataan
$stmt->execute();
$result = $stmt->get_result();
$output = '';

// Proses hasil pencarian
while ($row = $result->fetch_assoc()) {
    // Ambil lat_long dan pisahkan menjadi latitude dan longitude
    $latlong = str_replace(['LatLng(', ')'], '', $row['lat_long']);
    list($lat, $lng) = array_map('trim', explode(',', $latlong));
    // Buat output untuk setiap lokasi yang ditemukan
    $output .= sprintf(
        '<a href="#" class="list-group-item list-group-item-action" data-lat="%s" data-lng="%s">%s</a>',
        htmlspecialchars($lat, ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($lng, ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($row['nama_tempat'], ENT_QUOTES, 'UTF-8')
    );
}

// Jika tidak ada hasil ditemukan, tampilkan pesan
if (empty($output)) {
    $output = '<p class="list-group-item">No results found.</p>';
}

// Kirim output ke klien
echo $output;

// Tutup pernyataan dan koneksi
$stmt->close();
$mysqli->close();