(() => {

  'use strict';


  /* =========================================================
     OUTILS
  ========================================================= */

  const $ = (selector, root = document) => {
    return root.querySelector(selector);
  };

  const $$ = (selector, root = document) => {
    return [...root.querySelectorAll(selector)];
  };


  /* =========================================================
     VÉRIFICATION GSAP
  ========================================================= */

  const hasGSAP = typeof window.gsap !== 'undefined';


  /* =========================================================
     NAVIGATION MOBILE
  ========================================================= */

  const nav = $('.site-nav');
  const toggle = $('.menu-toggle');

  if (nav && toggle) {

    toggle.addEventListener('click', () => {

      const isOpen = nav.classList.toggle('open');

      document.body.classList.toggle(
        'no-scroll',
        isOpen
      );

      toggle.setAttribute(
        'aria-expanded',
        isOpen ? 'true' : 'false'
      );

    });


    $$('.nav-links a').forEach(link => {

      link.addEventListener('click', () => {

        nav.classList.remove('open');

        document.body.classList.remove('no-scroll');

        toggle.setAttribute(
          'aria-expanded',
          'false'
        );

      });

    });

  }


  /* =========================================================
     TRANSITION ENTRE LES PAGES
  ========================================================= */

  const curtain = $('.page-curtain');

  if (curtain) {

    /*
     * Si GSAP fonctionne :
     */

    if (hasGSAP) {

      gsap.fromTo(

        curtain,

        {
          yPercent: 0
        },

        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power4.inOut'
        }

      );

    }

    /*
     * Si GSAP ne fonctionne pas :
     * on cache le rideau immédiatement.
     */

    else {

      curtain.style.transform =
        'translateY(-100%)';

      curtain.style.pointerEvents =
        'none';

    }


    /*
     * Navigation animée.
     */

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


        /*
         * Si GSAP est disponible :
         */

        if (hasGSAP) {

          gsap.to(

            curtain,

            {
              yPercent: 0,
              duration: 0.55,
              ease: 'power4.inOut',

              onComplete: () => {

                window.location.href = href;

              }

            }

          );

        }

        /*
         * Sinon navigation normale.
         */

        else {

          window.location.href = href;

        }

      });

    });

  }


  /* =========================================================
     CURSEUR PERSONNALISÉ
  ========================================================= */

  const cursor = $('#cursor');

  const finePointer = window.matchMedia(
    '(hover:hover) and (pointer:fine)'
  ).matches;


  if (
    cursor &&
    finePointer
  ) {

    cursor.style.opacity = '1';


    window.addEventListener(
      'mousemove',
      e => {

        if (hasGSAP) {

          gsap.to(

            cursor,

            {
              x: e.clientX - 6.5,
              y: e.clientY - 6.5,
              duration: 0.13,
              ease: 'power2.out',
              overwrite: true
            }

          );

        }

        else {

          cursor.style.left =
            `${e.clientX - 6.5}px`;

          cursor.style.top =
            `${e.clientY - 6.5}px`;

        }

      }
    );


    $$(
      'a,button,input,select,textarea,.glass-card,.odu-card'
    ).forEach(el => {

      el.addEventListener(
        'mouseenter',
        () => cursor.classList.add('hover')
      );

      el.addEventListener(
        'mouseleave',
        () => cursor.classList.remove('hover')
      );

    });

  }


  /* =========================================================
     ANIMATIONS AU SCROLL
  ========================================================= */

  const revealElements = $$('.reveal');


  if ('IntersectionObserver' in window) {

    const revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'is-visible'
              );

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.12
        }

      );


    revealElements.forEach(el => {

      revealObserver.observe(el);

    });

  }

  else {

    /*
     * Fallback pour les anciens navigateurs.
     */

    revealElements.forEach(el => {

      el.classList.add('is-visible');

    });

  }


  /* =========================================================
     EFFET DES CARTES
  ========================================================= */

  $$('.glass-card').forEach(card => {

    card.addEventListener(
      'pointermove',
      e => {

        const rect =
          card.getBoundingClientRect();

        card.style.setProperty(
          '--mx',
          `${e.clientX - rect.left}px`
        );

        card.style.setProperty(
          '--my',
          `${e.clientY - rect.top}px`
        );

      }
    );

  });


  /* =========================================================
     FAQ
  ========================================================= */

  $$('.faq-q').forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const answer =
          button.nextElementSibling;

        const parent =
          button.parentElement;

        if (!answer || !parent) {
          return;
        }


        const open =
          parent.classList.toggle('open');


        answer.style.maxHeight =
          open
            ? `${answer.scrollHeight}px`
            : '0px';


        const lastSpan =
          button.querySelector(
            'span:last-child'
          );


        if (lastSpan) {

          lastSpan.textContent =
            open ? '−' : '+';

        }

      }
    );

  });


  /* =========================================================
     FORMULAIRE CONSULTATION
  ========================================================= */

  const form =
    $('#consultation-form');


  if (form) {

    form.addEventListener(
      'submit',
      e => {

        e.preventDefault();


        const success =
          $('.success', form);


        if (!form.checkValidity()) {

          form.reportValidity();

          return;

        }


        if (success) {

          success.classList.add(
            'show'
          );

          success.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

        }


        form.reset();

      }
    );

  }


  /* =========================================================
     BOUTONS MAGNÉTIQUES
  ========================================================= */

  if (finePointer) {

    $$('.magnetic').forEach(button => {

      button.addEventListener(
        'pointermove',
        e => {

          const rect =
            button.getBoundingClientRect();


          const x =
            (e.clientX -
              rect.left -
              rect.width / 2) * 0.18;


          const y =
            (e.clientY -
              rect.top -
              rect.height / 2) * 0.18;


          if (hasGSAP) {

            gsap.to(

              button,

              {
                x,
                y,
                duration: 0.35,
                ease: 'power3.out'
              }

            );

          }

        }
      );


      button.addEventListener(
        'pointerleave',
        () => {

          if (hasGSAP) {

            gsap.to(

              button,

              {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1,.4)'
              }

            );

          }

        }
      );

    });

  }


  /* =========================================================
     PLATEAU 3D
  ========================================================= */

  const canvas =
    $('#scene-canvas');


  /*
   * La 3D est maintenant totalement optionnelle.
   *
   * Si Three.js ou WebGL n'est pas disponible,
   * le reste du site continue normalement.
   */

  if (
    canvas &&
    window.THREE
  ) {

    try {

      initFaaScene();

    }

    catch (error) {

      console.warn(
        'ADEWALE : la scène 3D n’a pas pu être initialisée.',
        error
      );

      canvas.style.display =
        'none';

    }

  }


  /* =========================================================
     FONCTION SCÈNE 3D
  ========================================================= */

  function initFaaScene() {

    const canvas =
      $('#scene-canvas');


    if (!canvas) {
      return;
    }


    /*
     * Vérification WebGL
     */

    let renderer;


    try {

      renderer =
        new THREE.WebGLRenderer({

          canvas,
          alpha: true,
          antialias: true

        });

    }

    catch (error) {

      console.warn(
        'WebGL indisponible.',
        error
      );

      canvas.style.display =
        'none';

      return;

    }


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    /*
     * Compatibilité Three.js r128
     */

    if (
      'outputEncoding' in renderer &&
      typeof THREE.sRGBEncoding !== 'undefined'
    ) {

      renderer.outputEncoding =
        THREE.sRGBEncoding;

    }


    /* =======================================================
       SCÈNE
    ======================================================== */

    const scene =
      new THREE.Scene();


    const camera =
      new THREE.PerspectiveCamera(
        42,
        window.innerWidth /
          window.innerHeight,
        0.1,
        100
      );


    camera.position.set(
      0,
      1.7,
      7.2
    );


    const group =
      new THREE.Group();


    scene.add(group);


    /* =======================================================
       LUMIÈRES
    ======================================================== */

    const ambient =
      new THREE.AmbientLight(
        0xEDEAE3,
        1.2
      );


    scene.add(ambient);


    const key =
      new THREE.PointLight(
        0xffb37a,
        8,
        20
      );


    key.position.set(
      3,
      4,
      4
    );


    scene.add(key);


    const gold =
      new THREE.PointLight(
        0xA9822E,
        5,
        18
      );


    gold.position.set(
      -4,
      1,
      -2
    );


    scene.add(gold);


    /* =======================================================
       PLATEAU
    ======================================================== */

    const plateGeo =
      new THREE.CylinderGeometry(
        2.15,
        2.25,
        0.18,
        64
      );


    const plateMat =
      new THREE.MeshStandardMaterial({

        color: 0x241F1A,
        roughness: 0.48,
        metalness: 0.12

      });


    const plate =
      new THREE.Mesh(
        plateGeo,
        plateMat
      );


    group.add(plate);


    /* =======================================================
       BORDURE OR
    ======================================================== */

    const rim =
      new THREE.Mesh(

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


    rim.rotation.x =
      Math.PI / 2;


    plate.add(rim);


    /* =======================================================
       CENTRE
    ======================================================== */

    const inner =
      new THREE.Mesh(

        new THREE.CircleGeometry(
          1.82,
          64
        ),

        new THREE.MeshStandardMaterial({

          color: 0x5C2C16,
          roughness: 0.72

        })

      );


    inner.rotation.x =
      -Math.PI / 2;


    inner.position.y =
      0.095;


    plate.add(inner);


    /* =======================================================
       IKIN
    ======================================================== */

    const ikinGeo =
      new THREE.SphereGeometry(
        0.075,
        16,
        12
      );


    const ikinMat =
      new THREE.MeshStandardMaterial({

        color: 0xDAD4C6,
        roughness: 0.35

      });


    const ikin =
      new THREE.InstancedMesh(
        ikinGeo,
        ikinMat,
        16
      );


    group.add(ikin);


    const dummy =
      new THREE.Object3D();


    /* =======================================================
       SYMBOLES
    ======================================================== */

    const glyphMat =
      new THREE.MeshBasicMaterial({

        color: 0xA9822E,
        transparent: true,
        opacity: 0.65

      });


    for (
      let i = 0;
      i < 16;
      i++
    ) {

      const angle =
        i / 16 * Math.PI * 2;


      const glyph =
        new THREE.Mesh(

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


      glyph.rotation.y =
        -angle;


      group.add(glyph);

    }


    /* =======================================================
       MODÈLE GLB OPTIONNEL
    ======================================================== */

    if (
      THREE.GLTFLoader
    ) {

      try {

        const loader =
          new THREE.GLTFLoader();


        if (
          THREE.DRACOLoader
        ) {

          const draco =
            new THREE.DRACOLoader();


          draco.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
          );


          loader.setDRACOLoader(
            draco
          );

        }


        loader.load(

          'assets/models/opon.glb',

          gltf => {

            if (
              !gltf ||
              !gltf.scene
            ) {
              return;
            }


            const model =
              gltf.scene;


            model.rotation.x =
              -Math.PI / 2;


            model.scale.setScalar(
              2.05
            );


            model.traverse(
              node => {

                if (node.isMesh) {

                  if (
                    node.material
                  ) {

                    node.material.roughness =
                      0.65;

                    node.material.side =
                      THREE.DoubleSide;

                  }

                }

              }
            );


            /*
             * Suppression propre du fallback.
             */

            group.remove(plate);


            /*
             * Le rim et inner sont enfants de plate,
             * ils disparaissent donc également.
             */


            group.add(model);

          },

          undefined,

          error => {

            /*
             * IMPORTANT :
             * si le GLB n'existe pas,
             * on conserve le plateau de secours.
             */

            console.warn(
              'ADEWALE : modèle opon.glb non chargé. Plateau de secours utilisé.'
            );

          }

        );

      }

      catch (error) {

        console.warn(
          'Erreur lors du chargement du modèle 3D.',
          error
        );

      }

    }


    /* =======================================================
       PARTICULES
    ======================================================== */

    const count =
      420;


    const positions =
      new Float32Array(
        count * 3
      );


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const radius =
        3 + Math.random() * 5;


      const angle =
        Math.random() *
        Math.PI * 2;


      positions[i * 3] =
        Math.cos(angle) * radius;


      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 4;


      positions[i * 3 + 2] =
        Math.sin(angle) * radius - 1;

    }


    const particleGeometry =
      new THREE.BufferGeometry();


    particleGeometry.setAttribute(

      'position',

      new THREE.BufferAttribute(
        positions,
        3
      )

    );


    const particleMaterial =
      new THREE.PointsMaterial({

        color: 0xA9822E,
        size: 0.025,
        transparent: true,
        opacity: 0.6

      });


    const particles =
      new THREE.Points(

        particleGeometry,

        particleMaterial

      );


    scene.add(particles);


    /* =======================================================
       SOURIS
    ======================================================== */

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


    /* =======================================================
       ANIMATION
    ======================================================== */

    const clock =
      new THREE.Clock();


    function render() {

      requestAnimationFrame(
        render
      );


      const time =
        clock.getElapsedTime();


      smx +=
        (mx - smx) * 0.035;


      smy +=
        (my - smy) * 0.035;


      group.rotation.y =
        0.16 *
        Math.sin(time * 0.25) +
        smx * 0.18;


      group.rotation.x =
        -0.08 +
        smy * 0.08;


      for (
        let i = 0;
        i < 16;
        i++
      ) {

        const angle =
          time * 0.35 +
          i / 16 *
          Math.PI * 2;


        dummy.position.set(

          Math.cos(angle) * 2.38,

          0.16 +
            Math.sin(
              time * 2 + i
            ) * 0.035,

          Math.sin(angle) * 1.25

        );


        dummy.updateMatrix();


        ikin.setMatrixAt(
          i,
          dummy.matrix
        );

      }


      ikin.instanceMatrix.needsUpdate =
        true;


      particles.rotation.y =
        time * 0.012;


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


    /* =======================================================
       REDIMENSIONNEMENT
    ======================================================== */

    window.addEventListener(
      'resize',
      () => {

        const width =
          window.innerWidth;


        const height =
          window.innerHeight;


        camera.aspect =
          width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
          width,
          height
        );

      }
    );


    /* =======================================================
       ANIMATION AU SCROLL
    ======================================================== */

    if (
      window.gsap &&
      window.ScrollTrigger
    ) {

      try {

        gsap.registerPlugin(
          ScrollTrigger
        );


        gsap.to(

          group.scale,

          {

            x: 1.65,
            y: 1.65,
            z: 1.65,

            scrollTrigger: {

              trigger:
                '#desequilibre',

              start:
                'top bottom',

              end:
                'bottom top',

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

              trigger:
                '#desequilibre',

              start:
                'top bottom',

              end:
                'bottom top',

              scrub: 1

            }

          }

        );


        gsap.to(

          canvas,

          {

            opacity: 0.08,

            scrollTrigger: {

              trigger:
                '#lecture',

              start:
                'top 70%',

              end:
                'bottom top',

              scrub: 1

            }

          }

        );

      }

      catch (error) {

        console.warn(
          'Animation ScrollTrigger désactivée.',
          error
        );

      }

    }

  }


})();
