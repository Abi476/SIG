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

    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center mt-4">Sistem Informasi Geografis</h1>
        <div id="customAlert" class="custom-alert"></div>

        <div class="row mt-4">
            <div class="col-md-6">
                <div id="map"></div>
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
                        <input type="text" name="latitude" id="latitude" class="form-control" placeholder="Latitude" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="longitude" id="longitude" class="form-control" placeholder="Longitude" required>
                    </div>
                    <div class="mb-3">
                        <input type="file" name="photo" class="form-control">
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary">Tambah Marker</button>

                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
