// Inisialisasi peta dengan posisi awal
var map = L.map('map').setView([-8.157980, 113.724701], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

const markers = {};

// Mengambil data marker dari server
fetch('api/get_marker.php')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
            // Menampilkan marker di peta
            data.data.forEach(marker => {
                let leafletMarker = L.marker([marker.latitude, marker.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <b>${marker.name}</b><br>
                        ${marker.description}<br>
                        <img src="uploads/${marker.photo}" width="100"><br>
                        <button onclick="editMarkerTemp(${marker.id}, '${marker.name.replace(/'/g, "\\'")}', '${marker.description.replace(/'/g, "\\'")}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                        <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
                    `);
                markers[marker.id] = leafletMarker;
            });

            // Mempopulate tabel dengan data marker
            populateMarkerTable(data.data);
        } else {
            console.error('Error fetching markers:', data.message);
        }
    })
    .catch(error => console.error('Fetch error:', error));

// Fungsi untuk mempopulate tabel dengan data marker
function populateMarkerTable(markers) {
    const tbody = document.getElementById('markerTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Menghapus baris yang ada

    markers.forEach(marker => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = marker.id;
        row.insertCell(1).innerText = marker.name;
        row.insertCell(2).innerText = marker.description;
        row.insertCell(3).innerText = marker.latitude;
        row.insertCell(4).innerText = marker.longitude;
        row.insertCell(5).innerHTML = `<img src="uploads/${marker.photo}" width="100">`;

        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = `
            <button onclick="editMarkerTemp(${marker.id}, '${marker.name.replace(/'/g, "\\'")}', '${marker.description.replace(/'/g, "\\'")}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
            <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
        `;
    });
}

// Fungsi untuk menampilkan custom alert
function showAlert(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.innerText = message;
    alertBox.style.display = 'block';
    alertBox.style.opacity = '1';

    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.style.display = 'none', 500);
    }, 3000);
}

// Event untuk menambah marker pada klik peta
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;

    L.marker([lat, lng]).addTo(map)
        .bindPopup("Lat: " + lat + "<br>Lng: " + lng)
        .openPopup();
});

// Fungsi untuk menambahkan marker melalui form
document.getElementById('addMarkerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('api/add_marker.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showAlert('Marker berhasil ditambahkan');
            location.reload();
        } else {
            showAlert('Gagal menambah marker');
        }
    })
    .catch(error => showAlert('Terjadi kesalahan saat menambah marker: ' + error.message));
});

// Fungsi untuk mengedit marker
function editMarkerTemp(id, name, description, photo, latitude, longitude) {
    const marker = markers[id];
    if (!marker) return console.error(`Error: marker with ID ${id} not found`);

    const popup = L.popup()
        .setLatLng(marker.getLatLng())
        .setContent(`
            <div class="popup-edit">
                <h2>Edit Marker</h2>
                <form id="editMarkerForm">
                    <label for="name">Name:</label>
                    <input type="text" id="name" value="${name}"><br><br>
                    <label for="description">Description:</label>
                    <textarea id="description">${description}</textarea><br><br>
                    <button type="submit">Save</button>
                </form>
            </div>
        `)
        .openOn(map);

    popup._contentNode.querySelector('#editMarkerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = popup._contentNode.querySelector('#name').value;
        const newDescription = popup._contentNode.querySelector('#description').value;

        if (!newName || !newDescription) return alert('Please fill in all fields');

        marker.setPopupContent(`
            <b>${newName}</b><br>
            ${newDescription}<br>
            <img src="uploads/${photo}" width="100"><br>
            <button onclick="editMarkerTemp(${id}, '${newName.replace(/'/g, "\\'")}', '${newDescription.replace(/'/g, "\\'")}', '${photo}', ${latitude}, ${longitude})">Edit</button>
            <button onclick="deleteMarker(${id}, this)">Hapus</button>
        `);

        fetch('api/edit_marker.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name: newName, description: newDescription, latitude, longitude })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') console.error('Error updating marker:', data.message);
        })
        .catch(error => console.error('Fetch error:', error));

        popup.remove();
    });
}

// Fungsi untuk menghapus marker
function deleteMarker(markerId, button) {
    if (confirm('Apakah Anda yakin ingin menghapus marker ini?')) {
        const marker = markers[markerId];
        if (marker) {
            map.removeLayer(marker);
            delete markers[markerId]; // Hapus dari objek markers

            fetch('api/delete_marker.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: markerId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showAlert('Marker berhasil dihapus');
                    location.reload();
                } else {
                    showAlert('Gagal menghapus marker: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                showAlert('Terjadi kesalahan saat menghapus marker');
            });
        } else {
            console.error('Marker tidak ditemukan!');
        }
    }
}

// Fungsi untuk mencari lokasi
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah pengiriman form secara default

    // Ambil nilai dari input pencarian
    let searchTerm = document.querySelector('input[name="searchTerm"]').value;

    // Mengirim permintaan AJAX ke `cari_lokasi.php`
    fetch('cari_lokasi.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'searchTerm=' + encodeURIComponent(searchTerm)
    })
    .then(response => response.text())
    .then(data => {
        // Menampilkan hasil pencarian di elemen dengan ID `searchResults`
        document.getElementById('searchResults').innerHTML = data;

        // Tambahkan event listener untuk setiap item hasil pencarian
        document.querySelectorAll('#searchResults .list-group-item').forEach(item => {
            item.addEventListener('click', function() {
                const lat = this.dataset.latitude;
                const lng = this.dataset.longitude;

                // Pindahkan peta ke lokasi yang dipilih
                map.setView([lat, lng], 15);
            });
        });
    })
    .catch(error => console.error('Error fetching search results:', error));
});
