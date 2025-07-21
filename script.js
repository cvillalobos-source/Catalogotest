let clickCount = 0;
let clickTimer;
document.body.addEventListener('click', (e) => {
  if (e.clientX < 50 && e.clientY < 50) {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clickCount = 0, 1000);
    if (clickCount >= 10) {
      document.getElementById('admin-panel').classList.add('visible');
      clickCount = 0;
    }
  }
});

window.addEventListener('scroll', () => {
  document.getElementById('howto').style.display = 'none';
});

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const contenido = document.getElementById('contenido');
    const adminList = document.getElementById('admin-list');
    const homeGrid = document.getElementById('home-grid');

    data.forEach((marca, mIndex) => {
      const logo = document.createElement('img');
      logo.src = marca.logo;
      logo.className = 'marca-logo';
      logo.onclick = () => {
        document.getElementById(`marca-${mIndex}`).scrollIntoView({ behavior: 'smooth' });
        document.getElementById("info-puffs").textContent = marca.barra.puffs + " puffs";
        document.getElementById("info-boost").textContent = marca.barra.boost || "-";
        document.getElementById("info-bateria").textContent = marca.barra.bateria;
        document.getElementById("info-intensidad").textContent = marca.barra.intensidad || "-";
      };
      homeGrid.appendChild(logo);

      const section = document.createElement('section');
      section.className = 'catalogo';
      section.id = `marca-${mIndex}`;
      contenido.appendChild(section);

      marca.productos.forEach((producto, pIndex) => {
        const prod = document.createElement('div');
        prod.className = 'producto';
        prod.id = `m${mIndex}-p${pIndex}`;
        prod.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <p>${producto.nombre}</p>
          ${producto.estado === 'agotado' ? '<div class="agotado-overlay">AGOTADO</div>' : ''}
        `;
        section.appendChild(prod);

        const li = document.createElement('li');
        li.innerHTML = `
          ${marca.marca} - ${producto.nombre}
          <select onchange="document.getElementById('${prod.id}').querySelector('.agotado-overlay')?.remove(); if(this.value==='agotado'){const overlay=document.createElement('div');overlay.className='agotado-overlay';overlay.textContent='AGOTADO';document.getElementById('${prod.id}').appendChild(overlay);}">
            <option value="disponible" ${producto.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
            <option value="agotado" ${producto.estado === 'agotado' ? 'selected' : ''}>Agotado</option>
          </select>
        `;
        adminList.appendChild(li);
      });
    });
  });
