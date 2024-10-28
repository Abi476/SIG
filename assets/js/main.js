    // Inisialisasi peta
    var map = L.map('map').setView([-8.157980, 113.724701], 13); // Lokasi default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

    const markers = {};
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
                  <button onclick="editMarkerTemp(${marker.id}, '${marker.name.replace(/'/g, "\\'")}', '${marker.description.replace(/'/g, "\\'")}', '${marker.photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                  <button onclick="deleteMarker(${marker.id}, this)">Hapus</button>
                `);
              markers[marker.id] = leafletMarker;
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

        function editMarkerTemp(id, name, description, photo, latitude, longitude) {
            const marker = markers[id]; // Access the marker by its custom ID
            
            if (!marker) {
              console.error(`Error: marker with ID ${id} not found`);
              return;
            }
            
            // Create a popup to get user input
            const popup = L.popup()
              .setLatLng(marker.getLatLng())
              .setContent(`
                <div class="popup-edit">
                  <h2>Edit Marker</h2>
                  <form>
                    <label for="name">Name:</label>
                    <input type="text" id="name" value="${name}"><br><br>
                    <label for="description">Description:</label>
                    <textarea id="description">${description}</textarea><br><br>
                    <button type="submit">Save</button>
                  </form>
                </div>
              `)
              .openOn(map);
            
            // Add event listener to the form
            popup._contentNode.querySelector('form').addEventListener('submit', (e) => {
              e.preventDefault();
              const newName = popup._contentNode.querySelector('#name').value;
              const newDescription = popup._contentNode.querySelector('#description').value;
              
              if (!newName || !newDescription) {
                alert('Please fill in all fields');
                return;
              }
              
              // Update marker content directly
              marker.setPopupContent(`
                <b>${newName}</b><br>
                ${newDescription}<br>
                <img src="uploads/${photo}" width="100"><br>
                <button onclick="editMarkerTemp(${marker.id}, '${newName.replace(/'/g, "\\'")}', '${newDescription.replace(/'/g, "\\'")}', '${photo}', ${marker.latitude}, ${marker.longitude})">Edit</button>
                <button onclick="deleteMarker(${id}, this)">Hapus</button>
              `);
              
              // Send AJAX request to update marker on the server
              const data = {
                id,
                name: newName,
                description: newDescription,
                latitude,
                longitude
              };
              
              fetch('api/edit_marker.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })
              .then(response => response.json())
              .then(data => {
                if (data.status !== 'success') {
                  console.error('Error updating marker:', data.message);
                }
              })
              .catch(error => {
                console.error('Fetch error:', error);
              });
              
              // Close the popup
              popup.remove();
            });
          }
        
        

// Fungsi untuk menghapus marker
function deleteMarker(markerId, marker) {
    // Konfirmasi penghapusan
    if (confirm('Apakah Anda yakin ingin menghapus marker ini?')) {
        console.log('Marker:', marker); // Debug marker
        console.log('Marker ID:', markerId); // Debug marker ID

        // Cek apakah marker berhasil diambil
        if (marker) {
            // Hapus marker dari peta
            map.removeLayer(marker);

            // Kirim permintaan penghapusan ke server
            fetch('api/delete_marker.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: markerId }) // Mengirimkan ID marker dalam body
            })
            .then(response => {
                // Respons bisa dalam bentuk teks, bukan JSON
                return response.text().then(text => {
                    try {
                        return JSON.parse(text); // Parsing JSON respons
                    } catch (e) {
                        console.error('Response is not JSON:', text);
                        throw new Error('Invalid JSON response');
                    }
                });
            })
            .then(data => { console.log(data)
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
        } else {
            console.error('Marker tidak ditemukan!');
        }
    }
}

// ...

// Fungsi untuk mencari lokasi
function searchLocation() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            fetch('./cari_lokasi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `searchTerm=${searchTerm}`
            })
            .then(response => response.text())
            .then(data => {
                searchResults.innerHTML = data;
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        } else {
            searchResults.innerHTML = '';
        }
    });
}

searchLocation();

// ...