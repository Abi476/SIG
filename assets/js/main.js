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
                let leafletMarker = L.marker([marker.latitude, marker.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <b>${marker.name}</b><br>
                        ${marker.description}<br>
                        <img src="uploads/${marker.photo}" width="100"><br>
                        <button onclick="editMarker(${marker.id}, '${marker.name}', '${marker.description}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                        <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
                    `);
                leafletMarker.id = marker.id;
            });
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

    // Tambahkan marker dengan mengklik peta
    map.on('click', function(e) {
        const latitude = e.latlng.lat;
        const longitude = e.latlng.lng;

        // Tampilkan prompt untuk nama dan deskripsi marker
        const name = prompt('Masukkan nama marker:');
        const description = prompt('Masukkan deskripsi marker:');
        
        if (name && description) {
            // Tambahkan marker ke peta
            const newMarker = L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`
                    <b>${name}</b><br>
                    ${description}<br>
                    <button onclick="editMarkerTemp(this)">Edit</button>
                    <button onclick="deleteMarkerTemp(this)">Hapus</button>
                `).openPopup();

            // Simpan data marker ke server
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);

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
        } else {
            showAlert('Nama dan deskripsi marker tidak boleh kosong!');
        }
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

    // Fungsi untuk menghapus marker sementara
    function deleteMarkerTemp(button) {
        const markerPopup = button.closest('.leaflet-popup');
        const marker = markerPopup._source;

        map.removeLayer(marker);
    }
