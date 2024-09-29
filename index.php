<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIG dengan Leaflet</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
</head>
<body>
    <div id="map"></div>

    <!-- Form untuk menambah marker -->
    <form id="addMarkerForm" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Nama Marker">
        <textarea name="description" placeholder="Deskripsi"></textarea>
        <input type="text" name="latitude" placeholder="Latitude">
        <input type="text" name="longitude" placeholder="Longitude">
        <input type="file" name="photo">
        <button type="submit">Tambah Marker</button>
    </form>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
