
const gallery = document.querySelector('.galleria');
let speed = window.innerWidth <= 768 ? 0.2 : 0.5;
let pos = 0;
let paused = false;

// Clona le immagini per loop continuo
const galleryItems = gallery.children;
const clone = Array.from(galleryItems).map(el => el.cloneNode(true));
clone.forEach(el => gallery.appendChild(el));
const galleryWidth = gallery.scrollWidth / 2; // larghezza originale

// Funzione animazione
function animate() {
	if (!paused) {
		pos += speed;
		if (pos >= galleryWidth) pos = 0; // loop infinito
		gallery.style.transform = `translateX(-${pos}px)`;
	}
	requestAnimationFrame(animate);
}

// Pausa quando il mouse è sopra
gallery.addEventListener('mouseenter', () => paused = true);
gallery.addEventListener('mouseleave', () => paused = false);

// Avvia animazione
animate();
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementsByClassName('lightbox-close')[0];
const prevBtn = document.getElementsByClassName('lightbox-prev')[0];
const nextBtn = document.getElementsByClassName('lightbox-next')[0];

const items = Array.from(document.querySelectorAll('.galleria img, .galleria video'));
let currentIndex = 0;
let startX = 0;
let endX = 0;	

// Funzione per aprire il lightbox
function openLightbox(index) {
	currentIndex = index;

	const element = items[index];
	document.body.style.overflow = 'hidden';

	// reset
	lightboxImg.style.display = 'none';
	lightboxVideo.style.display = 'none';
	lightboxVideo.pause();
	lightboxVideo.currentTime = 0;

	if (element.tagName === 'IMG') {
		lightboxImg.src = element.src;
		lightboxImg.style.display = 'block';
		lightboxCaption.textContent = element.alt || '';
	} else {
		lightboxVideo.src = element.querySelector('source').src;
		lightboxVideo.style.display = 'block';
		lightboxVideo.play();
		lightboxCaption.textContent = "Video";
	}

	// MOSTRA DOPO aver preparato contenuto
	lightbox.classList.add('show');
}
// Apri cliccando un'immagine
items.forEach((el, idx) => {
	el.addEventListener('click', () => openLightbox(idx));
});

// Chiudi lightbox
closeBtn.onclick = () => {
	lightbox.classList.remove('show');
	lightboxVideo.pause();
}
lightbox.onclick = (e) => {
	if(e.target==lightbox) {
		lightbox.classList.remove('show');
		lightboxVideo.pause();
	}
document.body.style.overflow = '';	
}


// Frecce avanti/indietro
prevBtn.onclick = () => {
	currentIndex = (currentIndex - 1 + items.length) % items.length;
	openLightbox(currentIndex);
}

nextBtn.onclick = () => {
	currentIndex = (currentIndex + 1) % items.length;
	openLightbox(currentIndex);
}
document.addEventListener('keydown', (e) => {
	if (lightbox.classList.contains('show')) {

		if (e.key === 'ArrowLeft') {
			currentIndex = (currentIndex - 1 + items.length) % items.length;
			openLightbox(currentIndex);
		}

		if (e.key === 'ArrowRight') {
			currentIndex = (currentIndex + 1) % items.length;
			openLightbox(currentIndex);
		}

		if (e.key === 'Escape') {
			lightbox.classList.remove('show');
			lightboxVideo.pause();
		}
	}
});

// TOUCH START
lightbox.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
}, { passive: true });

// TOUCH END
lightbox.addEventListener('touchend', (e) => {
	endX = e.changedTouches[0].clientX;
	handleSwipe();
}, { passive: true });

// FUNZIONE SWIPE
function handleSwipe() {
	const diff = startX - endX;

	if (Math.abs(diff) < 50) return;

	if (diff > 0) {
		currentIndex = (currentIndex + 1) % items.length;
	} else {
		currentIndex = (currentIndex - 1 + items.length) % items.length;
	}

	openLightbox(currentIndex);
}

const modal = document.getElementById("contactModal");
const btn = document.getElementById("openForm");
const close = document.querySelector(".close");

btn.onclick = () => modal.style.display = "block";
close.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
	if (e.target == modal) modal.style.display = "none";
};
document.addEventListener("DOMContentLoaded", function () {

  // EMAILJS INIT
  emailjs.init("vnk-4DyEAXegl_09R");

  // ELEMENTI MODAL
  const modal = document.getElementById("contactModal");
  const btn = document.getElementById("openForm");
  const close = document.querySelector(".close");
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMessage");

  // APRI MODAL
  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // CHIUDI MODAL (X)
  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // CHIUDI CLICCANDO FUORI
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // INVIO FORM
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_54iva8h",
      "template_54aey3u",
      this
    )
    .then(() => {

      // mostra messaggio successo
      successMsg.style.display = "block";

      // reset form
      form.reset();

      // chiudi dopo 2 sec
      setTimeout(() => {
        successMsg.style.display = "none";
        modal.style.display = "none";
      }, 2000);

    })
    .catch((error) => {
      console.log("Errore invio:", error);
      alert("Errore invio email");
    });
  });

});
