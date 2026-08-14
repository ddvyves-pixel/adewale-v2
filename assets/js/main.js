(() => {
  'use strict';

  /* =========================================================
     ADEWALE — MAIN.JS
     Version sécurisée :
     - GSAP facultatif
     - Three.js facultatif
     - aucune animation ne doit bloquer le site
  ========================================================= */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasThree = typeof window.THREE !== 'undefined';

  /* =========================================================
     UTILITAIRES
  ========================================================= */

  function safeGSAP(callback) {
    if (hasGSAP) {
      try {
        callback();
      } catch (error) {
        console.warn('ADEWALE — GSAP non disponible pour cette animation.', error);
      }
    }
  }

  /* =========================================================
     NAVIGATION MOBILE
  ========================================================= */

  const nav = $('.site-nav');
  const toggle = $('.menu-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    $$('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* =========================================================
     RIDEAU DE TRANSITION
     
     IMPORTANT :
     Le site ne doit JAMAIS rester bloqué par le rideau,
     même si GSAP ne se charge pas.
  ========================================================= */

  const curtain = $('.page-curtain');

  if (curtain) {

    // Sécurité absolue : le rideau disparaît même sans GSAP.
    const removeCurtain = () => {
      curtain.style.transform = 'translateY(-100%)';
      curtain.style.opacity = '0';
      curtain.style.pointerEvents = 'none';

      setTimeout(() => {
        curtain.style.display = 'none';
      }, 900);
    };

    // On laisse le navigateur afficher le site avant l'animation.
    requestAnimationFrame(() => {

      if (hasGSAP) {
        try {

          gsap.set(curtain, {
            yPercent: 0,
            opacity: 1,
            display: 'block'
          });

          gsap.to(curtain, {
            yPercent: -100,
            duration: 0.75,
            ease: 'power4.inOut',
            onComplete: () => {
              curtain.style.pointerEvents = 'none';
            }
          });

        } catch (error) {
          console.warn('ADEWALE — Animation du rideau désactivée.', error);
          removeCurtain();
        }

      } else {

        // FALLBACK SANS GSAP
        curtain.style.transition =
          'transform .75s cubic-bezier(.16,1,.3,1), opacity .75s ease';

        requestAnimationFrame(() => {
          curtain.style.transform = 'translateY(-100%)';
          curtain.style.opacity = '0';
          curtain.style.pointerEvents = 'none';
        });

        setTimeout(() => {
          curtain.style.display = 'none';
        }, 900);
      }
    });

    /* ---------------------------------------------------------
       Navigation entre les pages
    --------------------------------------------------------- */

    $$('.nav-links a, .logo, .footer a').forEach(link => {

      const href = link.getAttribute('href');

      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      link.addEventListener('click', e => {

        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }

        e.preventDefault();

        // Si GSAP existe : transition élégante.
        if (hasGSAP) {

          try {

            gsap.to(curtain, {
              yPercent: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power4.inOut',
              onComplete: () => {
                window.location.href = href;
              }
            });

          } catch (error) {

            window.location.href = href;

          }

        } else {

          // Fallback sans GSAP
          curtain.style.display = 'block';
          curtain.style.transition =
            'transform .55s cubic-bezier(.16,1,.3,1), opacity .55s ease';

          requestAnimationFrame(() => {
            curtain.style.transform = 'translateY(0)';
            curtain.style.opacity = '1';
          });

          setTimeout(() => {
            window.location.href = href;
          }, 600);
        }
      });
    });
  }

  /* =========================================================
     CURSEUR PERSONNALISÉ
  ========================================================= */

  const cursor = $('#cursor');

  if (
    cursor &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches
  ) {

    cursor.style.opacity = '1';

    window.addEventListener('mousemove', e => {

      if (hasGSAP) {

        try {

          gsap.to(cursor, {
            x: e.clientX - 6.5,
            y: e.clientY - 6.5,
            duration: 0.13,
            ease: 'power2.out',
            overwrite: true
          });

        } catch (error) {
          cursor.style.left = `${e.clientX - 6.5}px`;
          cursor.style.top = `${e.clientY - 6.5}px`;
        }

      } else {

        cursor.style.left = `${e.clientX - 6.5}px`;
        cursor.style.top = `${e.clientY - 6.5}px`;
      }
    });

    $$(
      'a,button,input,select,textarea,.glass-card,.odu-card'
    ).forEach(el => {

      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  /* =========================================================
     REVEAL AU SCROLL
  ========================================================= */

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

    // Fallback vieux navigateur
    $$('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  /* =========================================================
     GLASS CARDS
  ========================================================= */

  $$('.glass-card').forEach(card => {

    card.addEventListener('pointermove', e => {

      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        '--mx',
        `${e.clientX - rect.left}px`
      );

      card.style.setProperty(
        '--my',
        `${e.clientY - rect.top}px`
      );
    });
  });

  /* =========================================================
     FAQ
  ========================================================= */

  $$('.faq-q').forEach(button => {

    button.addEventListener('click', () => {

      const answer = button.nextElementSibling;

      if (!answer) return;

      const parent = button.parentElement;

      const isOpen = parent.classList.toggle('open');

      answer.style.maxHeight = isOpen
        ? `${answer.scrollHeight}px`
        : '0px';

      const lastSpan = button.querySelector('span:last-child');

      if (lastSpan) {
        lastSpan.textContent = isOpen ? '−' : '+';
      }
    });
  });

  /* =========================================================
     FORMULAIRE DE CONSULTATION
  ========================================================= */

  const form = $('#consultation-form');

  if (form) {

    form.addEventListener('submit', e => {

      e.preventDefault();

      const success = $('.success', form);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (success) {

        success.classList.add('show');

        try {

          success.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

        } catch (error) {

          success.scrollIntoView();
        }
      }

      form.reset();
    });
  }

  /* =========================================================
     BOUTONS MAGNÉTIQUES
  ========================================================= */

  if (
    hasGSAP &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches
  ) {

    $$('.magnetic').forEach(button => {

      button.addEventListener('pointermove', e => {

        const rect = button.getBoundingClientRect();

        try {

          gsap.to(button, {
            x: (e.clientX - rect.left - rect.width / 2) * 0.18,
            y: (e.clientY - rect.top - rect.height / 2) * 0.18,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true
          });

        } catch (error) {}
      });

      button.addEventListener('pointerleave', () => {

        try {

          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1,.4)'
          });

        } catch (error) {

          button.style.transform = '';
        }
      });
    });
  }

  /* =========================================================
     HOME — SCÈNE 3D
     
     TRÈS IMPORTANT :
     La 3D est maintenant totalement isolée.
     Si elle échoue, le reste du site continue de fonctionner.
  ========================================================= */

  const sceneCanvas = $('#scene-canvas');

  if (sceneCanvas && hasThree) {

    try {

      initFaaScene();

    } catch (error) {

      console.error(
        'ADEWALE — La scène 3D a rencontré une erreur :',
        error
      );

      // La page reste utilisable.
      sceneCanvas.style.display = 'none';
    }
  }

  /* =========================================================
     INITIALISATION THREE.JS
  ========================================================= */

  function initFaaScene() {

    const canvas = $('#scene-canvas');

    if (!canvas) return;

    let renderer;

    /* ---------------------------------------------------------
       Création du renderer
    --------------------------------------------------------- */

    try {

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });

    } catch (error) {

      console.warn(
        'ADEWALE — WebGL indisponible. La 3D est désactivée.',
        error
      );

      canvas.style.display = 'none';
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    /* ---------------------------------------------------------
       Compatibilité anciennes / nouvelles versions Three.js
    --------------------------------------------------------- */

    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) {

      renderer.outputColorSpace = THREE.SRGBColorSpace;

    } else if ('outputEncoding' in renderer && THREE.sRGBEncoding) {

      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    /* ---------------------------------------------------------
       SCÈNE
    --------------------------------------------------------- */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.set(0, 1.7, 7.2);

    const group = new THREE.Group();

    scene.add(group);

    /* ---------------------------------------------------------
       LUMIÈRES
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       PLATEAU
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       BORDURE OR
    --------------------------------------------------------- */

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(
        2.17,
        0.045,
        16,
        96
      ),
      new THREE.MeshStandardMaterial({
        color: 0xA9822E,
        roughness: 0.28,
        metalness: 0.55
      })
    );

    rim.rotation.x = Math.PI / 2;

    plate.add(rim);

    /* ---------------------------------------------------------
       INTÉRIEUR
    --------------------------------------------------------- */

    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(1.82, 64),
      new THREE.MeshStandardMaterial({
        color: 0x5C2C16,
        roughness: 0.72
      })
    );

    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.095;

    plate.add(inner);

    /* ---------------------------------------------------------
       IKIN
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       SYMBOLES DÉCORATIFS
    --------------------------------------------------------- */

    const glyphMat = new THREE.MeshBasicMaterial({
      color: 0xA9822E,
      transparent: true,
      opacity: 0.65
    });

    for (let i = 0; i < 16; i++) {

      const angle =
        (i / 16) * Math.PI * 2;

      const glyph = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.025,
          0.025,
          0.28
        ),
        glyphMat
      );

      glyph.position.set(
        Math.cos(angle) * 1.62,
        0.13,
        Math.sin(angle) * 1.62
      );

      glyph.rotation.y = -angle;

      group.add(glyph);
    }

    /* ---------------------------------------------------------
       MODÈLE GLB OPTIONNEL
    --------------------------------------------------------- */

    if (
      typeof THREE.GLTFLoader !== 'undefined'
    ) {

      try {

        const loader = new THREE.GLTFLoader();

        if (
          typeof THREE.DRACOLoader !== 'undefined'
        ) {

          const draco =
            new THREE.DRACOLoader();

          draco.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
          );

          loader.setDRACOLoader(draco);
        }

        loader.load(
          'assets/models/opon.glb',

          gltf => {

            try {

              const model = gltf.scene;

              model.rotation.x = -Math.PI / 2;

              model.scale.setScalar(2.05);

              model.traverse(node => {

                if (node.isMesh && node.material) {

                  node.material.roughness = 0.65;

                  node.material.side =
                    THREE.DoubleSide;
                }
              });

              group.remove(plate);

              group.add(model);

            } catch (error) {

              console.warn(
                'ADEWALE — Impossible d’intégrer le modèle GLB.',
                error
              );
            }
          },

          undefined,

          error => {

            console.warn(
              'ADEWALE — Le fichier opon.glb n’a pas pu être chargé.',
              error
            );
          }
        );

      } catch (error) {

        console.warn(
          'ADEWALE — GLTFLoader désactivé.',
          error
        );
      }
    }

    /* ---------------------------------------------------------
       PARTICULES
    --------------------------------------------------------- */

    const count = 420;

    const positions =
      new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

      const radius =
        3 + Math.random() * 5;

      const angle =
        Math.random() * Math.PI * 2;

      positions[i * 3] =
        Math.cos(angle) * radius;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 4;

      positions[i * 3 + 2] =
        Math.sin(angle) * radius - 1;
    }

    const particlesGeometry =
      new THREE.BufferGeometry();

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    const particles =
      new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({
          color: 0xA9822E,
          size: 0.025,
          transparent: true,
          opacity: 0.6
        })
      );

    scene.add(particles);

    /* ---------------------------------------------------------
       SOURIS
    --------------------------------------------------------- */

    let mx = 0;
    let my = 0;

    let smx = 0;
    let smy = 0;

    window.addEventListener(
      'pointermove',
      e => {

        mx =
          e.clientX / window.innerWidth - 0.5;

        my =
          e.clientY / window.innerHeight - 0.5;
      }
    );

    /* ---------------------------------------------------------
       ANIMATION
    --------------------------------------------------------- */

    const clock = new THREE.Clock();

    let animationRunning = true;

    function render() {

      if (!animationRunning) return;

      requestAnimationFrame(render);

      try {

        const t =
          clock.getElapsedTime();

        smx +=
          (mx - smx) * 0.035;

        smy +=
          (my - smy) * 0.035;

        group.rotation.y =
          0.16 * Math.sin(t * 0.25) +
          smx * 0.18;

        group.rotation.x =
          -0.08 +
          smy * 0.08;

        for (let i = 0; i < 16; i++) {

          const angle =
            t * 0.35 +
            (i / 16) * Math.PI * 2;

          dummy.position.set(
            Math.cos(angle) * 2.38,
            0.16 +
              Math.sin(t * 2 + i) * 0.035,
            Math.sin(angle) * 1.25
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

      } catch (error) {

        animationRunning = false;

        console.error(
          'ADEWALE — Animation 3D arrêtée.',
          error
        );
      }
    }

    render();

    /* ---------------------------------------------------------
       RESIZE
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       SCROLLTRIGGER
    --------------------------------------------------------- */

    if (
      hasGSAP &&
      typeof window.ScrollTrigger !== 'undefined'
    ) {

      try {

        gsap.registerPlugin(
          window.ScrollTrigger
        );

        gsap.to(
          group.scale,
          {
            x: 1.65,
            y: 1.65,
            z: 1.65,

            scrollTrigger: {
              trigger: '#desequilibre',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );

        gsap.to(
          group.position,
          {
            y: -1.2,
            z: -1.5,

            scrollTrigger: {
              trigger: '#desequilibre',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );

        gsap.to(
          canvas,
          {
            opacity: 0.08,

            scrollTrigger: {
              trigger: '#lecture',
              start: 'top 70%',
              end: 'bottom top',
              scrub: 1
            }
          }
        );

      } catch (error) {

        console.warn(
          'ADEWALE — ScrollTrigger désactivé.',
          error
        );
      }
    }
  }

})();
