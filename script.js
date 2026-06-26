document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     ELEMENTI LIGHTBOX
  ========================= */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');

  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let items = [];
  let currentIndex = 0;

  /* =========================
     OPEN LIGHTBOX
  ========================= */
  function openLightbox(index) {
    currentIndex = index;

    const el = items[index];

    document.body.style.overflow = "hidden";

    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "none";
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;

    if (el.tagName === "IMG") {
      lightboxImg.src = el.src;
      lightboxImg.style.display = "block";
      lightboxCaption.textContent = el.alt || "";
    } else {
      const src = el.querySelector("source").src;
      lightboxVideo.src = src;
      lightboxVideo.style.display = "block";
      lightboxVideo.play();
      lightboxCaption.textContent = "Video";
    }

    lightbox.classList.add("show");
  }

  /* =========================
     LIGHTBOX NAV
  ========================= */
  function setupLightbox() {

    items.forEach((el, i) => {
      el.addEventListener("click", () => openLightbox(i));
    });

    closeBtn.onclick = () => {
      lightbox.classList.remove("show");
      lightboxVideo.pause();
      document.body.style.overflow = "";
    };

    lightbox.onclick = (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("show");
        lightboxVideo.pause();
        document.body.style.overflow = "";
      }
    };

    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      openLightbox(currentIndex);
    };

    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % items.length;
      openLightbox(currentIndex);
    };

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("show")) return;

      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        openLightbox(currentIndex);
      }

      if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % items.length;
        openLightbox(currentIndex);
      }

      if (e.key === "Escape") {
        lightbox.classList.remove("show");
        lightboxVideo.pause();
        document.body.style.overflow = "";
      }
    });
  }

  /* =========================
     SCROLL INFINITO GALLERY
  ========================= */
  function startGallery() {

    const gallery = document.querySelector('.galleria');

    let speed = window.innerWidth <= 768 ? 0.4 : 0.5;
    let pos = 0;
    let paused = false;

    /* CLONE PER LOOP */
    const clones = Array.from(gallery.children).map(el => el.cloneNode(true));
    clones.forEach(el => gallery.appendChild(el));

    const galleryWidth = gallery.scrollWidth / 2;

    function animate() {
      if (!paused) {
        pos += speed;
        if (pos >= galleryWidth) pos = 0;
        gallery.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(animate);
    }

    gallery.addEventListener("mouseenter", () => paused = true);
    gallery.addEventListener("mouseleave", () => paused = false);

    animate();
  }

  /* =========================
     CARICAMENTO DA GALLERY.JSON
  ========================= */
  fetch("./gallery.json")
    .then(res => res.json())
    .then(files => {

      const gallery = document.getElementById("gallery");

      files.forEach(file => {

        const ext = file.split('.').pop().toLowerCase();

        if (["jpg", "jpeg", "png", "webp"].includes(ext)) {

          const img = document.createElement("img");
          img.src = file;
          img.alt = "";
          gallery.appendChild(img);

        } else if (["mp4", "webm"].includes(ext)) {

          const video = document.createElement("video");
          video.className = "gallery-video";
          video.muted = true;
          video.loop = true;
          video.playsInline = true;

          const source = document.createElement("source");
          source.src = file;
          video.appendChild(source);

          gallery.appendChild(video);
        }
      });

      /* IMPORTANTISSIMO: dopo creazione DOM */
      items = Array.from(document.querySelectorAll('.galleria img, .galleria video'));

      setupLightbox();
      startGallery();

    })
    .catch(err => console.error("Errore gallery:", err));

  /* =========================
     MODAL CONTATTI (EMAILJS)
  ========================= */
  emailjs.init("vnk-4DyEAXegl_09R");

  const modal = document.getElementById("contactModal");
  const btn = document.getElementById("openForm");
  const close = document.querySelector(".close");
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMessage");

  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_54iva8h", "template_54aey3u", this)
      .then(() => {

        successMsg.style.display = "block";
        form.reset();

        setTimeout(() => {
          successMsg.style.display = "none";
          modal.style.display = "none";
        }, 2000);

      })
      .catch(() => {
        alert("Errore invio email");
      });
  });

});
