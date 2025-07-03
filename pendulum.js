/* global createCanvas, createVector, select, sin, cos, radians, sq */

let angle, aVel = 0, aAcc = 0;
let g = 0.4;
let len = 200, mass = 5;
let origin;
let running = true;

let PE = [], KE = [], E = [];

// HTML elemen (ambil setelah halaman siap)
function setup() {
  const canvas = createCanvas(700, 480);
  canvas.parent("canvas-container");
  origin = createVector(width / 2, 100);

  // Slider + input angka
  const angleS = select("#angleSlider"),  angleI = select("#angleInput");
  const lenS   = select("#lengthSlider"), lenI   = select("#lengthInput");
  const massS  = select("#massSlider"),   massI  = select("#massInput");

  const sync = () => {   // sinkron dua‑arah
    angleI.value(angleS.value());  lenI.value(lenS.value());  massI.value(massS.value());
  };
  sync();
  angleS.input(() => { angleI.value(angleS.value()); });
  lenS.input  (() => { lenI.value(lenS.value());   });
  massS.input (() => { massI.value(massS.value()); });

  angleI.input(() => { angleS.value(angleI.value()); });
  lenI.input  (() => { lenS.value(lenI.value());     });
  massI.input (() => { massS.value(massI.value());   });

  // Tombol
  select("#startBtn").mousePressed(() => running = true);
  select("#stopBtn").mousePressed (() => running = false);
  select("#resetBtn").mousePressed(resetPendulum);

  resetPendulum();
}

function resetPendulum() {
  len  = parseFloat(select("#lengthSlider").value());
  mass = parseFloat(select("#massSlider").value());
  angle = radians(parseFloat(select("#angleSlider").value()));

  aVel = 0;
  PE = []; KE = []; E = [];
  localStorage.clear();   // kosongkan gudang data
}

function draw() {
  background(255);

  if (running) {
    aAcc = (-g / len) * sin(angle);
    aVel += aAcc;
    angle += aVel;
    aVel *= 0.995;   // redaman ringan agar tidak “tak hingga”
  }

  // Posisi bob
  const bobX = origin.x + len * sin(angle);
  const bobY = origin.y + len * cos(angle);

  // Gambar tali & bob
  stroke(60); strokeWeight(3);
  line(origin.x, origin.y, bobX, bobY);
  fill(80, 80, 255); stroke(0); strokeWeight(1);
  ellipse(bobX, bobY, mass * 5, mass * 5);

  // Hitung energi
  const h = len * (1 - cos(angle));
  const pe = mass * g * h;
  const ke = 0.5 * mass * sq(len * aVel);
  const e  = pe + ke;

  // Simpan riwayat
  PE.push(pe); KE.push(ke); E.push(e);
  if (PE.length > 700) { PE.shift(); KE.shift(); E.shift(); }

  // Kirim ke localStorage (string‑kan dulu)
  // Simpan riwayat energi
PE.push(pe);
KE.push(ke);
E.push(e);

if (PE.length > 700) {
  PE.shift();
  KE.shift();
  E.shift();
}

// Simpan semua ke localStorage
localStorage.setItem("PEdata", JSON.stringify(PE));
localStorage.setItem("KEdata", JSON.stringify(KE));
localStorage.setItem("Edata",  JSON.stringify(E));

// Simpan energi terakhir untuk ditampilkan
localStorage.setItem("PE_last", pe.toFixed(2));
localStorage.setItem("KE_last", ke.toFixed(2));
localStorage.setItem("E_last",  e.toFixed(2));

// Warna tali berubah
stroke(100, 100, 255);
strokeWeight(4);
line(origin.x, origin.y, bobX, bobY);

// Bola gradien
noStroke();
for (let r = mass * 2.5; r > 0; r -= 1) {
  fill(80, 80, 255, map(r, 0, mass * 2.5, 255, 50));
  ellipse(bobX, bobY, r * 2, r * 2);
}
}
