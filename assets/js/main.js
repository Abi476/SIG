// Inisialisasi peta
var map = L.map('map').setView([-8.157980, 113.724701], 13); // Lokasi default

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Ambil data marker dari server
fetch('api/get_marker.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(marker => {
            // Simpan marker di variabel untuk digunakan saat edit dan hapus
            let leafletMarker = L.marker([marker.latitude, marker.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${marker.name}</b><br>
                    ${marker.description}<br>
                    <img src="uploads/${marker.photo}" width="100"><br>
                    <button onclick="editMarker(${marker.id}, '${marker.name}', '${marker.description}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                    <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
                `);
            leafletMarker.id = marker.id; // Simpan ID ke dalam marker untuk penghapusan
        });
    });

// Fungsi untuk menampilkan custom alert
function showAlert(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.innerText = message; // Set pesan
    alertBox.style.display = 'block'; // Tampilkan alert
    alertBox.style.opacity = '1'; // Set opacity ke 1

    // Sembunyikan alert setelah 3 detik
    setTimeout(() => {
        alertBox.style.opacity = '0'; // Mengurangi opacity
        setTimeout(() => {
            alertBox.style.display = 'none'; // Sembunyikan setelah transisi
        }, 500); // Waktu untuk transisi
    }, 3000); // Durasi tampil alert
}

// Tambah marker
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

// Fungsi untuk mengedit marker
function editMarker(id, name, description, photo, latitude, longitude) {
    const newName = prompt('Edit Nama Marker:', name);
    const newDescription = prompt('Edit Keterangan Marker:', description);
    const newPhoto = prompt('Edit URL Foto (kosongkan jika tidak ada):', photo);

    if (newName !== null && newDescription !== null) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', newName);
        formData.append('description', newDescription);
        formData.append('photo', newPhoto); // Handle foto baru jika diperlukan
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        fetch('api/edit_marker.php', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('Marker berhasil diperbarui');
                location.reload(); // Refresh untuk mendapatkan data terbaru
            } else {
                showAlert('Gagal memperbarui marker');
            }
        });
    }
}

// Fungsi untuk menghapus marker
function deleteMarker(id, btn) {
    if (confirm('Apakah Anda yakin ingin menghapus marker ini?')) {
        fetch('api/delete_marker.php', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                showAlert('Marker berhasil dihapus');

                // Hapus marker dari peta
                const markerToRemove = btn.closest('.leaflet-popup')._source; // Dapatkan referensi marker
                if (markerToRemove) {
                    map.removeLayer(markerToRemove); // Menghapus marker dari peta
                }
            } else {
                showAlert(data.message); // Tampilkan pesan kesalahan jika ada
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Terjadi kesalahan saat menghapus marker: ' + error.message);
        });
    }
}

// // Fungsi untuk mencari lokasi berdasarkan nama tempat
// document.getElementById('searchButton').addEventListener('click', function() {
//     const placeName = document.getElementById('placeSearch').value;

//     // Menggunakan Nominatim untuk mencari lokasi
//     fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json`)
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.length > 0) {
//                 const location = data[0]; // Ambil hasil pertama
//                 document.getElementById('latitude').value = location.lat; // Set latitude
//                 document.getElementById('longitude').value = location.lon; // Set longitude

//                 // Pindahkan peta ke lokasi yang ditemukan
//                 map.setView([location.lat, location.lon], 13);

//                 L.marker([location.lat, location.lon]).addTo(map)
//                     .bindPopup(`Lokasi: ${placeName}`).openPopup();
//             } else {
//                 showAlert('Lokasi tidak ditemukan.');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             showAlert('Terjadi kesalahan saat mencari lokasi: ' + error.message);
//         });
// });