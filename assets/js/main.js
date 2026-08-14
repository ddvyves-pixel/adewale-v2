(() => {
  'use strict';

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


  /* =========================
     MENU MOBILE
  ========================= */

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
        String(isOpen)
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


  /* =========================
     CURSEUR PERSONNALISÉ
  ========================= */

  const cursor = $('#cursor');

  if (
    cursor &&
    window.gsap &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {

    cursor.style.opacity = '1';

    window.addEventListener('mousemove', event => {

      gsap.to(cursor, {
        x: event.clientX - 6.5,
        y: event.clientY - 6.5,
        duration: 0.13,
        ease: 'power2.out',
        overwrite: true
      });

    });


    $$(
      'a, button, input, select, textarea, .glass-card, .odu-card'
    ).forEach(element => {

      element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });

      element.addEventListener('mouseleave', () => {
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


    $$('.reveal').forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    $$('.reveal').forEach(element => {

      element.classList.add('is-visible');

    });

  }


  /* =========================
     EFFET GLASS
  ========================= */

  $$('.glass-card').forEach(card => {

    card.addEventListener('pointermove', event => {

      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        '--mx',
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        '--my',
        `${event.clientY - rect.top}px`
      );

    });

  });


  /* =========================
     FAQ
  ========================= */

  $$('.faq-q').forEach(button => {

    button.addEventListener('click', () => {

      const answer = button.nextElementSibling;

      if (!answer) return;

      const parent = button.parentElement;

      const open = parent.classList.toggle('open');

      answer.style.maxHeight = open
        ? `${answer.scrollHeight}px`
        : '0px';


      const symbol =
        button.querySelector('span:last-child');

      if (symbol) {

        symbol.textContent = open
          ? '−'
          : '+';

      }

    });

  });


  /* =========================
     FORMULAIRE CONSULTATION
  ========================= */

  const form = $('#consultation-form');

  if (form) {

    form.addEventListener('submit', event => {

      event.preventDefault();

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
     BOUTONS MAGNÉTIQUES
  ========================= */

  if (
    window.gsap &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {

    $$('.magnetic').forEach(button => {

      button.addEventListener('pointermove', event => {

        const rect = button.getBoundingClientRect();

        gsap.to(button, {

          x:
            (event.clientX -
              rect.left -
              rect.width / 2) * 0.18,

          y:
            (event.clientY -
              rect.top -
              rect.height / 2) * 0.18,

          duration: 0.35,

          ease: 'power3.out'

        });

      });


      button.addEventListener('pointerleave', () => {

        gsap.to(button, {

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

  const canvas = $('#scene-canvas');

  if (
    canvas &&
    window.THREE
  ) {

    initFaaScene(canvas);

  }


  function initFaaScene(canvas) {

    let renderer;

    /* =========================
       RENDERER WEBGL
    ========================= */

    try {

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });

    } catch (error) {

      console.warn(
        'WebGL indisponible. La scène 3D est désactivée.',
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


    if (
      'outputEncoding' in renderer &&
      THREE.sRGBEncoding
    ) {

      renderer.outputEncoding =
        THREE.sRGBEncoding;

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


    /* =========================
       PLATEAU DE SECOURS
    ========================= */

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


    /* BORDURE OR */

    const rimGeo =
      new THREE.TorusGeometry(
        2.17,
        0.045,
        16,
        96
      );


    const rimMat =
      new THREE.MeshStandardMaterial({
        color: 0xA9822E,
        roughness: 0.28,
        metalness: 0.55
      });


    const rim =
      new THREE.Mesh(
        rimGeo,
        rimMat
      );

    rim.rotation.x =
      Math.PI / 2;

    plate.add(rim);


    /* SURFACE CENTRALE */

    const innerGeo =
      new THREE.CircleGeometry(
        1.82,
        64
      );


    const innerMat =
      new THREE.MeshStandardMaterial({
        color: 0x5C2C16,
        roughness: 0.72
      });


    const inner =
      new THREE.Mesh(
        innerGeo,
        innerMat
      );


    inner.rotation.x =
      -Math.PI / 2;

    inner.position.y =
      0.095;

    plate.add(inner);


    /* =========================
       IKIN
    ========================= */

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


    /* =========================
       SYMBOLES
    ========================= */

    const glyphMat =
      new THREE.MeshBasicMaterial({
        color: 0xA9822E,
        transparent: true,
        opacity: 0.65
      });


    for (let i = 0; i < 16; i++) {

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


    /* =========================
       MODÈLE OPON GLB
    ========================= */

    if (
      THREE.GLTFLoader &&
      typeof THREE.GLTFLoader === 'function'
    ) {

      const loader =
        new THREE.GLTFLoader();


      if (
        THREE.DRACOLoader &&
        typeof THREE.DRACOLoader === 'function'
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


          model.traverse(object => {

            if (
              object.isMesh &&
              object.material
            ) {

              object.material.roughness =
                0.65;

              object.material.side =
                THREE.DoubleSide;

            }

          });


          group.remove(
            plate
          );


          group.add(
            model
          );

        },

        undefined,

        error => {

          console.warn(
            'Le modèle assets/models/opon.glb n’a pas pu être chargé. Le plateau 3D de secours reste affiché.',
            error
          );

        }

      );

    }


    /* =========================
       PARTICULES
    ========================= */

    const count = 420;

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
        Math.PI *
        2;


      positions[i * 3] =
        Math.cos(angle) *
        radius;


      positions[i * 3 + 1] =
        (Math.random() - 0.5) *
        4;


      positions[i * 3 + 2] =
        Math.sin(angle) *
        radius -
        1;

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


    scene.add(
      particles
    );


    /* =========================
       SOURIS
    ========================= */

    let mouseX = 0;
    let mouseY = 0;

    let smoothMouseX = 0;
    let smoothMouseY = 0;


    window.addEventListener(
      'pointermove',
      event => {

        mouseX =
          event.clientX /
          window.innerWidth -
          0.5;


        mouseY =
          event.clientY /
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

      requestAnimationFrame(
        render
      );


      const time =
        clock.getElapsedTime();


      smoothMouseX +=
        (mouseX - smoothMouseX) *
        0.035;


      smoothMouseY +=
        (mouseY - smoothMouseY) *
        0.035;


      group.rotation.y =
        0.16 *
        Math.sin(time * 0.25) +
        smoothMouseX * 0.18;


      group.rotation.x =
        -0.08 +
        smoothMouseY * 0.08;


      for (
        let i = 0;
        i < 16;
        i++
      ) {

        const angle =
          time * 0.35 +
          i / 16 *
          Math.PI *
          2;


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
          smoothMouseX * 0.65 -
          camera.position.x
        ) * 0.03;


      camera.position.y +=
        (
          1.7 -
          smoothMouseY * 0.35 -
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
       ANIMATION AU SCROLL
    ========================= */

    if (
      window.gsap &&
      window.ScrollTrigger
    ) {

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

    }

  }

})();
