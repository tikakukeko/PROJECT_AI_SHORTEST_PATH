/**
 * UNIB SmartRoute – Shortest Path Navigation System
 * ─────────────────────────────────────────────────
 * Algorithm : A* Search + OSRM Road Snapping
 * UI Layer  : Premium Leaflet + Custom Markers + Animations
 *
 * ⚠ ROUTING LOGIC PRESERVED — UI/UX Enhanced Only
 */

// ============================================================
// 1. DATA NODES (Location & Road) — UNCHANGED
// ============================================================
const nodes = {
    // --- LOCATION NODES (Dropdown) ---
    gerbang:                { id:'gerbang',                name:'Gerbang Depan UNIB',        type:'location', coords:[-3.759126, 102.266633], icon:'⛩️' },
    basket:                 { id:'basket',                 name:'Lapangan Basket',            type:'location', coords:[-3.759550, 102.267205], icon:'🏀' },
    gor:                    { id:'gor',                    name:'GOR UNIB',                   type:'location', coords:[-3.760747, 102.267504], icon:'🏸' },
    hukum:                  { id:'hukum',                  name:'Fakultas Hukum',             type:'location', coords:[-3.760531, 102.268477], icon:'⚖️' },
    feb:                    { id:'feb',                    name:'Fakultas Ekonomi & Bisnis',  type:'location', coords:[-3.761661, 102.268552], icon:'💼' },
    pertanian:              { id:'pertanian',              name:'Fakultas Pertanian',         type:'location', coords:[-3.759375, 102.269229], icon:'🌾' },
    rektorat:               { id:'rektorat',               name:'Gedung Rektorat',            type:'location', coords:[-3.758937, 102.272271], icon:'🏢' },
    glt:                    { id:'glt',                    name:'Gedung Layanan Terpadu',     type:'location', coords:[-3.757995, 102.271927], icon:'🛠️' },
    danau:                  { id:'danau',                  name:'Danau UNIB',                 type:'location', coords:[-3.758364, 102.273120], icon:'🌊' },
    mushola:                { id:'mushola',                name:'Mushola UNIB',               type:'location', coords:[-3.757715, 102.273618], icon:'🕌' },
    gb2:                    { id:'gb2',                    name:'GB 2 UNIB',                  type:'location', coords:[-3.758010, 102.273957], icon:'🏫' },
    fmipa:                  { id:'fmipa',                  name:'FMIPA UNIB',                 type:'location', coords:[-3.756028, 102.274763], icon:'🔬' },
    upatik:                 { id:'upatik',                 name:'UPATIK UNIB',                type:'location', coords:[-3.758522, 102.275019], icon:'💻' },
    perpustakaan:           { id:'perpustakaan',           name:'Perpustakaan UNIB',          type:'location', coords:[-3.756785, 102.274861], icon:'📚' },
    pkm:                    { id:'pkm',                    name:'PKM UNIB',                   type:'location', coords:[-3.756449, 102.275826], icon:'🤝' },
    ft:                     { id:'ft',                     name:'FT UNIB',                    type:'location', coords:[-3.758441, 102.276687], icon:'⚙️' },
    gsg:                    { id:'gsg',                    name:'GSG UNIB',                   type:'location', coords:[-3.757527, 102.276566], icon:'🎭' },
    gb3:                    { id:'gb3',                    name:'GB 3 UNIB',                  type:'location', coords:[-3.756490, 102.276540], icon:'🏫' },
    gb5:                    { id:'gb5',                    name:'GB 5 UNIB',                  type:'location', coords:[-3.755525, 102.276462], icon:'🏫' },
    fkip:                   { id:'fkip',                   name:'FKIP UNIB',                  type:'location', coords:[-3.756179, 102.277466], icon:'📖' },
    danau_fkip:             { id:'danau_fkip',             name:'Danau FKIP',                 type:'location', coords:[-3.756129, 102.277965], icon:'🦆' },
    fkik:                   { id:'fkik',                   name:'FKIK UNIB',                  type:'location', coords:[-3.755080, 102.278038], icon:'🩺' },
    stadion:                { id:'stadion',                name:'Stadion UNIB',               type:'location', coords:[-3.757510, 102.278155], icon:'🏟️' },
    gerbang_masuk_belakang: { id:'gerbang_masuk_belakang', name:'Gerbang Masuk Belakang',    type:'location', coords:[-3.759442, 102.275036], icon:'⛩️' },
    gerbang_keluar_belakang:{ id:'gerbang_keluar_belakang',name:'Gerbang Keluar Belakang',   type:'location', coords:[-3.7593743280814422, 102.27621945059151], icon:'⛩️' },

    // --- ROAD NODES (Intersections/Corners) — hidden from UI ---
    simpang_danau:           { id:'simpang_danau',           name:'Simpang Danau',           type:'road', coords:[-3.758462, 102.272087] },
    simpang_belakang_rek:    { id:'simpang_belakang_rek',    name:'Simpang Belakang Rek.',   type:'road', coords:[-3.758643, 102.271025] },
    simpang_gerbang_rek:     { id:'simpang_gerbang_rek',     name:'Simpang Gerbang Rek.',    type:'road', coords:[-3.760665, 102.272263] },
    simpang_pertanian:       { id:'simpang_pertanian',       name:'Simpang Pertanian',       type:'road', coords:[-3.759495, 102.269692] },
    simpang_gedung_i:        { id:'simpang_gedung_i',        name:'Simpang Gedung I',        type:'road', coords:[-3.759933, 102.269779] },
    simpang_hukum:           { id:'simpang_hukum',           name:'Simpang F. Hukum',        type:'road', coords:[-3.760345, 102.269309] },
    simpang_upatik:          { id:'simpang_upatik',          name:'Simpang UPATIK',          type:'road', coords:[-3.758824, 102.274796] },
    simpang_gsg:             { id:'simpang_gsg',             name:'Simpang GSG',             type:'road', coords:[-3.758431, 102.276288] },
    simpang_ft:              { id:'simpang_ft',              name:'Simpang Sekretariat FT',  type:'road', coords:[-3.758185, 102.277135] },
    simpang_gb34:            { id:'simpang_gb34',            name:'Simpang GB 3 & 4',        type:'road', coords:[-3.756777, 102.276980] },
    simpang_gb5:             { id:'simpang_gb5',             name:'Simpang GB 5',            type:'road', coords:[-3.755744, 102.276824] },
    simpang_fmipa:           { id:'simpang_fmipa',           name:'Simpang FMIPA',           type:'road', coords:[-3.755862, 102.273885] },
    simpang_perpus:          { id:'simpang_perpus',          name:'Simpang Perpus',          type:'road', coords:[-3.757621, 102.274150] },
    simpang_gb2:             { id:'simpang_gb2',             name:'Simpang GB 2',            type:'road', coords:[-3.758400, 102.274500] }
};

