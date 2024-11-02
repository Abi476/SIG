<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi Geografis</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="assets/css/styles.css">
    <style>
        .custom-alert {
            display: none;
            transition: opacity 0.5s;
            opacity: 0;
            margin: 20px 0;
        }
        .custom-alert.visible {
            display: block;
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center mt-4">Sistem Informasi Geografis</h1>
        <div id="customAlert" class="custom-alert alert alert-info"></div>

        <div class="row mt-4">
            <div class="col-md-6">
                <div id="map" style="height: 500px;"></div> <!-- Peta -->
            </div>
            <div class="col-md-6">
                <form id="addMarkerForm" enctype="multipart/form-data" class="mt-3">
                    <div class="mb-3">
                        <input type="text" name="name" class="form-control" placeholder="Nama Marker" required>
                    </div>
                    <div class="mb-3">
                        <textarea name="description" class="form-control" placeholder="Deskripsi" required></textarea>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="latitude" id="latitude" class="form-control" placeholder="Latitude" required readonly>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="longitude" id="longitude" class="form-control" placeholder="Longitude" required readonly>
                    </div>
                    <div class="mb-3">
                        <input type="file" name="photo" class="form-control">
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary">Tambah Marker</button>
                    </div>
                </form>
                
                <form id="searchForm" class="mt-3">
                    <div class="mb-3">
                        <input type="text" name="searchTerm" placeholder="Cari lokasi..." class="form-control mb-2" required>
                        <button type="submit" class="btn btn-secondary w-100">Cari</button>
                    </div>
                </form>
            </div>
        </div>

        <h2 class="text-center mt-4">List Marker</h2>
        <table class="table table-bordered mt-4">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Marker</th>
                    <th>Deskripsi</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Foto</th>
                </tr>
            </thead>
            <tbody id="historyTableBody">
                <!-- Data akan diisi dengan JavaScript -->
            </tbody>
        </table>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="assets/js/main.js"></script> <!-- Make sure this path is correct -->

</html>