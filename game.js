import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bbbc8);
scene.fog = new THREE.FogExp2(0x9bbbc8, 0.0017);
const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 1800);
camera.position.set(0,5,12);
const renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
document.body.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc9e7ff,0x4b5544,2.0));
const sun = new THREE.DirectionalLight(0xffedcc,3.2);
sun.position.set(-80,120,60); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-70;sun.shadow.camera.right=70;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;scene.add(sun);

const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const asphalt=mat(0x30383c), shoulder=mat(0x9a9b8d), grass=mat(0x5b7653), white=mat(0xf2f1dc), yellow=mat(0xf2cf56);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(2400,2400),grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.13;ground.receiveShadow=true;scene.add(ground);
const road=new THREE.Mesh(new THREE.PlaneGeometry(18,2200),asphalt);road.rotation.x=-Math.PI/2;road.position.y=-.08;road.receiveShadow=true;scene.add(road);
for(const x of [-9.5,9.5]){const edge=new THREE.Mesh(new THREE.BoxGeometry(1.1,.12,2200),shoulder);edge.position.set(x,-.015,0);scene.add(edge)}
for(const x of [-8.1,8.1]){const line=new THREE.Mesh(new THREE.BoxGeometry(.12,.025,2200),white);line.position.set(x,.005,0);scene.add(line)}
const dashes=[];
for(let z=-1080;z<120;z+=15){const d=new THREE.Mesh(new THREE.BoxGeometry(.18,.035,7),yellow);d.position.set(0,.012,z);scene.add(d);dashes.push(d)}
// Hills and roadside trees are recycled as the road scrolls, giving an endless drive.
const hillMat=[mat(0x78917a),mat(0x8d9b87),mat(0x6d866d)];
for(let i=0;i<90;i++){const side=i%2?1:-1;const h=8+Math.random()*28,w=12+Math.random()*28;const hill=new THREE.Mesh(new THREE.ConeGeometry(w,h,5),hillMat[i%3]);hill.position.set(side*(30+Math.random()*110),h/2-1,-Math.random()*1100);hill.rotation.y=Math.random()*3;scene.add(hill)}
const trees=[];
function makeTree(x,z,scale){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,2*scale,7),mat(0x5d4330));trunk.position.y=scale;g.add(trunk);for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry((1.15-j*.2)*scale,2.3*scale,7),mat([0x355a42,0x436d4b,0x547b4c][j]));crown.position.y=scale*1.6+j*.85*scale;crown.castShadow=true;g.add(crown)}g.position.set(x,0,z);scene.add(g);trees.push(g)}
for(let i=0;i<115;i++){const z=-Math.random()*1000;makeTree((10+Math.random()*20)*(i%2?1:-1),z,.7+Math.random()*1.7)}
// Sculpted low-poly sports car, with metallic paint, glass, lights and detailed wheels.
const car=new THREE.Group();scene.add(car);
const paint=new THREE.MeshPhysicalMaterial({color:0xd51f32,metalness:.72,roughness:.23,clearcoat:1,clearcoatRoughness:.12});
const dark=mat(0x10171d,.3,.3),glass=new THREE.MeshPhysicalMaterial({color:0x172d3a,metalness:.5,roughness:.12,transparent:true,opacity:.88,clearcoat:1}),rubber=mat(0x111315,.85),rim=mat(0xb9c7cc,.22,.9),lamp=new THREE.MeshStandardMaterial({color:0xf6fff1,emissive:0xd8f4ff,emissiveIntensity:2});
function addBox(parent,w,h,d,material,x,y,z,bevel=false){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
addBox(car,1.95,.52,4.15,paint,0,.72,0);
addBox(car,1.72,.23,1.65,paint,0,1.03,-.85);
const cabin=addBox(car,1.42,.68,1.8,glass,0,1.29,.35);cabin.rotation.x=-.05;
addBox(car,1.8,.14,.55,paint,0,.96,1.55);addBox(car,1.75,.1,.35,dark,0,.52,2.08);
addBox(car,1.6,.12,.18,dark,0,.43,-2.04);
addBox(car,.5,.12,.09,lamp,-.57,.77,-2.09);addBox(car,.5,.12,.09,lamp,.57,.77,-2.09);
for(const x of [-1,1]){addBox(car,.08,.12,.5,mat(0xff2638,.3),x*.94,.76,1.6);addBox(car,.08,.12,.4,mat(0xff293c,.3),x*.94,.76,-1.7)}
const wheels=[];
for(const x of [-1,1])for(const z of [-1.35,1.35]){const wheel=new THREE.Group();wheel.position.set(x*1.02,.48,z);const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.27,24),rubber);tire.rotation.z=Math.PI/2;tire.castShadow=true;wheel.add(tire);const r=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.29,16),rim);r.rotation.z=Math.PI/2;wheel.add(r);car.add(wheel);wheels.push(wheel)}
const spoiler=addBox(car,1.5,.08,.2,dark,0,1.2,1.8);addBox(car,.08,.25,.08,dark,-.52,1.1,1.78);addBox(car,.08,.25,.08,dark,.52,1.1,1.78);
const headlight1=new THREE.SpotLight(0xe2f4ff,0,90,Math.PI/7,.5,1.2);headlight1.position.set(-.6,.8,-2);headlight1.target.position.set(-.6,0,-20);car.add(headlight1,headlight1.target);
const headlight2=headlight1.clone();headlight2.position.x=.6;headlight2.target.position.x=.6;car.add(headlight2,headlight2.target);
const clouds=[];const cloudMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1});
for(let i=0;i<18;i++){const c=new THREE.Group();for(let j=0;j<5;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(2+Math.random()*3,8,6),cloudMat);puff.position.set((j-2)*2,Math.random()*1.5,0);c.add(puff)}c.position.set((Math.random()-.5)*220,35+Math.random()*35,-Math.random()*1000);scene.add(c);clouds.push(c)}
// Opponent traffic
const traffic=[];
for(let i=0;i<8;i++){const g=new THREE.Group();const colors=[0x246bd3,0xe8e8e8,0xe6b82f,0x252a31,0x39a77c];const body=new THREE.Mesh(new THREE.BoxGeometry(1.75,.65,3.5),mat(colors[i%colors.length],.3,.45));body.position.y=.6;g.add(body);const top=new THREE.Mesh(new THREE.BoxGeometry(1.35,.55,1.45),glass);top.position.set(0,1.05,.1);g.add(top);for(const x of [-.9,.9])for(const z of [-1.1,1.1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.2,12),rubber);w.rotation.z=Math.PI/2;w.position.set(x,.35,z);g.add(w)}g.position.set([-5,0,5][i%3],0,-80-i*95);scene.add(g);traffic.push(g)}
const input={left:false,right:false,gas:false,brake:false};let started=false,speed=0,distance=0,best=Number(localStorage.getItem('vr-best')||0),camMode=0,steer=0,toastTimer;
document.querySelector('#best').textContent=String(best).padStart(3,'0');
function bindButton(id,key){const el=document.getElementById(id);if(!el)return;const down=e=>{e.preventDefault();input[key]=true},up=e=>{e.preventDefault();input[key]=false};el.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,up))}
bindButton('left','left');bindButton('right','right');bindButton('gas','gas');bindButton('brake','brake');
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowUp'||e.key.toLowerCase()==='w')input.gas=true;if(e.key==='ArrowDown'||e.key.toLowerCase()==='s')input.brake=true;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')input.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')input.right=true;if(e.key.toLowerCase()==='c')switchCamera();if(e.key==='Enter'&&!started)start()});
addEventListener('keyup',e=>{if(e.key==='ArrowUp'||e.key.toLowerCase()==='w')input.gas=false;if(e.key==='ArrowDown'||e.key.toLowerCase()==='s')input.brake=false;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')input.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')input.right=false});
function switchCamera(){camMode=(camMode+1)%3;showToast(['CHASE CAM','CINEMATIC CAM','HOOD CAM'][camMode])}
document.querySelector('#camera').addEventListener('click',switchCamera);
document.querySelector('#start').addEventListener('click',start);
function start(){started=true;document.querySelector('#center').classList.add('hide');showToast('DRIVE SAFE. DRIVE FAST.')}
function showToast(t){const el=document.querySelector('#toast');el.textContent=t;el.style.opacity=1;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.opacity=0,1500)}
function smooth(a,b,t){return a+(b-a)*t}
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);const time=clock.elapsedTime;
if(started){const target=input.gas?72:input.brake?0:26;speed=smooth(speed,target,dt*(input.gas?0.7:input.brake?2.7:.12));if(input.brake&&speed<4)speed=0;const steerInput=(input.left?-1:0)+(input.right?1:0);steer=smooth(steer,steerInput,dt*4);car.position.x=THREE.MathUtils.clamp(car.position.x+steer*dt*(1.3+speed*.045),-6.4,6.4);car.rotation.z=smooth(car.rotation.z,-steer*.055,dt*4);car.rotation.y=smooth(car.rotation.y,-steer*.1,dt*2);distance+=speed*dt/3600;
}else{speed= smooth(speed,0,dt*2);car.position.x=smooth(car.position.x,0,dt)}
car.position.y=.02+Math.sin(time*speed*.08)*.018;wheels.forEach(w=>{w.rotation.x+=speed*dt*.06});car.position.z=0;
const scroll=started?speed*dt*1.7:0;
for(const d of dashes){d.position.z+=scroll;if(d.position.z>20)d.position.z-=1100}
for(const t of trees){t.position.z+=scroll;if(t.position.z>18)t.position.z-=1000}
for(const c of clouds){c.position.z+=scroll*.45;if(c.position.z>50)c.position.z-=1050}
traffic.forEach((v,i)=>{v.position.z+=scroll-(started?dt*(4+(i%3)*2):0);if(v.position.z>15){v.position.z=-500-Math.random()*350;v.position.x=[-5,0,5][Math.floor(Math.random()*3)]}v.position.x+=Math.sin(time*.7+i)*dt*.08});
const targetX=car.position.x*.35;
const camPositions=[[car.position.x*.5,4.1,8.6],[car.position.x*.25+Math.sin(time*.18)*1.5,7.5,11.5],[car.position.x*.5,2.0,3.5]];
const cp=camPositions[camMode];camera.position.x=smooth(camera.position.x,targetX+cp[0],dt*2.5);camera.position.y=smooth(camera.position.y,cp[1],dt*2.2);camera.position.z=smooth(camera.position.z,cp[2],dt*2.2);camera.lookAt(car.position.x*.25,.65,-12);
camera.fov=smooth(camera.fov,62+speed*.12,dt*2);camera.updateProjectionMatrix();
document.querySelector('#speed').textContent=String(Math.round(speed*3.1)).padStart(3,'0');document.querySelector('#distance').textContent=distance.toFixed(2);document.querySelector('#gear b').textContent=String(Math.min(6,1+Math.floor(speed/13)));
const kmh=Math.round(speed*3.1);if(kmh>best){best=kmh;localStorage.setItem('vr-best',String(best));document.querySelector('#best').textContent=String(best).padStart(3,'0')}
renderer.render(scene,camera)}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.75))});
setTimeout(()=>{document.querySelector('#loading').classList.add('hide');setTimeout(()=>document.querySelector('#loading').remove(),700)},900);