// ============================================================
// 2. DIRECTED GRAPH — EDGES (Directed / One-Way aware)
// ============================================================

/**
 * adj  : directed adjacency list  { nodeId: [neighborId, ...] }
 * edges: flat list of [from, to] pairs — digunakan untuk info & geolocation fallback
 */
const adj  = {};
const edges = []; // diisi otomatis oleh helper di bawah

// Inisialisasi adj untuk setiap node
Object.keys(nodes).forEach(id => { adj[id] = []; });

/**
 * addEdge(from, to) — Jalan SATU ARAH (one-way)
 * Hanya bisa dilalui dari `from` menuju `to`.
 */
function addEdge(from, to) {
    adj[from].push(to);
    edges.push([from, to]);
}

/**
 * addTwoWayEdge(a, b) — Jalan DUA ARAH (bidirectional)
 * Bisa dilalui dari `a` ke `b` maupun dari `b` ke `a`.
 */
function addTwoWayEdge(a, b) {
    adj[a].push(b);
    adj[b].push(a);
    edges.push([a, b], [b, a]);
}

// ── Area Depan (Front Gate) ──────────────────────────────────
addTwoWayEdge('gerbang',          'basket');
addTwoWayEdge('basket',           'simpang_hukum');
addTwoWayEdge('simpang_hukum',    'gor');
addTwoWayEdge('simpang_hukum',    'hukum');
addTwoWayEdge('simpang_hukum',    'feb');
addTwoWayEdge('simpang_hukum',    'simpang_gedung_i');
addTwoWayEdge('simpang_gedung_i', 'simpang_pertanian');
addTwoWayEdge('simpang_pertanian','pertanian');

// ── Area Rektorat ────────────────────────────────────────────
addTwoWayEdge('simpang_gedung_i',     'simpang_gerbang_rek');
addTwoWayEdge('simpang_gerbang_rek',  'simpang_belakang_rek');
addTwoWayEdge('simpang_belakang_rek', 'simpang_danau');
addTwoWayEdge('simpang_danau',        'rektorat');
addTwoWayEdge('simpang_danau',        'danau');
addTwoWayEdge('simpang_danau',        'glt');
addTwoWayEdge('simpang_danau',        'simpang_perpus');
addTwoWayEdge('simpang_belakang_rek', 'simpang_perpus');

// ── Area Tengah (Perpus / FMIPA / UPATIK) ───────────────────
addTwoWayEdge('simpang_perpus',  'perpustakaan');
addTwoWayEdge('simpang_perpus',  'mushola');
addTwoWayEdge('simpang_perpus',  'simpang_fmipa');
addTwoWayEdge('simpang_fmipa',   'fmipa');
addTwoWayEdge('simpang_fmipa',   'simpang_danau');
addTwoWayEdge('simpang_perpus',  'simpang_upatik');
addTwoWayEdge('simpang_upatik',  'simpang_gb2');
addTwoWayEdge('simpang_gb2',     'upatik');
addTwoWayEdge('simpang_gb2',     'gb2');

