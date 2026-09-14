import * as T from './three.module.js';
// Hand-built geometry reconstructed from the supplied side-view drawing.
export function makePoliceCar(){
 const car=new T.Group(),wheels=[];
 const material=c=>new T.MeshStandardMaterial({color:c,roughness:.82});
 const blue=material('#185bd0'),white=material('#f4eff4'),ink=material('#211c29'),glass=material('#b8d5e1'),yellow=material('#ffd447'),red=material('#ee291f'),beaconBlue=material('#1484eb');
 function add(g,m,x=0,y=0,z=0){const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);car.add(mesh);return mesh;}
 function block(w,h,d,m,x,y,z){return add(new T.BoxGeometry(w,h,d),m,x,y,z);}
 function line(points,r=.025){const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(new T.TubeGeometry(path,40,r,6,false),ink);}
 function loft(sections,m){const vertices=[],indices=[];sections.forEach(([z,w,low,high])=>{vertices.push(-w,low,z,w,low,z,-w,high,z,w,high,z);});for(let i=0;i<sections.length-1;i++){let a=i*4,b=a+4;indices.push(a,b,a+1,a+1,b,b+1,a+2,a+3,b+2,a+3,b+3,b+2,a,a+2,b,a+2,b+2,b,a+1,b+1,a+3,a+3,b+1,b+3);}indices.push(0,1,2,1,3,2);let n=(sections.length-1)*4;indices.push(n,n+2,n+1,n+1,n+2,n+3);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return add(g,m);}
 const body=[[-2.25,.78,.56,1.12],[-2.12,.95,.53,1.17],[-1.6,1,.52,1.2],[1.55,1,.52,1.2],[2.12,.91,.57,1.17],[2.3,.78,.65,1.1]];loft(body,blue);
 const upper=[[-2.25,.78,1.12,1.48],[-2.12,.95,1.17,1.65],[-1.48,1,1.2,1.7],[-1.1,.92,1.2,1.88],[-.86,.85,1.2,2.27],[-.52,.79,1.2,2.52],[0,.78,1.2,2.58],[.48,.8,1.2,2.5],[.85,.86,1.2,2.26],[1.12,.95,1.2,1.88],[1.65,1,1.2,1.69],[2.12,.91,1.17,1.55],[2.3,.78,1.1,1.38]];loft(upper,white);
 // Inset, rounded window silhouettes on both sides, with thick ink borders.
 for(const side of [-1,1]){const p=[[-.9,1.76],[-.71,2.17],[-.45,2.37],[0,2.42],[.44,2.32],[.72,2.08],[.86,1.76]];const sh=new T.Shape();p.forEach(([z,y],i)=>i?sh.lineTo(z,y):sh.moveTo(z,y));sh.closePath();const g=new T.ShapeGeometry(sh);const a=g.attributes.position;for(let i=0;i<a.count;i++){let z=a.getX(i),y=a.getY(i);a.setXYZ(i,side*(.813+(2.42-y)*.15),y,z);}g.computeVertexNormals();const gm=glass.clone();gm.side=T.DoubleSide;add(g,gm);line([...p,p[0]].map(([z,y])=>[side*(.829+(2.42-y)*.15),y,z]),.035);line([[side*.834,2.4,0],[side*.93,1.77,0],[side*1.015,.59,0]],.027);line([[-2.16,1.16],[-1.2,1.2],[0,1.2],[1.5,1.2],[2.2,1.13]].map(([z,y])=>[side*(Math.abs(z)>2?.93:1.015),y,z]),.026);
 for(const z of [-1.35,1.38]){const wheel=new T.Group();wheel.position.set(side*1.01,.56,z);car.add(wheel);const tyre=new T.Mesh(new T.CylinderGeometry(.59,.59,.36,32),ink);tyre.rotation.z=Math.PI/2;wheel.add(tyre);const hub=new T.Mesh(new T.CylinderGeometry(.225,.225,.375,24),white);hub.rotation.z=Math.PI/2;wheel.add(hub);wheels.push(wheel);}
 block(.08,.32,.38,yellow,side*.88,1.38,1.99);block(.08,.31,.38,red,side*.91,1.43,-1.99);
 }
 // Curved front and rear glass spans the width, making the cabin a volume.
 for(const back of [-1,1]){const g=new T.PlaneGeometry(1.34,.48);const w=add(g,glass,0,2.13,back*.87);w.rotation.x=back*-.57;if(back<0)w.rotation.y=Math.PI;}
 block(1.0,.1,.43,ink,0,2.66,-.06);block(.46,.26,.37,red,-.25,2.83,-.06);block(.46,.26,.37,beaconBlue,.25,2.83,-.06);
 for(const x of [-.57,.57]){block(.42,.29,.075,yellow,x,1.3,2.26);block(.39,.27,.075,red,x,1.33,-2.2);}block(.75,.2,.07,ink,0,.94,2.29);block(.62,.15,.07,white,0,.91,-2.25);
 return {car,wheels};
}
