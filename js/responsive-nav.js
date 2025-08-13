
/**
 * Standalone mobile drawer (no dependency on #navMenu).
 * - Builds #mobileDrawer and #navOverlay dynamically
 * - Clones .nav-link from the page (desktop header) into the drawer
 * - Desktop remains untouched
 */
(function(){
  'use strict';
  const qs = (s, ctx=document) => ctx.querySelector(s);
  const qsa = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  function ready(fn){ 
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(() => {
    const toggle = qs('#burger');
    if(!toggle) return;

    // Overlay
    let overlay = qs('#navOverlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }

    // Drawer
    let drawer = qs('#mobileDrawer');
    if(!drawer){
      drawer = document.createElement('aside');
      drawer.id = 'mobileDrawer';
      drawer.setAttribute('role','dialog');
      drawer.setAttribute('aria-modal','true');
      drawer.setAttribute('aria-label','Mobile navigation');

      const closeBtn = document.createElement('button');
      closeBtn.className = 'drawer-close';
      closeBtn.setAttribute('aria-label','Close menu');
      closeBtn.innerHTML = '&times;';

      const nav = document.createElement('nav');
      nav.className = 'drawer-nav';

      drawer.appendChild(closeBtn);
      drawer.appendChild(nav);
      document.body.appendChild(drawer);
    }

    const navContainer = qs('.drawer-nav', drawer);

    function syncLinks(){
      navContainer.innerHTML = '';
      // Prefer header links
      const header = qs('header') || document;
      // Grab visible nav-link elements from the header/navbar area first
      const desktopLinks = qsa('.nav-link', header);
      const links = desktopLinks.length ? desktopLinks : qsa('.nav-link');
      links.forEach(a => {
        const clone = a.cloneNode(true);
        clone.classList.remove('active');
        navContainer.appendChild(clone);
      });
      if(!navContainer.children.length){
        // Fallback basic items (prevent empty state)
        ['Home','About','Projects','Blog','Contact'].forEach((txt,i)=>{
          const a = document.createElement('a');
          a.className='nav-link';
          a.href = ['#home','#about','#projects','blog.html','#contact'][i] || '#';
          a.textContent = txt;
          navContainer.appendChild(a);
        });
      }
    }

    function open(){
      syncLinks();
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      toggle.checked = true;
      // close on link click
    }

    function close(){
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      toggle.checked = false;
    }

    toggle.addEventListener('change', (e)=>{
      e.target.checked ? open() : close();
    });
    overlay.addEventListener('click', close);
    drawer.addEventListener('click', (e)=>{
      if (e.target.closest('.drawer-close')) { close(); return; }
      const link = e.target.closest('.nav-link');
      if(link) close();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') close();
    });

    // Swipe left to close
    let startX = null;
    drawer.addEventListener('touchstart', (e)=>{ startX = e.changedTouches[0].clientX; }, {passive:true});
    drawer.addEventListener('touchend', (e)=>{
      if(startX==null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if(dx < -50) close();
      startX = null;
    }, {passive:true});

    // Close on desktop resize
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 768 && drawer.classList.contains('open')) close();
    });
  });
})();
