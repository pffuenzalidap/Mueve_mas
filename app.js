document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      startHeroCarousel();
    });

    // --- NAVEGACIÓN SPA ---
    function navTo(viewId) {
      document.querySelectorAll('main > div').forEach(el => el.className = 'hidden-section');
      const target = document.getElementById(`section-${viewId}`);
      if(target) { target.className = 'active-section'; }
      window.scrollTo(0,0);
    }

    function scrollToSection(id) {
      navTo('landing'); 
      setTimeout(() => {
        const el = document.getElementById(id);
        if(el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 50);
    }

    // --- MODALES ---
    function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
    function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
    
    // --- CARRUSEL HERO ---
    let currentSlide = 1;
    function startHeroCarousel() {
      setInterval(() => {
        document.getElementById(`slide-${currentSlide}`).classList.remove('active');
        currentSlide = currentSlide >= 3 ? 1 : currentSlide + 1;
        document.getElementById(`slide-${currentSlide}`).classList.add('active');
      }, 7000);
    }

    // --- TESTIMONIOS ---
    function changeTesti(num) {
      document.getElementById('testi-1').className = `testi-slide absolute inset-0 ${num===1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`;
      document.getElementById('testi-2').className = `testi-slide absolute inset-0 ${num===2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`;
    }

    // --- TRIAGE ---
    let tStep = 1;
    function triageNext() {
      if(tStep === 2) {
        const riesgo = document.querySelector('input[name="tSeguridad"]:checked').value;
        const resultText = document.getElementById('tResultText');
        if(riesgo === 'riesgo') {
          resultText.innerHTML = "Por el riesgo de caídas, nuestra recomendación clínica es iniciar con evaluación a <strong>Domicilio</strong>.";
        } else {
          resultText.innerHTML = "Tu nivel de independencia es óptimo. El plan <strong>Tele-Rehab PRO</strong> se ajusta perfectamente a ti.";
        }
        document.getElementById('tFooter').classList.add('hidden');
      }
      tStep++;
      updateTriageUI();
    }
    
    function triagePrev() { tStep--; updateTriageUI(); }

    function updateTriageUI() {
      [1,2,3].forEach(s => {
        const el = document.getElementById(`tStep${s}`);
        if(el) el.style.display = (s === tStep) ? 'block' : 'none';
      });
      document.getElementById('triageProgress').style.width = `${(tStep/3)*100}%`;
      document.getElementById('tBtnPrev').style.display = tStep > 1 ? 'block' : 'none';
    }

    function closeTriageAndScroll() {
      closeModal('triageModal');
      tStep = 1; updateTriageUI(); document.getElementById('tFooter').classList.remove('hidden');
      scrollToSection('servicios');
    }

    // --- CALENDARIO DOMICILIO ---
    let selectedDateInfo = "";
    function selectDate(btn, date) {
      document.querySelectorAll('.cal-btn').forEach(el => {
        el.classList.remove('border-primary-500', 'bg-primary-50', 'text-primary-700');
      });
      btn.classList.add('border-primary-500', 'bg-primary-50', 'text-primary-700');
      
      document.getElementById('calTimes').innerHTML = `
        <label class="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition mb-3">
          <input type="radio" name="cTime" value="09:30 AM" onchange="enableCalBtn('${date}', this.value)" class="w-5 h-5 accent-primary-600">
          <span class="font-bold text-slate-800">09:30 AM (Klga. Camila)</span>
        </label>
        <label class="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
          <input type="radio" name="cTime" value="15:00 PM" onchange="enableCalBtn('${date}', this.value)" class="w-5 h-5 accent-primary-600">
          <span class="font-bold text-slate-800">15:00 PM (Klgo. Rodrigo)</span>
        </label>
      `;
      document.getElementById('btnConfirmDate').className = "bg-slate-200 text-slate-400 font-bold px-8 py-3 rounded-xl transition";
      document.getElementById('btnConfirmDate').disabled = true;
    }

    function enableCalBtn(date, time) {
      selectedDateInfo = `${date} a las ${time}`;
      const btn = document.getElementById('btnConfirmDate');
      btn.disabled = false;
      btn.className = "bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg";
    }

    function confirmDate() {
      closeModal('calendarModal');
      goToCheckout('Kinesiología a Domicilio', 40000, `Reserva temporal: ${selectedDateInfo}.`);
      document.getElementById('checkoutTimerBox').classList.remove('hidden');
      startTimer(600); 
    }

    // --- CHECKOUT & WEBPAY ---
    let timerInterval;
    function goToCheckout(name, price, details = 'Activación del plan mensual.') {
      document.getElementById('chkPlanName').innerText = name;
      document.getElementById('chkPlanPrice').innerText = `$${price.toLocaleString('es-CL')}`;
      document.getElementById('chkPlanDetails').innerText = details;
      
      document.getElementById('checkoutTimerBox').classList.add('hidden');
      clearInterval(timerInterval);
      navTo('checkout');
    }

    function startTimer(duration) {
      let timer = duration;
      const display = document.getElementById('checkoutTimer');
      timerInterval = setInterval(() => {
        let m = parseInt(timer / 60, 10);
        let s = parseInt(timer % 60, 10);
        display.textContent = (m<10?"0"+m:m) + ":" + (s<10?"0"+s:s);
        if (--timer < 0) {
          clearInterval(timerInterval);
          alert('Tiempo expirado. La hora ha sido liberada.');
          navTo('landing');
        }
      }, 1000);
    }

    function simulatePayment() {
      const btn = document.getElementById('btnWebpay');
      const oldHTML = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Procesando Pago...`;
      btn.disabled = true;
      lucide.createIcons();

      setTimeout(() => {
        clearInterval(timerInterval);
        btn.innerHTML = oldHTML;
        btn.disabled = false;
        navTo('portal');
      }, 3000);
    }