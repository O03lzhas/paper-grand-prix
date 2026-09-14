import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','style.css','game.js','garage.js','multiplayer.js','police-car.js','three.module.js'])await copyFile(f,'dist/'+f);