// ── Jalur Gerbang Masuk Belakang (ONE-WAY RULES) ─────────────
//
// Aturan:
//   BOLEH  : gerbang_masuk_belakang → simpang_upatik  (belok kanan menuju area tengah)
//   BOLEH  : gerbang_masuk_belakang → simpang_gsg     (belok kanan langsung ke area GB5/GSG/FT)
//   TIDAK  : simpang_upatik → gerbang_masuk_belakang  (tidak bisa balik lewat jalur kanan)
//   TIDAK  : simpang_gsg   → gerbang_masuk_belakang   (tidak bisa keluar lewat pintu masuk)
//
// Jalur keluar belakang (gerbang_keluar_belakang) tetap dua arah dari dalam kampus
addEdge('gerbang_masuk_belakang', 'simpang_upatik');  // ONE-WAY: masuk → belok kanan ke tengah
addEdge('gerbang_masuk_belakang', 'simpang_gsg');     // ONE-WAY: masuk → belok kanan langsung ke GB5/GSG/FT
addTwoWayEdge('gerbang_masuk_belakang', 'gerbang_keluar_belakang'); // pintu keluar dua arah

// ── Area Tengah → Timur (GSG / GB / FT) ─────────────────────
//
// Aturan:
//   BOLEH  : simpang_upatik → simpang_gsg  (dari dalam kampus / gb2 / upatik)
//   BOLEH  : gb2 / upatik  → simpang_gsg   (via simpang_upatik)
//   BOLEH  : simpang_gsg   → simpang_upatik (balik arah valid — dua arah internal)
addTwoWayEdge('simpang_upatik', 'simpang_gsg');
addTwoWayEdge('simpang_fmipa',  'simpang_gb34');
addTwoWayEdge('simpang_fmipa',  'simpang_gb5');
addTwoWayEdge('simpang_gsg',    'gsg');
addTwoWayEdge('simpang_gsg',    'simpang_ft');
addTwoWayEdge('simpang_ft',     'ft');
addTwoWayEdge('simpang_gsg',    'simpang_gb34');
addTwoWayEdge('simpang_gb34',   'gb3');
addTwoWayEdge('simpang_gb34',   'pkm');
addTwoWayEdge('simpang_gb34',   'simpang_gb5');
addTwoWayEdge('simpang_gb5',    'gb5');

// ── Area Timur (FKIP / FKIK / Stadion) ──────────────────────
addTwoWayEdge('simpang_gb34', 'fkip');
addTwoWayEdge('fkip',         'danau_fkip');
addTwoWayEdge('simpang_gb34', 'fkik');
addTwoWayEdge('simpang_ft',   'stadion');

// ============================================================
// 3. A* ALGORITHM — DIRECTED GRAPH (mengikuti arah edge)
// ============================================================
let edgeWeights = {};

function haversine(c1, c2) {
    const R = 6371000, r = x => x * Math.PI / 180;
    const dLat = r(c2[0]-c1[0]), dLon = r(c2[1]-c1[1]);
    const a = Math.sin(dLat/2)**2 + Math.cos(r(c1[0]))*Math.cos(r(c2[0]))*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Tidak digunakan secara aktif — haversine dipakai sebagai fallback
async function fetchOSRMDistances() {
    console.log('ℹ Menggunakan Haversine distance (tanpa OSRM fetch).');
}

/**
 * aStar(startId, endId)
 * Implementasi A* pada DIRECTED GRAPH.
 * Hanya menelusuri neighbor sesuai arah edge yang telah didefinisikan —
 * tidak membuat edge balik secara otomatis.
 */
function aStar(startId, endId) {
    const gScore = {}, fScore = {}, prev = {};
    Object.keys(nodes).forEach(id => {
        gScore[id] = Infinity;
        fScore[id] = Infinity;
        prev[id]   = null;
    });

    gScore[startId] = 0;
    fScore[startId] = haversine(nodes[startId].coords, nodes[endId].coords);

    // Gunakan `adj` global (directed) — bukan rebuild otomatis dua arah
    const openSet = new Set([startId]);

    while (openSet.size > 0) {
        let curr = null;
        openSet.forEach(id => {
            if (curr === null || fScore[id] < fScore[curr]) curr = id;
        });

        if (curr === endId) break;
        openSet.delete(curr);

        // Hanya ikuti neighbor dari directed adj[curr]
        (adj[curr] || []).forEach(nb => {
            let weight = haversine(nodes[curr].coords, nodes[nb].coords);

            // Opsional: pakai bobot OSRM jika tersedia
            if (edgeWeights[curr] && edgeWeights[curr][nb]) {
                const osrmDist = edgeWeights[curr][nb];
                if (osrmDist < weight * 2.5) weight = osrmDist;
            }

            const tentative = gScore[curr] + weight;
            if (tentative < gScore[nb]) {
                prev[nb]   = curr;
                gScore[nb] = tentative;
                fScore[nb] = gScore[nb] + haversine(nodes[nb].coords, nodes[endId].coords);
                openSet.add(nb);
            }
        });
    }

    const path = [];
    let c = endId;
    while (c) { path.unshift(c); c = prev[c]; }
    return path[0] === startId ? { path, distance: gScore[endId] } : null;
}

// ============================================================
// 4. MAP & VISUALIZATION — ENHANCED UI
// ============================================================
let map, routeLayerGlow, routeLayerMain, routeLayerTop, routeDecorator;
let routeMarkers = [];
let routeAnimationFrame = null;
let routeAnimationResolver = null;
let osm, positron, voyager, gMaps;
let userMarker = null;

function initMap() {
    // OpenStreetMap tile (default)
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });
    positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO', maxZoom: 20
    });
    voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO', maxZoom: 20
    });
    gMaps = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains:['0','1','2','3'], attribution:'© Google Maps (Satellite)', maxZoom:21
    });

    map = L.map('map', {
        center: [-3.7580, 102.2730],
        zoom: 17,
        layers: [osm],
        zoomControl: false,
        attributionControl: true
    });

    // Premium zoom control position
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer switcher
    L.control.layers({
        '🗺️ OpenStreetMap':      osm,
        '🏳️ Positron (Minimal)': positron,
        '🗺️ Voyager (Bersih)':   voyager,
        '🌐 Google Satellite':    gMaps
    }, {}, { position: 'topright', collapsed: true }).addTo(map);
}




