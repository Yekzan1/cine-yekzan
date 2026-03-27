/**
 * Ciné Yekzan - Enhancements
 * Ajoute les fonctionnalités de vidéos YouTube, réservations et emails
 * sans modifier le design existant
 */

(function() {
  'use strict';

  // Configuration des films avec vidéos YouTube
  const moviesData = {
    'sonic-3': {
      title: 'Sonic 3 le Film',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      movieUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Sonic, Knuckles et Tails se réunissent contre un nouvel ennemi puissant, Shadow, un hérisson noir mystérieux dont les pouvoirs surpassent tout ce qu\'ils ont jamais vu.'
    },
    'sonic-2': {
      title: 'Sonic 2 le Film',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      movieUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Sonic doit arrêter le Dr Robotnik et son nouvel allié Knuckles. Une aventure épique à travers le monde.'
    },
    'sonic-1': {
      title: 'Sonic le Film',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      movieUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Le premier film Sonic où le hérisson bleu arrive sur Terre et doit combattre le Dr Robotnik.'
    }
  };

  // Système de réservation
  class ReservationSystem {
    constructor() {
      this.reservations = this.loadReservations();
    }

    loadReservations() {
      const stored = localStorage.getItem('cine_yekzan_reservations');
      return stored ? JSON.parse(stored) : [];
    }

    saveReservations() {
      localStorage.setItem('cine_yekzan_reservations', JSON.stringify(this.reservations));
    }

    createReservation(movieId, email, seats, date) {
      const reservation = {
        id: Date.now(),
        movieId,
        email,
        seats,
        date,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      this.reservations.push(reservation);
      this.saveReservations();
      this.sendConfirmationEmail(reservation);
      return reservation;
    }

    sendConfirmationEmail(reservation) {
      // Simulation d'envoi d'email
      const movieData = moviesData[reservation.movieId];
      const emailContent = `
        Bonjour,

        Votre réservation a été confirmée!

        Film: ${movieData ? movieData.title : 'Film'}
        Email: ${reservation.email}
        Nombre de places: ${reservation.seats}
        Date: ${new Date(reservation.date).toLocaleDateString('fr-FR')}
        Numéro de réservation: ${reservation.id}

        Merci de votre confiance!
        Ciné Yekzan
      `;

      // En production, cela appellerait une API backend
      console.log('Email de confirmation envoyé:', emailContent);
      
      // Afficher une notification
      this.showNotification('Réservation confirmée! Un email de confirmation a été envoyé.');
    }

    showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'cine-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    getReservations() {
      return this.reservations;
    }
  }

  // Gestionnaire de vidéos YouTube
  class VideoManager {
    static embedTrailer(movieId, containerId) {
      const movieData = moviesData[movieId];
      if (!movieData) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      const iframe = document.createElement('iframe');
      iframe.src = movieData.trailerUrl;
      iframe.width = '100%';
      iframe.height = '400';
      iframe.frameborder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      container.innerHTML = '';
      container.appendChild(iframe);
    }

    static embedMovie(movieId, containerId) {
      const movieData = moviesData[movieId];
      if (!movieData) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      const iframe = document.createElement('iframe');
      iframe.src = movieData.movieUrl;
      iframe.width = '100%';
      iframe.height = '600';
      iframe.frameborder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      container.innerHTML = '';
      container.appendChild(iframe);
    }
  }

  // Formulaire de réservation
  class ReservationForm {
    static createForm(movieId) {
      const form = document.createElement('form');
      form.className = 'cine-reservation-form';
      form.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.8); padding: 2rem; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
          <h3 style="color: #fff; margin-bottom: 1.5rem;">Réserver vos places</h3>
          
          <div style="margin-bottom: 1rem;">
            <label style="color: #a0a0a0; display: block; margin-bottom: 0.5rem;">Email</label>
            <input type="email" name="email" required style="width: 100%; padding: 0.7rem; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; color: #fff;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="color: #a0a0a0; display: block; margin-bottom: 0.5rem;">Nombre de places</label>
            <input type="number" name="seats" min="1" max="10" value="1" required style="width: 100%; padding: 0.7rem; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; color: #fff;">
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="color: #a0a0a0; display: block; margin-bottom: 0.5rem;">Date de la séance</label>
            <input type="date" name="date" required style="width: 100%; padding: 0.7rem; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; color: #fff;">
          </div>

          <button type="submit" style="width: 100%; padding: 0.8rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
            Confirmer la réservation
          </button>
        </div>
      `;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[name="email"]').value;
        const seats = form.querySelector('input[name="seats"]').value;
        const date = form.querySelector('input[name="date"]').value;

        reservationSystem.createReservation(movieId, email, seats, date);
        form.reset();
      });

      return form;
    }
  }

  // Initialisation
  const reservationSystem = new ReservationSystem();

  // Exposer les fonctionnalités globalement
  window.CineYekzan = {
    VideoManager,
    ReservationSystem: reservationSystem,
    ReservationForm,
    moviesData,
    embedTrailer: (movieId, containerId) => VideoManager.embedTrailer(movieId, containerId),
    embedMovie: (movieId, containerId) => VideoManager.embedMovie(movieId, containerId),
    createReservationForm: (movieId) => ReservationForm.createForm(movieId),
    makeReservation: (movieId, email, seats, date) => reservationSystem.createReservation(movieId, email, seats, date)
  };

  // Ajouter les styles CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .cine-notification {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .cine-reservation-form input {
      font-family: 'Sora', sans-serif;
    }

    .cine-reservation-form button:hover {
      background: #2563eb !important;
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(style);

  console.log('Ciné Yekzan Enhancements loaded successfully!');
})();
