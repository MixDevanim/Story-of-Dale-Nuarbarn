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

function draw_ui_layer(mx,my, uicamera, camera, uiShader){
    uiShader.use();
    uiShader.uniform1f("u_timer", Time.time);
    //Assets.blankTexture.bind();
    uicamera.setupShader(uiShader, false);
    batch.rect(0,0,50,180, 0.0,0.0,0.0,0.7);
    batch.rect(50,0,400,50, 0.0,0.0,0.0,0.7);
    
    batch.rect(Window.width/2-1,Window.height/2-1,1,1, 1,0,0,1);
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
    let string = 'fps: '+(Time.framerateMeasured.toFixed(2));
    draw_text(string, 10,10);
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
    let frame = 128+anim_offset;
    if (player.go){
        frame += (Math.floor(Time.time*8)%4);
    }
    draw_outline(player.coords.x-0.5+offset, player.coords.y+0.5, flip, -1, frame);
    batch.sprite(player.coords.x-0.5+offset,player.coords.y+0.5,
        1*flip,-1, 1,1,1,1, frame)
        
    batch.sprite(12+0.5,7+0.5,
        1,-1, 1,1,1,1, 16)
    batch.sprite(12+0.5,7+0.5+0.5,
        1,-1, 1,1,1,1, 17)
    batch.sprite(13+0.1,7+0.5,
        1,-1, 1,1,1,1, 17)
    batch.sprite(11+0.7,7+0.5,
        1,-1, 1,1,1,1, 18)
    batch.sprite(15+0.5,7+0.5,
        1,-1, 1,1,1,1, 23)
    batch.sprite(16+0.5,7+0.5,
        1,-1, 1,1,1,1, 24)
    batch.flush(shader);
    batch.lines = false;
}
