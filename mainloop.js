var Core = {
    frameID: 0,
    version: '0.0.4',
};

var batch = null;
// temp values translated out of loop for better performance
var blend_map = [1,1,1,1];
var AR = 1.0;

var player = new Player(new vec3(12,6,0), 10, {});
player.inventory['floor'] = 11;

var accessSlots = []
for (let name in player.inventory){
    accessSlots.push(name);
}
for (let i = accessSlots.length; i < 10; i++)
    accessSlots.push(null);

function draw_ui_layer(mx,my, uicamera, camera, uiShader){
    uiShader.use();
    uiShader.uniform1f("u_timer", Time.time);
    camera.setupShader(uiShader, false);
    Assets.blankTexture.bind();
    
    batch.rect(mx+0.4,my+0.4,0.2,0.2, 0.0,0.0,0.0,0.5);
    batch.flush(uiShader);
    
    uicamera.setupShader(uiShader, false);
    batch.rect(0,0,50,180, 0.0,0.0,0.0,0.7);
    batch.rect(50,0,400,50, 0.0,0.0,0.0,0.7);
    for (let i = 0; i < 10; i++){
        if (i <= player.health)
            batch.rect(10, 150 - i * 10, 8,8, 1,0.4,0.3,1.0);
        else
            batch.rect(10, 150 - i * 10, 8,8, 0.2,0.05,0.0,0.5);
    }
    batch.sprite(50+player.selectedSlot*36+5,9+5+28,22,5, 1,1,0.3,1, player.selectedSlot)
    batch.flush(uiShader);
    Assets.tilesTexture.bind()
    for (let i = 0; i < 10; i++){
        let item = accessSlots[i];
        if (!item){
            batch.sprite(50+i*36,9,32,32, 0,0,0,0.5, 0)
        } else {
            batch.sprite(50+i*36-1,9-1,34,34, 0,0,0,1, main_atlas[TILE_DEFS[item].texture])
            batch.sprite(50+i*36,9,32,32, 1,1,1,1, main_atlas[TILE_DEFS[item].texture])
            let count = player.inventory[item]-1;
            for (let j = 0; j < count; j++){
                let cx = j % 5;
                let cy = Math.floor(j / 5);
                batch.sprite(50+i*36+cx*6,9+35+cy*6,4,4, 1,1,1,1, main_atlas[TILE_DEFS[item].texture])
            }
        }
    }
    batch.flush(uiShader);
}

function draw_level(camera, shader){
    shader.use();
    shader.uniform1f("u_timer", Time.time);
    shader.uniformMat4("u_model", mat4.translation(0,0,0));
    
    gl.clearColor(0.7,0.64,0.6,0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0, canvas.width, canvas.height);

    Assets.tilesTexture.bind()
    batch.flippedTextures = true;
    camera.setupShader(shader, false);
    //batch.lines = true;

    // how one tile texture resolution relates to atlas resolution
    let sz = 1.0/16.0;
    for (let id = 0; id < 10; id++){
        for (let x = 0; x < current_map.width; x++){
            for (let y = 0; y < current_map.height; y++){
                let yy = current_map.height - y - 1
                // sort of frustum culling in 2D
                if (x < camera.coords.x-camera.fov*AR-3 || x > camera.coords.x+camera.fov*AR+2)
                    continue
                if (yy < camera.coords.y-camera.fov-3 || yy > camera.coords.y+camera.fov+2)
                    continue
                draw_tile(x,y, x,y, blend_map, sz, id);
            }
        }
    }
    let flip = 1.0
    let anim_offset = 0
	let offset = 0.0;
	switch (player.dir){
        case 0: anim_offset = 16; break;
        case 1: anim_offset = 32; break;
        case 2: flip = -1.0; anim_offset = 16; offset += 1.0; break;
        case 3: flip = -1.0; anim_offset = 0; offset += 1.0; break;
    }
    if (Math.floor(Core.frameID / 256) % 2 == 0)
    	anim_offset += 16 * 3;
    	
    let frame = 128+(Math.floor(Core.frameID/8)%4)+anim_offset;

    draw_outline(player.coords.x-0.5+offset, player.coords.y+0.5, flip, -1, frame);
    batch.sprite(player.coords.x-0.5+offset,player.coords.y+0.5,
    	1*flip,-1, 1,1,1,1, frame)
    batch.flush(shader);
    batch.lines = false;
}

function draw_outline(x,y, w,h, index){
    let p = 1.0/16.0;
    	
    batch.sprite(x - p, y - p, w,h, 0,0,0,1, index);
	batch.sprite(x + p, y - p, w,h, 0,0,0,1, index);
    batch.sprite(x - p, y + p, w,h, 0,0,0,1, index);
	batch.sprite(x + p, y + p, w,h, 0,0,0,1, index);
    batch.sprite(x - p, y,     w,h, 0,0,0,1, index);
	batch.sprite(x + p, y,     w,h, 0,0,0,1, index);
	batch.sprite(x,     y - p, w,h, 0,0,0,1, index);
}

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
    
    AR = Window.width / Window.height
    load_assets();
    batch = new Batch(4096, Assets.shader);
    
    var camera = new Camera(new vec3(10,5,1));
    camera.flipped = true;
    camera.fov = 6;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.fov = Window.height*0.5;
    uicamera.centred = false;
    
    camera.update();
    
    function onTick(now) {
        const fpsElement = document.querySelector("#fps");
        Core.frameID++;
        Time.update(now, fpsElement);

        let speed = 2.0;
        if (Events.left){
            player.coords.x -= Time.dt * speed;
            player.dir = 0;
        }
        if (Events.right){
            player.coords.x += Time.dt * speed;
        	player.dir = 2;
        }
        if (Events.down){
            player.coords.y -= Time.dt * speed;
        	player.dir = 3;
        }
        if (Events.up){
            player.coords.y += Time.dt * speed;
        	player.dir = 1;
        }

        camera.coords.x = player.coords.x;
        camera.coords.y = player.coords.y;
        camera.toBounds(0.5,current_map.width+0.5, 0.5,current_map.height+0.5);
        camera.update();
        
        draw_level(camera, Assets.shader);
        
        let mx = (Events.mx / Window.width - 0.5) * 2.0 * (Window.width / Window.height)
        let my = -(Events.my / Window.height - 0.5) * 2.0
        
        mx = mx * camera.fov + camera.coords.x;
        my = my * camera.fov + camera.coords.y;
        mx = Math.floor(mx);
        my = Math.floor(my);
        
        if (mx >= 0 && mx < current_map.width && my >= 0 && my < current_map.height){
            if (Events.lmb && accessSlots[player.selectedSlot] && current_map.get(mx,my-1).id != accessSlots[player.selectedSlot]){
                current_map.set(mx,my-1, accessSlots[player.selectedSlot])
                player.inventory[accessSlots[player.selectedSlot]]--;
                if (!player.inventory[accessSlots[player.selectedSlot]])
                    accessSlots[player.selectedSlot] = null;
            }
        }
        
        draw_ui_layer(mx,my, uicamera, camera, Assets.uiShader);

        gl.flush();
        Events.pull()
        window.requestAnimationFrame(onTick);
    }
    onTick(0.0);
}

window.onload = main;
