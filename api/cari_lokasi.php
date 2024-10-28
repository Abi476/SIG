<?php
$mysqli = mysqli_connect('localhost', 'root', '', 'marker');
if (!$mysqli) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

$searchTerm = $_POST['searchTerm'];

$tampil = mysqli_query($mysqli, "SELECT * FROM lokasi WHERE nama_tempat LIKE '%$searchTerm%' OR keterangan LIKE '%$searchTerm%'");
if (!$tampil) {
    die("Query gagal: " . mysqli_error($mysqli));
}

$output = '';
while ($hasil = mysqli_fetch_array($tampil)) {
    $latlong = str_replace(['LatLng(', ')'], '', $hasil['lat_long']);
    $coordinates = explode(',', $latlong);
    $lat = trim($coordinates[0]);
    $lng = trim($coordinates[1]);

    $output .= '<a href="#" class="list-group-item list-group-item-action" data-lat="' . $lat . '" data-lng="' . $lng . '">' . $hasil['nama_tempat'] . '</a>';
}

echo $output;

mysqli_close($mysqli);
?>