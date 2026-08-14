(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* =========================
     MENU MOBILE
  ========================= */

  const nav = $('.site-nav');
  const toggle = $('.menu-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');

      document.body.classList.toggle(
        'no-scroll',
        nav.classList.contains('open')
      );
    });

    $$('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }


  /* =========================
     CURSEUR
  ========================= */

  const cursor = $('#cursor');

  if (
    cursor &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches &&
    window.gsap
  ) {
    cursor.style.opacity = '1';

    window.addEventListener('mousemove', e => {
      gsap.to(cursor, {
        x: e.clientX - 6.5,
        y: e.clientY - 6.5,
        duration: 0.13,
        ease: 'power2.out',
        overwrite: true
      });
    });

    $$(
      'a, button, input, select, textarea, .glass-card, .odu-card'
    ).forEach(el => {

      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });

    });
  }


  /* =========================
     APPARITION AU SCROLL
  ========================= */

  if ('IntersectionObserver' in window) {

    const revealObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            revealObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    $$('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

  } else {

    $$('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });

  }


  /* =========================
     EFFET GLASS
  ========================= */

  $$('.glass-card').forEach(card => {

    card.addEventListener('pointermove', e => {

      const r = card.getBoundingClientRect();

      card.style.setProperty(
        '--mx',
        `${e.clientX - r.left}px`
      );

      card.style.setProperty(
        '--my',
        `${e.clientY - r.top}px`
      );

    });

  });


  /* =========================
     FAQ
  ========================= */

  $$('.faq-q').forEach(btn => {

    btn.addEventListener('click', () => {

      const answer = btn.nextElementSibling;

      if (!answer) return;

      const parent = btn.parentElement;

      const open = parent.classList.toggle('open');

      answer.style.maxHeight = open
        ? answer.scrollHeight + 'px'
        : '0px';

      const symbol = btn.querySelector('span:last-child');

      if (symbol) {
        symbol.textContent = open ? '−' : '+';
      }

    });

  });


  /* =========================
     FORMULAIRE CONSULTATION
  ========================= */

  const form = $('#consultation-form');

  if (form) {

    form.addEventListener('submit', e => {

      e.preventDefault();

      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }

      const success = $('.success', form);

      if (success) {

        success.classList.add('show');

        success.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

      }

      form.reset();

    });

  }


  /* =========================
     BOUTONS MAGNETIQUES
  ========================= */

  if (
    window.gsap &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches
  ) {

    $$('.magnetic').forEach(btn => {

      btn.addEventListener('pointermove', e => {

        const r = btn.getBoundingClientRect();

        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.18,
          y: (e.clientY - r.top - r.height / 2) * 0.18,
          duration: 0.35,
          ease: 'power3.out'
        });

      });

      btn.addEventListener('pointerleave', () => {

        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1,.4)'
        });

      });

    });

  }


  /* =========================
     SCÈNE 3D DU FÂ
  ========================= */

  if (
    $('#scene-canvas') &&
    window.THREE
  ) {

    initFaaScene();

  }


  function initFaaScene() {

    const canvas = $('#scene-canvas');

    if (!canvas) return;


    /* =========================
       RENDERER
    ========================= */

    let renderer;

    try {

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });

    } catch (error) {

      console.warn(
        'WebGL indisponible : la scène 3D est désactivée.',
        error
      );

      return;

    }


    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    if ('outputColorSpace' in renderer) {

      renderer.outputColorSpace = THREE.SRGBColorSpace;

    } else if ('outputEncoding' in renderer) {

      renderer.outputEncoding = THREE.sRGBEncoding;

    }


    /* =========================
       SCÈNE
    ========================= */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.set(
      0,
      1.7,
      7.2
    );


    const group = new THREE.Group();

    scene.add(group);


    /* =========================
       LUMIÈRES
    ========================= */

    const ambient = new THREE.AmbientLight(
      0xEDEAE3,
      1.2
    );

    scene.add(ambient);


    const key = new THREE.PointLight(
      0xffb37a,
      8,
      20
    );

    key.position.set(3, 4, 4);

    scene.add(key);


    const gold = new THREE.PointLight(
      0xA9822E,
      5,
      18
    );

    gold.position.set(-4, 1, -2);

    scene.add(gold);


    /* =========================
       PLATEAU
    ========================= */

    const plateGeo = new THREE.CylinderGeometry(
      2.15,
      2.25,
      0.18,
      64
    );

    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x241F1A,
      roughness: 0.48,
      metalness: 0.12
    });

    const plate = new THREE.Mesh(
      plateGeo,
      plateMat
    );

    group.add(plate);


    /* BORDURE OR */

    const rimGeo = new THREE.TorusGeometry(
      2.17,
      0.045,
      16,
      96
    );

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xA9822E,
      roughness: 0.28,
      metalness: 0.55
    });

    const rim = new THREE.Mesh(
      rimGeo,
      rimMat
    );

    rim.rotation.x = Math.PI / 2;

    plate.add(rim);


    /* SURFACE CENTRALE */

    const innerGeo = new THREE.CircleGeometry(
      1.82,
      64
    );

    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x5C2C16,
      roughness: 0.72
    });

    const inner = new THREE.Mesh(
      innerGeo,
      innerMat
    );

    inner.rotation.x = -Math.PI / 2;

    inner.position.y = 0.095;

    plate.add(inner);


    /* =========================
       IKIN
    ========================= */

    const ikinGeo = new THREE.SphereGeometry(
      0.075,
      16,
      12
    );

    const ikinMat = new THREE.MeshStandardMaterial({
      color: 0xDAD4C6,
      roughness: 0.35
    });

    const ikin = new THREE.InstancedMesh(
      ikinGeo,
      ikinMat,
      16
    );

    group.add(ikin);

    const dummy = new THREE.Object3D();


    /* =========================
       SYMBOLES
    ========================= */

    const glyphMat = new THREE.MeshBasicMaterial({
      color: 0xA9822E,
      transparent: true,
      opacity: 0.65
    });


    for (let i = 0; i < 16; i++) {

      const a = i / 16 * Math.PI * 2;

      const g = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.025,
          0.025,
          0.28
        ),
        glyphMat
      );

      g.position.set(
        Math.cos(a) * 1.62,
        0.13,
        Math.sin(a) * 1.62
      );

      g.rotation.y = -a;

      group.add(g);

    }


    /* =========================
       MODÈLE GLB OPTIONNEL
    ========================= */

    if (THREE.GLTFLoader) {

      const loader = new THREE.GLTFLoader();

      if (THREE.DRACOLoader) {

        const draco = new THREE.DRACOLoader();

        draco.setDecoderPath(
          'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );

        loader.setDRACOLoader(draco);

      }


      loader.load(
        'assets/models/opon.glb',

        g => {

          if (!g || !g.scene) return;

          const model = g.scene;

          model.rotation.x = -Math.PI / 2;

          model.scale.setScalar(2.05);


          model.traverse(n => {

            if (n.isMesh && n.material) {

              n.material.roughness = 0.65;

              n.material.side = THREE.DoubleSide;

            }

          });


          group.remove(plate);

          group.add(model);

        },

        undefined,

        error => {

          console.warn(
            'Modèle opon.glb non chargé. Le plateau 3D de secours reste affiché.',
            error
          );

        }
      );

    }


    /* =========================
       PARTICULES
    ========================= */

    const count = 420;

    const positions = new Float32Array(
      count * 3
    );


    for (let i = 0; i < count; i++) {

      const r = 3 + Math.random() * 5;

      const a = Math.random() * Math.PI * 2;

      positions[i * 3] =
        Math.cos(a) * r;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 4;

      positions[i * 3 + 2] =
        Math.sin(a) * r - 1;

    }


    const pGeo =
      new THREE.BufferGeometry();

    pGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(
        positions,
        3
      )
    );


    const particles =
      new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0xA9822E,
          size: 0.025,
          transparent: true,
          opacity: 0.6
        })
      );


    scene.add(particles);


    /* =========================
       SOURIS
    ========================= */

    let mx = 0;
    let my = 0;

    let smx = 0;
    let smy = 0;


    window.addEventListener(
      'pointermove',
      e => {

        mx =
          e.clientX /
          window.innerWidth -
          0.5;

        my =
          e.clientY /
          window.innerHeight -
          0.5;

      }
    );


    /* =========================
       ANIMATION
    ========================= */

    const clock =
      new THREE.Clock();


    function render() {

      requestAnimationFrame(render);


      const t =
        clock.getElapsedTime();


      smx +=
        (mx - smx) * 0.035;

      smy +=
        (my - smy) * 0.035;


      group.rotation.y =
        0.16 *
        Math.sin(t * 0.25) +
        smx * 0.18;


      group.rotation.x =
        -0.08 +
        smy * 0.08;


      for (let i = 0; i < 16; i++) {

        const a =
          t * 0.35 +
          i / 16 * Math.PI * 2;


        dummy.position.set(
          Math.cos(a) * 2.38,
          0.16 +
            Math.sin(t * 2 + i) * 0.035,
          Math.sin(a) * 1.25
        );


        dummy.updateMatrix();

        ikin.setMatrixAt(
          i,
          dummy.matrix
        );

      }


      ikin.instanceMatrix.needsUpdate = true;

      particles.rotation.y =
        t * 0.012;


      camera.position.x +=
        (
          smx * 0.65 -
          camera.position.x
        ) * 0.03;


      camera.position.y +=
        (
          1.7 -
          smy * 0.35 -
          camera.position.y
        ) * 0.03;


      camera.lookAt(
        0,
        0.05,
        0
      );


      renderer.render(
        scene,
        camera
      );

    }


    render();


    /* =========================
       REDIMENSIONNEMENT
    ========================= */

    window.addEventListener(
      'resize',
      () => {

        camera.aspect =
          window.innerWidth /
          window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );

      }
    );


    /* =========================
       ANIMATION 3D AU SCROLL
    ========================= */

    if (
      window.gsap &&
      window.ScrollTrigger
    ) {

      gsap.registerPlugin(
        ScrollTrigger
      );


      /*
       * ÉTAT INITIAL
       *
       * Le plateau commence grand,
       * visible et légèrement surélevé.
       */
      gsap.set(group.scale, {
        x: 1,
        y: 1,
        z: 1
      });

      gsap.set(group.position, {
        x: 0,
        y: 0,
        z: 0
      });


      /*
       * 1 — ZOOM PROGRESSIF
       *
       * Pendant la sortie de la première
       * section, le plateau devient plus grand.
       */
      gsap.to(
        group.scale,
        {
          x: 1.65,
          y: 1.65,
          z: 1.65,

          ease: 'none',

          scrollTrigger: {
            trigger: '.hero-home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4
          }
        }
      );


      /*
       * 2 — DESCENTE
       *
       * Le plateau descend doucement
       * pendant le scroll.
       */
      gsap.to(
        group.position,
        {
          y: -1.2,
          z: -1.5,

          ease: 'none',

          scrollTrigger: {
            trigger: '.hero-home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4
          }
        }
      );


      /*
       * 3 — ROTATION LÉGÈRE
       *
       * Une petite rotation donne
       * davantage de profondeur.
       */
      gsap.to(
        group.rotation,
        {
          y: '+=0.35',

          ease: 'none',

          scrollTrigger: {
            trigger: '.hero-home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4
          }
        }
      );


      /*
       * 4 — DISPARITION PROGRESSIVE
       *
       * Plus on avance dans la page,
       * plus le plateau devient discret.
       */
      gsap.to(
        canvas,
        {
          opacity: 0.08,

          ease: 'none',

          scrollTrigger: {
            trigger: '#lecture',
            start: 'top 70%',
            end: 'bottom top',
            scrub: 1
          }
        }
      );

    }

  }

})();
