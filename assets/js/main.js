    // Inisialisasi peta
    var map = L.map('map').setView([-8.157980, 113.724701], 13); // Lokasi default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

// Ambil data marker dari server
fetch('api/get_marker.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
            data.data.forEach(marker => {
                let leafletMarker = L.marker([marker.latitude, marker.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <b>${marker.name}</b><br>
                        ${marker.description}<br>
                        <img src="uploads/${marker.photo}" width="100"><br>
                        <button onclick="editMarker(${marker.id}, '${marker.name.replace(/'/g, "\\'")}', '${marker.description.replace(/'/g, "\\'")}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                        <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
                    `);
                leafletMarker.id = marker.id;
            });
        } else {
            console.error('Error fetching markers:', data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });


    // Fungsi untuk menampilkan custom alert
    function showAlert(message) {
        const alertBox = document.getElementById('customAlert');
        alertBox.innerText = message;
        alertBox.style.display = 'block';
        alertBox.style.opacity = '1';

        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 500);
        }, 3000);
    }

    // // Tambahkan marker dengan mengklik peta
    // map.on('click', function(e) {
    //     const latitude = e.latlng.lat;
    //     const longitude = e.latlng.lng;

    //     // Tampilkan prompt untuk nama dan deskripsi marker
    //     const name = prompt('Masukkan nama marker:');
    //     const description = prompt('Masukkan deskripsi marker:');
        
    //     if (name && description) {
    //         // Tambahkan marker ke peta
    //         const newMarker = L.marker([latitude, longitude]).addTo(map)
    //             .bindPopup(`
    //                 <b>${name}</b><br>
    //                 ${description}<br>
    //                 <button onclick="editMarkerTemp(this)">Edit</button>
    //                 <button onclick="deleteMarkerTemp(this)">Hapus</button>
    //             `).openPopup();

    //         // Simpan data marker ke server
    //         const formData = new FormData();
    //         formData.append('name', name);
    //         formData.append('description', description);
    //         formData.append('latitude', latitude);
    //         formData.append('longitude', longitude);

    //         fetch('api/add_marker.php', {
    //             method: 'POST',
    //             body: formData
    //         }).then(response => response.json())
    //         .then(data => {
    //             if (data.status === 'success') {
    //                 showAlert('Marker berhasil ditambahkan');
    //                 location.reload(); // Refresh untuk mengambil data terbaru
    //             } else {
    //                 showAlert('Gagal menambah marker');
    //             }
    //         });
    //     } else {
    //         showAlert('Nama dan deskripsi marker tidak boleh kosong!');
    //     }
    // });

        // Event listener untuk klik pada peta
        map.on('click', function(e) {
            // Ambil koordinat dari event click
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;

            // Tampilkan koordinat di form input
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;

            // Tambahkan marker ke peta dengan popup informasi
            var marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup("Lat: " + lat + "<br>Lng: " + lng).openPopup();
        });

        // Fungsi untuk menampilkan custom alert (sama seperti sebelumnya)
        function showAlert(message) {
            const alertBox = document.getElementById('customAlert');
            alertBox.innerText = message;
            alertBox.style.display = 'block';
            alertBox.style.opacity = '1';

            setTimeout(() => {
                alertBox.style.opacity = '0';
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 500);
            }, 3000);
        }

        // Tambah marker dengan form
        document.getElementById('addMarkerForm').addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(this);

            fetch('api/add_marker.php', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showAlert('Marker berhasil ditambahkan');
                    location.reload(); // Refresh untuk mengambil data terbaru
                } else {
                    showAlert('Gagal menambah marker');
                }
            });
        });

    // Fungsi untuk mengedit marker sementara (saat belum disimpan di server)
    function editMarkerTemp(button) {
        const markerPopup = button.closest('.leaflet-popup');
        const marker = markerPopup._source;

        const newName = prompt('Edit Nama Marker:', marker.getPopup().getContent().split('<b>')[1].split('</b>')[0]);
        const newDescription = prompt('Edit Deskripsi Marker:', marker.getPopup().getContent().split('<br>')[1]);

        if (newName && newDescription) {
            marker.setPopupContent(`
                <b>${newName}</b><br>
                ${newDescription}<br>
                <button onclick="editMarkerTemp(this)">Edit</button>
                <button onclick="deleteMarkerTemp(this)">Hapus</button>
            `).openPopup();
        }
    }

// Fungsi untuk menghapus marker
function deleteMarker(markerId, button) {
    // Konfirmasi penghapusan
    if (confirm('Apakah Anda yakin ingin menghapus marker ini?')) {
        // Ambil marker dari tombol yang diklik
        const markerPopup = button.closest('.leaflet-popup');
        const marker = markerPopup._source;

        // Hapus marker dari peta
        map.removeLayer(marker);

        // Kirim permintaan penghapusan ke server
        fetch(`api/delete_marker.php?id=${markerId}`, {
            method: 'DELETE' // Menggunakan metode DELETE
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('Marker berhasil dihapus');
                location.reload(); // Refresh untuk mengambil data terbaru
            } else {
                showAlert('Gagal menghapus marker: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showAlert('Terjadi kesalahan saat menghapus marker');
        });
    }
}