function interpolateLatLng(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t
    ];
}


function getRouteFocusOptions() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        return {
            paddingTopLeft: [40, 80],
            paddingBottomRight: [40, 260],
            duration: 1.2,
            easeLinearity: 0.25
        };
    }

    const sidebar = document.getElementById('mainSidebar');
    const sidebarWidth = sidebar ? sidebar.offsetWidth : 385;
    return {
        paddingTopLeft: [sidebarWidth + 35, 80],
        paddingBottomRight: [80, 80],
        duration: 1.2,
        easeLinearity: 0.25
    };
}

function focusRouteOnMap(coords) {
    const bounds = L.latLngBounds(coords);
    if (bounds.isValid()) {
        map.flyToBounds(bounds, getRouteFocusOptions());
    }
}

function clearRouteVisualization() {
    if (routeAnimationFrame) {
        cancelAnimationFrame(routeAnimationFrame);
        routeAnimationFrame = null;
    }
    if (routeAnimationResolver) {
        routeAnimationResolver(null);
        routeAnimationResolver = null;
    }

    [routeLayerGlow, routeLayerMain, routeLayerTop, routeDecorator].forEach(layer => {
        if (layer) map.removeLayer(layer);
    });

    routeLayerGlow = null;
    routeLayerMain = null;
    routeLayerTop = null;
    routeDecorator = null;

    routeMarkers.forEach(marker => map.removeLayer(marker));
    routeMarkers = [];
}

