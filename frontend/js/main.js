// =========================================
// CONTACT FORM
// =========================================

// Find the contact form on the page
const contactForm = document.querySelector('#contact-form');

// main.js loads on every page, but only the Contact page has this form.
// So we only run this code if the form actually exists.
if (contactForm) {

  // Run this function when the user clicks "Send Message"
  contactForm.addEventListener('submit', function (event) {

    // Stop the browser's default action (reloading the page)
    event.preventDefault();

    // Show a thank-you message
    const status = document.querySelector('#form-status');
    status.textContent = 'Thank you! Your message has been received. (Demo: messages are not sent yet.)';

    // Clear all the fields
    contactForm.reset();
  });
}



// =========================================
// BOOKING PAGE: TIME SLOTS + SAVING
// =========================================

const bookingForm = document.querySelector('#booking-form');

// Only run this on the booking page
if (bookingForm) {

  // ---------- Settings (later these come from the database) ----------

  // How long each service takes, in minutes
  const SERVICE_DURATIONS = {
    'checkup': 45,
    'child-checkup': 30,
    'filling': 45,
    'whitening': 60,
    'extraction': 45,
    'emergency': 30
  };

  // Opening hours, in minutes after midnight
  const OPEN_TIME = 8 * 60 + 30;  // 8:30am
  const CLOSE_TIME = 17 * 60;     // 5:00pm
  const SLOT_STEP = 30;           // a new start time every 30 minutes

  // Demo: times that are already booked (same every weekday)
  const DEMO_BOOKINGS = [
    { practitioner: 'aroha', start: '10:00', end: '10:45' },
    { practitioner: 'aroha', start: '14:00', end: '15:00' },
    { practitioner: 'james', start: '09:00', end: '09:45' },
    { practitioner: 'mei',   start: '11:30', end: '12:15' }
  ];

  // ---------- Find the form fields ----------
  const serviceSelect = document.querySelector('#service');
  const practitionerSelect = document.querySelector('#practitioner');
  const dateInput = document.querySelector('#date');
  const slotsBox = document.querySelector('#time-slots');
  const bookingStatus = document.querySelector('#booking-status');

  // Today's date as "YYYY-MM-DD" (the format the date box uses)
  const todayText = new Date().toLocaleDateString('en-CA');

  // Stop people picking a past date in the calendar
  dateInput.min = todayText;

  // ---------- Small helper functions ----------

  // "09:30" -> 570 (minutes after midnight)
  function toMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // 570 -> "09:30"
  function toValue(minutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0');
    const m = String(minutes % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  // 570 -> "9:30am"
  function toTimeText(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = String(minutes % 60).padStart(2, '0');
    const suffix = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${mins}${suffix}`;
  }

  // Is the date a Saturday or Sunday?
  function isWeekend(dateText) {
    const day = new Date(dateText + 'T00:00').getDay(); // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6;
  }

  // Bookings saved in this browser (Version 1 storage)
  function getSavedBookings() {
    try {
      return JSON.parse(localStorage.getItem('smileBookings')) || [];
    } catch (error) {
      return [];
    }
  }

  // Does this time overlap an existing booking for this practitioner?
  function isTaken(practitioner, start, end) {
    const date = dateInput.value;

    // Demo bookings (every weekday) + real bookings saved for this date
    const savedForDate = getSavedBookings().filter(function (booking) {
      return booking.date === date;
    });
    const allBookings = DEMO_BOOKINGS.concat(savedForDate);

    return allBookings.some(function (booking) {
      return booking.practitioner === practitioner &&
             start < toMinutes(booking.end) &&
             end > toMinutes(booking.start);
    });
  }

  // Has this time already passed today?
  function isPast(dateText, start) {
    if (dateText !== todayText) return false;
    const now = new Date();
    return start <= now.getHours() * 60 + now.getMinutes();
  }

  // Show a message instead of time buttons
  function showMessage(text) {
    slotsBox.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'slots-message';
    message.textContent = text;
    slotsBox.appendChild(message);
  }

  // ---------- Build the time buttons ----------
  function renderSlots() {
    const service = serviceSelect.value;
    const practitioner = practitionerSelect.value;
    const date = dateInput.value;

    if (!service || !practitioner || !date) {
      showMessage('Choose a service, practitioner and date to see available times.');
      return;
    }

    if (date < todayText) {
      showMessage('Please choose today or a future date.');
      return;
    }

    if (isWeekend(date)) {
      showMessage('We are closed on weekends. Please choose a weekday.');
      return;
    }

    const duration = SERVICE_DURATIONS[service];
    let availableCount = 0;
    slotsBox.innerHTML = '';

    // Try every start time; the appointment must finish by closing time
    for (let start = OPEN_TIME; start + duration <= CLOSE_TIME; start += SLOT_STEP) {
      const end = start + duration;
      const unavailable = isTaken(practitioner, start, end) || isPast(date, start);

      const label = document.createElement('label');
      label.className = 'slot';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'time';
      radio.value = toValue(start);
      radio.required = true;
      radio.disabled = unavailable;

      const text = document.createElement('span');
      text.textContent = toTimeText(start);

      label.append(radio, text);
      slotsBox.appendChild(label);

      if (!unavailable) availableCount++;
    }

    if (availableCount === 0) {
      showMessage('No times left on this day. Please choose another date.');
    }
  }

  // Rebuild the time buttons whenever a choice changes
  serviceSelect.addEventListener('change', renderSlots);
  practitionerSelect.addEventListener('change', renderSlots);
  dateInput.addEventListener('change', renderSlots);

  // ---------- Save the booking ----------
  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the page reloading

    const chosenTime = bookingForm.querySelector('input[name="time"]:checked');
    if (!chosenTime) {
      bookingStatus.textContent = 'Please choose a time.';
      return;
    }

    const service = serviceSelect.value;
    const practitioner = practitionerSelect.value;
    const date = dateInput.value;
    const start = toMinutes(chosenTime.value);
    const end = start + SERVICE_DURATIONS[service];

    // Check again right before saving, in case the slot was taken meanwhile
    if (isTaken(practitioner, start, end) || isPast(date, start)) {
      bookingStatus.textContent = 'Sorry, that time is no longer available. Please choose another.';
      renderSlots();
      return;
    }

    const booking = {
      id: Date.now(),
      service: service,
      serviceName: serviceSelect.options[serviceSelect.selectedIndex].text,
      practitioner: practitioner,
      practitionerName: practitionerSelect.options[practitionerSelect.selectedIndex].text,
      date: date,
      start: toValue(start),
      end: toValue(end),
      patientName: document.querySelector('#patient-name').value.trim(),
      patientEmail: document.querySelector('#patient-email').value.trim(),
      patientPhone: document.querySelector('#patient-phone').value.trim(),
      notes: document.querySelector('#notes').value.trim()
    };

    // Save it (Version 1: in this browser; Version 2: sent to the backend)
    const bookings = getSavedBookings();
    bookings.push(booking);
    localStorage.setItem('smileBookings', JSON.stringify(bookings));

    // Show a friendly confirmation
    const niceDate = new Date(date + 'T00:00').toLocaleDateString('en-NZ', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    bookingStatus.textContent =
      `Booked! ${booking.serviceName} with ${booking.practitionerName} on ${niceDate} at ${toTimeText(start)}. ` +
      '(Demo: saved in this browser only.)';
    bookingStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

    bookingForm.reset();
    renderSlots();
  });

   // ---------- "Your bookings" list ----------
  const bookingList = document.querySelector('#booking-list');

  // "2026-11-23" -> "Monday, 23 November 2026"
  function formatDate(dateText) {
    return new Date(dateText + 'T00:00').toLocaleDateString('en-NZ', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function renderBookings() {
    const bookings = getSavedBookings();
    bookingList.innerHTML = '';

    if (bookings.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'booking-empty';
      empty.textContent = 'You have no bookings yet.';
      bookingList.appendChild(empty);
      return;
    }

    // Soonest appointment first
    bookings.sort(function (a, b) {
      return (a.date + a.start).localeCompare(b.date + b.start);
    });

    bookings.forEach(function (booking) {
      const when = `${formatDate(booking.date)}, ${toTimeText(toMinutes(booking.start))} – ${toTimeText(toMinutes(booking.end))}`;

      const item = document.createElement('li');
      item.className = 'booking-item';

      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = `${booking.serviceName} · ${booking.practitionerName}`;
      const time = document.createElement('p');
      time.textContent = when;
      details.append(title, time);

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'btn btn-cancel';
      cancelButton.textContent = 'Cancel';
      cancelButton.setAttribute('aria-label', `Cancel ${booking.serviceName} on ${when}`);
      cancelButton.addEventListener('click', function () {
        cancelBooking(booking.id);
      });

      item.append(details, cancelButton);
      bookingList.appendChild(item);
    });
  }

  function cancelBooking(id) {
    if (!confirm('Cancel this appointment?')) return;

    // Keep every booking except the cancelled one
    const remaining = getSavedBookings().filter(function (booking) {
      return booking.id !== id;
    });
    localStorage.setItem('smileBookings', JSON.stringify(remaining));

    bookingStatus.textContent = 'Your appointment has been cancelled.';
    renderBookings();
    renderSlots(); // the freed time becomes available again
  }

  // Update the list after each booking, and when the page loads
  bookingForm.addEventListener('submit', renderBookings);
  renderBookings(); 
}

