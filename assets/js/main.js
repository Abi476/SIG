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
            alert('Marker berhasil ditambahkan');
            location.reload(); // Refresh untuk mengambil data terbaru
        } else {
            alert('Gagal menambah marker');
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
                alert('Marker berhasil diperbarui');
                location.reload(); // Refresh untuk mendapatkan data terbaru
            } else {
                alert('Gagal memperbarui marker');
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
                alert('Marker berhasil dihapus');

                // Hapus marker dari peta
                const markerToRemove = btn.closest('.leaflet-popup')._source; // Dapatkan referensi marker
                if (markerToRemove) {
                    map.removeLayer(markerToRemove); // Menghapus marker dari peta
                }
            } else {
                alert(data.message); // Tampilkan pesan kesalahan jika ada
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus marker: ' + error.message);
        });
    }
}