function getPartialRouteCoords(coords, cumulativeDistances, targetDistance) {
    if (coords.length < 2) return coords;

    const visible = [coords[0]];
    for (let i = 1; i < coords.length; i++) {
        if (cumulativeDistances[i] <= targetDistance) {
            visible.push(coords[i]);
            continue;
        }

        const segmentStart = cumulativeDistances[i - 1];
        const segmentLength = cumulativeDistances[i] - segmentStart;
        const t = segmentLength > 0 ? (targetDistance - segmentStart) / segmentLength : 1;
        visible.push(interpolateLatLng(coords[i - 1], coords[i], Math.max(0, Math.min(1, t))));
        break;
    }

    return visible.length > 1 ? visible : [coords[0], coords[0]];
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateRouteDrawing(coords, style) {
    if (routeAnimationResolver) {
        routeAnimationResolver(null);
        routeAnimationResolver = null;
    }

    return new Promise(resolve => {
        routeAnimationResolver = resolve;

        if (!coords.length) {
            routeAnimationResolver = null;
            resolve(null);
            return;
        }

        const initialCoords = [coords[0], coords[0]];
        routeLayerGlow = L.polyline(initialCoords, {
            color: style.routeColor,
            weight: 26,
            opacity: 0.16,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'route-path-glow'
        }).addTo(map);

        routeLayerMain = L.polyline(initialCoords, {
            color: style.routeColor,
            weight: 9,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'route-path-live'
        }).addTo(map);

        routeLayerTop = L.polyline(initialCoords, {
            color: style.shineColor,
            weight: 3.5,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'route-path-shine'
        }).addTo(map);

        const cumulativeDistances = [0];
        for (let i = 1; i < coords.length; i++) {
            cumulativeDistances[i] = cumulativeDistances[i - 1] + haversine(coords[i - 1], coords[i]);
        }

        const totalDistance = cumulativeDistances[cumulativeDistances.length - 1];
        const duration = Math.min(1900, Math.max(900, totalDistance * 7));
        const startTime = performance.now();

        const drawFrame = now => {
            if (!routeLayerGlow || !routeLayerMain || !routeLayerTop) {
                routeAnimationResolver = null;
                resolve(null);
                return;
            }

            const rawProgress = Math.min(1, (now - startTime) / duration);
            const easedProgress = easeOutCubic(rawProgress);
            const visibleCoords = getPartialRouteCoords(coords, cumulativeDistances, totalDistance * easedProgress);

            routeLayerGlow.setLatLngs(visibleCoords);
            routeLayerMain.setLatLngs(visibleCoords);
            routeLayerTop.setLatLngs(visibleCoords);

            if (rawProgress < 1) {
                routeAnimationFrame = requestAnimationFrame(drawFrame);
                return;
            }

            routeAnimationFrame = null;
            routeLayerGlow.setLatLngs(coords);
            routeLayerMain.setLatLngs(coords);
            routeLayerTop.setLatLngs(coords);
            routeAnimationResolver = null;
            resolve(routeLayerMain);
        };

        routeAnimationFrame = requestAnimationFrame(drawFrame);
    });
}

// ============================================================
// OSRM ROAD GEOMETRY — mengikuti jalur jalan OpenStreetMap
// ============================================================
async function getOSRMGeometry(coords, mode) {
    if (!coords || coords.length < 2) return coords;
    try {
        const profile = mode === 'motor' ? 'driving' : 'foot';
        const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/${profile}/${coordStr}?overview=full&geometries=geojson`;
        const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!resp.ok) throw new Error('OSRM HTTP error');
        const data = await resp.json();
        if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No OSRM route');
        return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
    } catch (e) {
        console.warn('⚠️ OSRM fallback ke node coords:', e.message);
        return coords;
    }
}

// ============================================================
// DRAW ROUTE — PREMIUM VISUAL
// ============================================================
async function drawRoute(result, mode) {
    clearRouteVisualization();

    const nodeCoords = result.path.map(id => nodes[id].coords);

    // Kirim ke OSRM hanya location nodes (gedung kampus).
    // Road nodes (simpang_xxx) tidak ada di OSM → bisa snap ke jalan salah.
    const locationWaypoints = result.path
        .filter(id => nodes[id].type === 'location')
        .map(id => nodes[id].coords);

    const osrmInput = locationWaypoints.length >= 2
        ? locationWaypoints
        : [nodeCoords[0], nodeCoords[nodeCoords.length - 1]];

    let drawCoords = nodeCoords; // fallback = garis node graph
    try {
        const osrmCoords = await getOSRMGeometry(osrmInput, mode);
        if (osrmCoords && osrmCoords.length >= 2) drawCoords = osrmCoords;
    } catch (e) {
        console.warn('⚠️ Fallback ke node coords:', e);
    }

    // Color per mode
    const isMotor    = mode === 'motor';
    const routeColor = isMotor ? '#f97316' : '#3b82f6';
    const shineColor = isMotor ? 'rgba(255,200,120,0.55)' : 'rgba(147,197,253,0.55)';
    const routeDraw  = animateRouteDrawing(drawCoords, { routeColor, shineColor });

    // ── Premium Markers ──────────────────────────────────────
    const startCoords = nodeCoords[0];
    const endCoords   = nodeCoords[nodeCoords.length - 1];

    // Start Marker — green
    const startIcon = L.divIcon({
        className: '',
        html: `
          <div class="route-marker marker-floating">
            <div class="route-marker-pin route-marker-start">
              <i class="fa-solid fa-location-dot"></i>
            </div>
          </div>`,
        iconSize: [48, 58],
        iconAnchor: [24, 58]
    });

    // End Marker — red pulsing
    const endIcon = L.divIcon({
        className: '',
        html: `
          <div class="route-marker marker-pulse">
            <div class="route-marker-pin route-marker-end">
              <i class="fa-solid fa-flag-checkered"></i>
            </div>
          </div>`,
        iconSize: [48, 58],
        iconAnchor: [24, 58]
    });

    const sM = L.marker(startCoords, { icon: startIcon }).addTo(map);
    const eM = L.marker(endCoords,   { icon: endIcon   }).addTo(map);

    const startName = nodes[result.path[0]].name;
    const endName   = nodes[result.path[result.path.length - 1]].name;

    sM.bindPopup(`<div class="popup-inner"><div class="popup-title">🏁 Titik Awal</div><div class="popup-desc">${startName}</div></div>`);
    eM.bindPopup(`<div class="popup-inner"><div class="popup-title">🎯 Tujuan</div><div class="popup-desc">${endName}</div></div>`);

    routeMarkers.push(sM, eM);
    focusRouteOnMap(drawCoords);

    await routeDraw;
    if (window.L && L.polylineDecorator && routeLayerMain) {
        routeDecorator = L.polylineDecorator(routeLayerMain, {
            patterns: [{
                offset: '8%',
                repeat: 100,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 12,
                    polygon: true,
                    pathOptions: { stroke: false, fillOpacity: 1, color: 'white' }
                })
            }]
        }).addTo(map);
    }
}

// ============================================================
// 5. UI UTILITIES — ENHANCED
// ============================================================
function showLoading(show, msg = 'Mencari rute terbaik...') {
    const overlay = document.getElementById('loadingOverlay');
    const txt     = document.getElementById('loadingText');
    if (txt) txt.textContent = msg;
    if (show) {
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.style.opacity = '1');
    } else {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 350);
    }
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 3200);
}

// ============================================================
// BEARING & DIRECTION — UNCHANGED
// ============================================================
function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180;
    const toDeg = r => r * 180 / Math.PI;
    const dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1); lat2 = toRad(lat2);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function getTurnDirection(prev, curr, next) {
    const b1 = calculateBearing(prev[0], prev[1], curr[0], curr[1]);
    const b2 = calculateBearing(curr[0], curr[1], next[0], next[1]);
    let diff = b2 - b1;
    if (diff < -180) diff += 360;
    if (diff >  180) diff -= 360;
    if (diff >  30 && diff <=  150) return { text: 'Belok Kanan', icon: 'fa-turn-right',   cls: 'mid-icon' };
    if (diff < -30 && diff >= -150) return { text: 'Belok Kiri',  icon: 'fa-turn-left',    cls: 'mid-icon' };
    return { text: 'Lurus', icon: 'fa-arrow-up', cls: 'mid-icon' };
}

// ============================================================
// 6. FIND PATH — UNCHANGED LOGIC, ENHANCED UI
// ============================================================
async function findPath() {
    const startId = document.getElementById('startNode').value;
    const endId   = document.getElementById('endNode').value;
    const mode    = document.querySelector('input[name="travelMode"]:checked').value;
    const btn     = document.getElementById('btnFindPath');

    if (!startId || !endId) {
        showToast('Silakan pilih titik awal dan tujuan.', 'error');
        return;
    }
    if (startId === endId) {
        showToast('Titik awal dan tujuan tidak boleh sama.', 'error');
        return;
    }

    const fallbackTimeout = setTimeout(() => {
        showLoading(false);
        btn.innerHTML = '<i class="fa-solid fa-route"></i>&nbsp; CARI RUTE TERPENDEK';
        btn.disabled = false;
    }, 12000);

    try {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; MENGHITUNG...';
        btn.disabled  = true;
        showLoading(true, 'Menghitung jalur terpendek...');

        const t0     = performance.now();
        const result = aStar(startId, endId);
        const t1     = performance.now();

        // Ensure loading screen shows for at least 1.2s for premium feel
        await new Promise(r => setTimeout(r, 1200));

        if (!result) {
            showToast('Rute tidak ditemukan! Coba kombinasi lain.', 'error');
            return;
        }

        showLoading(true, 'Menyiapkan visual rute...');
        await new Promise(r => setTimeout(r, 250));
        showLoading(false);
        await new Promise(r => setTimeout(r, 250));
        await drawRoute(result, mode);
        showToast('Rute berhasil ditemukan! ✨', 'success');

        // ── Metrics ──────────────────────────────────────────
        const speed   = mode === 'motor' ? 8.3 : 1.4;  // m/s
        const minutes = Math.max(1, Math.round(result.distance / speed / 60));

        document.getElementById('totalDistance').textContent = Math.round(result.distance);
        document.getElementById('estimatedTime').textContent = minutes;
        document.getElementById('computeTime').textContent   = (t1 - t0).toFixed(2) + ' ms';
        document.getElementById('modeInfo').textContent      = mode === 'motor' ? '🏍 Motor' : '🚶 Jalan';

        // Route header summary
        const fromName = nodes[startId].name.split(' ').slice(0,3).join(' ');
        const toName   = nodes[endId].name.split(' ').slice(0,3).join(' ');
        document.getElementById('routeSummary').textContent  = `${fromName} → ${toName}`;

        // ── Step-by-step Directions ───────────────────────────
        const list = document.getElementById('pathList');
        list.innerHTML = '';
        let cumDist = 0;
        let stepDelay = 0;

        for (let i = 0; i < result.path.length; i++) {
            const id = result.path[i];
            const n  = nodes[id];

            if (i > 0) {
                cumDist += haversine(nodes[result.path[i-1]].coords, n.coords);
            }

            if (n.type === 'location' || i === 0 || i === result.path.length - 1) {
                const div = document.createElement('div');
                let stepClass = 'step step-mid';
                let iconHtml  = '';
                let actionLabel = '';

                if (i === 0) {
                    stepClass   = 'step step-start';
                    actionLabel = 'Mulai dari';
                    iconHtml    = `<div class="step-icon start-icon"><i class="fa-solid fa-location-dot" style="color:#10b981;"></i></div>`;
                } else if (i === result.path.length - 1) {
                    stepClass   = 'step step-end';
                    actionLabel = 'Tiba di';
                    iconHtml    = `<div class="step-icon end-icon"><i class="fa-solid fa-flag-checkered" style="color:#ef4444;"></i></div>`;
                } else {
                    const prev  = nodes[result.path[i-1]].coords;
                    const next  = nodes[result.path[i+1]].coords;
                    const turn  = getTurnDirection(prev, n.coords, next);
                    actionLabel = turn.text;
                    iconHtml    = `<div class="step-icon mid-icon"><i class="fa-solid ${turn.icon}" style="color:#0ea5e9;"></i></div>`;
                }

                const distStr = cumDist > 0 ? `<div class="step-dist">~${Math.round(cumDist)} m</div>` : '';

                div.className = stepClass;
                div.style.animationDelay = `${stepDelay}ms`;
                div.innerHTML = `
                    ${iconHtml}
                    <div class="step-body">
                        <span class="step-action">${actionLabel}</span>
                        <span class="step-name">${n.icon || ''} ${n.name}</span>
                        ${distStr}
                    </div>`;
                list.appendChild(div);
                cumDist = 0;
                stepDelay += 60;
            }
        }

        document.getElementById('welcomePanel').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');

        // Smooth scroll to results on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            }, 400);
        }

    } catch (err) {
        console.error(err);
        showToast('Gagal mencari rute', 'error');
    } finally {
        clearTimeout(fallbackTimeout);
        showLoading(false);
        btn.innerHTML = '<i class="fa-solid fa-route"></i>&nbsp; CARI RUTE TERPENDEK';
        btn.disabled  = false;
    }
}

// ============================================================
// 7. GEOLOCATION — ENHANCED
// ============================================================
function handleMyLocation() {
    if (!('geolocation' in navigator)) {
        showToast('Browser tidak mendukung Geolocation.', 'error');
        return;
    }
    showLoading(true, 'Mendapatkan lokasi GPS...');
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Add/update user_loc node
            nodes['user_loc'] = {
                id: 'user_loc', name: 'Lokasi Anda Saat Ini',
                type: 'location', coords: [lat, lon], icon: '📍'
            };

            // Find nearest graph node
            let nearestNode = null, minDist = Infinity;
            Object.values(nodes).forEach(n => {
                if (n.id !== 'user_loc') {
                    const d = haversine([lat, lon], n.coords);
                    if (d < minDist) { minDist = d; nearestNode = n.id; }
                }
            });
            edges.push(['user_loc', nearestNode]);

            // Update dropdown
            const s = document.getElementById('startNode');
            Array.from(s.options).forEach((opt, idx) => {
                if (opt.value === 'user_loc') s.remove(idx);
            });
            s.add(new Option('📍 Lokasi Anda Saat Ini', 'user_loc'), 1);
            s.value = 'user_loc';

            // Remove old user marker, add premium animated one
            if (userMarker) map.removeLayer(userMarker);
            const userIcon = L.divIcon({
                className: '',
                html: `<div class="user-location-marker"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            userMarker = L.marker([lat, lon], { icon: userIcon })
                .addTo(map)
                .bindPopup(`<div class="popup-inner"><div class="popup-title">📍 Lokasi Anda</div><div class="popup-coord">${lat.toFixed(5)}, ${lon.toFixed(5)}</div></div>`);

            map.setView([lat, lon], 18, { animate: true, duration: 1.2 });
            showLoading(false);
            showToast(`📍 Lokasi berhasil didapat! (±${Math.round(position.coords.accuracy)}m)`, 'success');
        },
        err => {
            showLoading(false);
            const msgs = {
                1: 'Izin GPS ditolak. Aktifkan di pengaturan browser.',
                2: 'Posisi tidak tersedia.',
                3: 'Timeout mendapatkan GPS.'
            };
            showToast(msgs[err.code] || 'Gagal mengakses GPS.', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ============================================================
// 8. INIT — ENHANCED, LOGIC UNCHANGED
// ============================================================
async function init() {
    initMap();

    // ── Building tooltips & popups on map ────────────────────
    Object.values(nodes).forEach(n => {
        if (n.type === 'location') {
            const marker = L.circleMarker(n.coords, {
                radius: 0, opacity: 0, fillOpacity: 0, stroke: false, fill: false
            }).addTo(map);

            marker.bindTooltip(`${n.icon} ${n.name}`, {
                permanent: true,
                interactive: true,
                direction: 'top',
                className: 'building-tooltip',
                offset: [0, 0]
            });

            marker.bindPopup(`
                <div class="popup-inner">
                    <div class="popup-title">${n.icon} ${n.name}</div>
                    <div class="popup-desc">Fasilitas Universitas Bengkulu</div>
                    <div class="popup-coord">${n.coords[0].toFixed(5)}, ${n.coords[1].toFixed(5)}</div>
                </div>
            `);
        }
    });

    // ── Populate dropdowns ────────────────────────────────────
    const s = document.getElementById('startNode');
    const e = document.getElementById('endNode');
    Object.values(nodes)
        .filter(n => n.type === 'location')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(n => {
            s.add(new Option(`${n.icon} ${n.name}`, n.id));
            e.add(new Option(`${n.icon} ${n.name}`, n.id));
        });

    // ── Graph Info ────────────────────────────────────────────
    // Hitung edge unik (directed), tampilkan info graph
    const uniqueEdges = edges.length;
    document.getElementById('graphInfo').textContent =
        `${Object.keys(nodes).length} Node / ${uniqueEdges} Edge`;

    // ── Button: Find Path ─────────────────────────────────────
    // OSRM fetch dinonaktifkan — tombol langsung siap dipakai
    const btn = document.getElementById('btnFindPath');
    btn.innerHTML = '<i class="fa-solid fa-route"></i>&nbsp; CARI RUTE TERPENDEK';
    btn.disabled  = false;

    document.getElementById('btnFindPath').addEventListener('click', findPath);

    // ── Button: Reset ─────────────────────────────────────────
    document.getElementById('btnReset').addEventListener('click', () => {
        clearRouteVisualization();

        document.getElementById('results').classList.add('hidden');
        document.getElementById('welcomePanel').classList.remove('hidden');
        document.getElementById('startNode').value = '';
        document.getElementById('endNode').value   = '';
        map.flyTo([-3.7580, 102.2730], 17, { duration: 1.2 });
        showToast('Rute telah dihapus.', 'info');
    });

    // ── Button: Swap ──────────────────────────────────────────
    document.getElementById('btnSwap').addEventListener('click', () => {
        const s = document.getElementById('startNode');
        const e = document.getElementById('endNode');
        const tmp = s.value;
        s.value = e.value;
        e.value = tmp;
        // Animate swap button
        const swapBtn = document.getElementById('btnSwap');
        swapBtn.style.transform = 'translateY(-50%) rotate(180deg)';
        setTimeout(() => swapBtn.style.transform = '', 500);
    });

    // ── Button: My Location (sidebar) ────────────────────────
    document.getElementById('btnMyLocation').addEventListener('click', handleMyLocation);

    // ── Button: Locate Me (FAB on map) ────────────────────────
    document.getElementById('btnLocateMe').addEventListener('click', () => {
        if (userMarker) {
            map.setView(userMarker.getLatLng(), 18, { animate: true });
        } else {
            handleMyLocation();
        }
    });

    // ── Mobile Toggle (bottom sheet) ─────────────────────────
    const mobileToggleBtn = document.getElementById('mobileToggle');
    const mobileBackdrop  = document.getElementById('sidebarBackdrop');
    const mainSidebar     = document.getElementById('mainSidebar');

    function openSidebar() {
        mainSidebar.classList.add('open');
        mobileToggleBtn.classList.add('panel-open');
        if (mobileBackdrop) {
            mobileBackdrop.style.display = 'block';
            requestAnimationFrame(() => mobileBackdrop.classList.add('visible'));
        }
        setTimeout(() => { if (map) map.invalidateSize(); }, 500);
    }

    function closeSidebar() {
        mainSidebar.classList.remove('open');
        mobileToggleBtn.classList.remove('panel-open');
        if (mobileBackdrop) {
            mobileBackdrop.classList.remove('visible');
            setTimeout(() => { mobileBackdrop.style.display = 'none'; }, 310);
        }
        setTimeout(() => { if (map) map.invalidateSize(); }, 500);
    }

    mobileToggleBtn.addEventListener('click', () => {
        mainSidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeSidebar);
    }

    // Tap on map closes sidebar on mobile
    document.getElementById('map-wrap').addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
    });

    // ── Dark Mode Toggle ──────────────────────────────────────
    const themeBtn = document.getElementById('btnThemeToggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
        showToast(isDark ? '🌙 Dark mode aktif' : '☀️ Light mode aktif', 'info');
    });

    // ── Map Style Switcher (OSM ↔ Google Satellite) ───────────
    const styleBtn = document.getElementById('btnMapStyle');
    let isSatellite = false;  // default = OSM
    styleBtn.addEventListener('click', () => {
        if (!isSatellite) {
            map.removeLayer(osm);
            map.addLayer(gMaps);
            isSatellite = true;
            showToast('🌐 Beralih ke Google Satellite', 'info');
        } else {
            map.removeLayer(gMaps);
            map.addLayer(osm);
            isSatellite = false;
            showToast('🗺️ Beralih ke OpenStreetMap', 'info');
        }
    });

    // ── Auto re-route when mode changes ──────────────────────
    document.querySelectorAll('input[name="travelMode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const s = document.getElementById('startNode').value;
            const e = document.getElementById('endNode').value;
            if (s && e) findPath();
        });
    });

    // ── Welcome toast ─────────────────────────────────────────
    setTimeout(() => {
        showToast('Selamat datang di UNIB SmartRoute! 🗺️', 'info');
    }, 800);
}

// ============================================================
// BOOTSTRAP
// ============================================================
document.addEventListener('DOMContentLoaded', init);
