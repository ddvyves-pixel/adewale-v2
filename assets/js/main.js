
(() => {
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

  const nav = $('.site-nav');
  const toggle = $('.menu-toggle');
  if(nav && toggle){
    toggle.addEventListener('click',()=>{nav.classList.toggle('open');document.body.classList.toggle('no-scroll',nav.classList.contains('open'))});
    $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('no-scroll')}));
  }

  const curtain = $('.page-curtain');
  if(curtain){
    gsap.fromTo(curtain,{yPercent:0},{yPercent:-100,duration:.75,ease:'power4.inOut'});
    $$('.nav-links a, .logo, .footer a').forEach(link=>{
      const href=link.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      link.addEventListener('click',e=>{
        if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
        e.preventDefault();
        gsap.to(curtain,{yPercent:0,duration:.55,ease:'power4.inOut',onComplete:()=>location.href=href});
      });
    });
  }

  const cursor=$('#cursor');
  if(cursor && matchMedia('(hover:hover) and (pointer:fine)').matches){
    cursor.style.opacity='1';
    addEventListener('mousemove',e=>gsap.to(cursor,{x:e.clientX-6.5,y:e.clientY-6.5,duration:.13,ease:'power2.out',overwrite:true}));
    $$('a,button,input,select,textarea,.glass-card,.odu-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
    });
  }

  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})
  },{threshold:.12});
  $$('.reveal').forEach(el=>revealObserver.observe(el));

  $$('.glass-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${e.clientX-r.left}px`);
      card.style.setProperty('--my',`${e.clientY-r.top}px`);
    });
  });

  $$('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const answer=btn.nextElementSibling, open=btn.parentElement.classList.toggle('open');
      answer.style.maxHeight=open?answer.scrollHeight+'px':'0px';
      btn.querySelector('span:last-child').textContent=open?'−':'+';
    });
  });

  const form=$('#consultation-form');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const success=$('.success',form);
      if(!form.checkValidity()){form.reportValidity();return}
      success.classList.add('show');
      success.scrollIntoView({behavior:'smooth',block:'center'});
      form.reset();
    });
  }

  // Magnetic buttons
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    $$('.magnetic').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect();
        gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.18,duration:.35,ease:'power3.out'});
      });
      btn.addEventListener('pointerleave',()=>gsap.to(btn,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'}));
    });
  }

  // Home 3D
  if($('#scene-canvas') && window.THREE){
    initFaaScene();
  }

  function initFaaScene(){
    const canvas=$('#scene-canvas');
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(innerWidth,innerHeight);
    renderer.outputEncoding=THREE.sRGBEncoding;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
    camera.position.set(0,1.7,7.2);
    const group=new THREE.Group(); scene.add(group);

    const ambient=new THREE.AmbientLight(0xEDEAE3,1.2); scene.add(ambient);
    const key=new THREE.PointLight(0xffb37a,8,20); key.position.set(3,4,4); scene.add(key);
    const gold=new THREE.PointLight(0xA9822E,5,18); gold.position.set(-4,1,-2); scene.add(gold);

    const plateGeo=new THREE.CylinderGeometry(2.15,2.25,.18,64);
    const plateMat=new THREE.MeshStandardMaterial({color:0x241F1A,roughness:.48,metalness:.12});
    const plate=new THREE.Mesh(plateGeo,plateMat); group.add(plate);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(2.17,.045,16,96),new THREE.MeshStandardMaterial({color:0xA9822E,roughness:.28,metalness:.55}));
    rim.rotation.x=Math.PI/2; plate.add(rim);

    const inner=new THREE.Mesh(new THREE.CircleGeometry(1.82,64),new THREE.MeshStandardMaterial({color:0x5C2C16,roughness:.72}));
    inner.rotation.x=-Math.PI/2; inner.position.y=.095; plate.add(inner);

    const ikinGeo=new THREE.SphereGeometry(.075,16,12);
    const ikinMat=new THREE.MeshStandardMaterial({color:0xDAD4C6,roughness:.35});
    const ikin=new THREE.InstancedMesh(ikinGeo,ikinMat,16); group.add(ikin);
    const dummy=new THREE.Object3D();

    // Decorative symbols around the plateau
    const glyphMat=new THREE.MeshBasicMaterial({color:0xA9822E,transparent:true,opacity:.65});
    for(let i=0;i<16;i++){
      const a=i/16*Math.PI*2;
      const g=new THREE.Mesh(new THREE.BoxGeometry(.025,.025,.28),glyphMat);
      g.position.set(Math.cos(a)*1.62,.13,Math.sin(a)*1.62); g.rotation.y=-a; group.add(g);
    }

    // Optional real GLB: keep assets/models/opon.glb in the repo to replace fallback.
    if(THREE.GLTFLoader){
      const loader=new THREE.GLTFLoader();
      if(THREE.DRACOLoader){const draco=new THREE.DRACOLoader();draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');loader.setDRACOLoader(draco)}
      loader.load('assets/models/opon.glb',g=>{
        const model=g.scene;
        model.rotation.x=-Math.PI/2;
        model.scale.setScalar(2.05);
        model.traverse(n=>{if(n.isMesh){n.material.roughness=.65;n.material.side=THREE.DoubleSide}});
        group.remove(plate); group.remove(rim); group.remove(inner); group.add(model);
      },undefined,()=>{});
    }

    // Floating particles
    const count=420, positions=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const r=3+Math.random()*5, a=Math.random()*Math.PI*2;
      positions[i*3]=Math.cos(a)*r;
      positions[i*3+1]=(Math.random()-.5)*4;
      positions[i*3+2]=Math.sin(a)*r-1;
    }
    const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xA9822E,size:.025,transparent:true,opacity:.6}));
    scene.add(particles);

    let mx=0,my=0,smx=0,smy=0;
    addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
    const clock=new THREE.Clock();
    function render(){
      requestAnimationFrame(render);
      const t=clock.getElapsedTime();
      smx+=(mx-smx)*.035;smy+=(my-smy)*.035;
      group.rotation.y=.16*Math.sin(t*.25)+smx*.18;
      group.rotation.x=-.08+smy*.08;
      for(let i=0;i<16;i++){
        const a=t*.35+i/16*Math.PI*2;
        dummy.position.set(Math.cos(a)*2.38,.16+Math.sin(t*2+i)*.035,Math.sin(a)*1.25);
        dummy.updateMatrix();ikin.setMatrixAt(i,dummy.matrix);
      }
      ikin.instanceMatrix.needsUpdate=true;
      particles.rotation.y=t*.012;
      camera.position.x+=(smx*.65-camera.position.x)*.03;
      camera.position.y+=(1.7-smy*.35-camera.position.y)*.03;
      camera.lookAt(0,.05,0);
      renderer.render(scene,camera);
    }
    render();

    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(group.scale,{x:1.65,y:1.65,z:1.65,scrollTrigger:{trigger:'#desequilibre',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to(group.position,{y:-1.2,z:-1.5,scrollTrigger:{trigger:'#desequilibre',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to(canvas,{opacity:.08,scrollTrigger:{trigger:'#lecture',start:'top 70%',end:'bottom top',scrub:1}});
    }
  }
})();
