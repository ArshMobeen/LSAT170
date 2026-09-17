// Original small stable-fluid renderer. Velocity, pressure and dye live in
// ping-pong float textures. No image or third-party simulation is copied.
export function createFluid(canvas, getSettings) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    preserveDrawingBuffer: true,
  });
  if (!gl || !gl.getExtension("EXT_color_buffer_float"))
    throw new Error("float textures unavailable");
  const programs = [],
    targets = [],
    shaders = [];
  const vertex = `#version 300 es
  precision highp float; out vec2 uv;
  void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
  const head = `#version 300 es
  precision highp float; precision highp sampler2D; in vec2 uv; out vec4 result;
  uniform sampler2D source; uniform sampler2D field; uniform vec2 texel; uniform float dt;
  vec4 sampleSmooth(sampler2D tex,vec2 p){vec2 size=vec2(textureSize(tex,0));vec2 q=p*size-.5;vec2 i=floor(q);vec2 f=fract(q);return mix(mix(texture(tex,(i+.5)/size),texture(tex,(i+vec2(1.5,.5))/size),f.x),mix(texture(tex,(i+vec2(.5,1.5))/size),texture(tex,(i+1.5)/size),f.x),f.y);}
  `;
  function shader(type, code) {
    const s = gl.createShader(type);
    gl.shaderSource(s, code);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(s));
    shaders.push(s);
    return s;
  }
  const vs = shader(gl.VERTEX_SHADER, vertex);
  function program(code) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, head + code));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(p));
    programs.push(p);
    return p;
  }
  const advect = program(
    `uniform float decay; void main(){vec2 v=sampleSmooth(field,uv).xy;result=decay*sampleSmooth(source,uv-dt*v*texel);}`,
  );
  const splat = program(
    `uniform vec2 point;uniform vec3 color;uniform float radius;uniform float aspect;void main(){vec2 p=uv-point;p.x*=aspect;float a=exp(-dot(p,p)/radius);result=texture(source,uv)+vec4(color*a,0.);}`,
  );
  const curl = program(
    `void main(){float l=texture(source,uv-vec2(texel.x,0)).y;float r=texture(source,uv+vec2(texel.x,0)).y;float b=texture(source,uv-vec2(0,texel.y)).x;float t=texture(source,uv+vec2(0,texel.y)).x;result=vec4(.5*(r-l-t+b),0,0,1);}`,
  );
  const confine = program(
    `uniform float strength;void main(){float l=texture(field,uv-vec2(texel.x,0)).x;float r=texture(field,uv+vec2(texel.x,0)).x;float b=texture(field,uv-vec2(0,texel.y)).x;float t=texture(field,uv+vec2(0,texel.y)).x;float c=texture(field,uv).x;vec2 n=.5*vec2(abs(t)-abs(b),abs(r)-abs(l));n/=length(n)+.0001;n*=strength*c;n.y*=-1.;vec2 v=texture(source,uv).xy+dt*n;result=vec4(clamp(v,vec2(-600),vec2(600)),0,1);}`,
  );
  const divergence = program(
    `void main(){vec2 v=texture(source,uv).xy;float l=texture(source,uv-vec2(texel.x,0)).x;float r=texture(source,uv+vec2(texel.x,0)).x;float b=texture(source,uv-vec2(0,texel.y)).y;float t=texture(source,uv+vec2(0,texel.y)).y;if(uv.x<texel.x)l=-v.x;if(uv.x>1.-texel.x)r=-v.x;if(uv.y<texel.y)b=-v.y;if(uv.y>1.-texel.y)t=-v.y;result=vec4(.5*(r-l+t-b),0,0,1);}`,
  );
  const pressure = program(
    `void main(){float l=texture(source,uv-vec2(texel.x,0)).x;float r=texture(source,uv+vec2(texel.x,0)).x;float b=texture(source,uv-vec2(0,texel.y)).x;float t=texture(source,uv+vec2(0,texel.y)).x;result=vec4((l+r+b+t-texture(field,uv).x)*.25,0,0,1);}`,
  );
  const project = program(
    `void main(){float l=texture(field,uv-vec2(texel.x,0)).x;float r=texture(field,uv+vec2(texel.x,0)).x;float b=texture(field,uv-vec2(0,texel.y)).x;float t=texture(field,uv+vec2(0,texel.y)).x;result=vec4(texture(source,uv).xy-vec2(r-l,t-b),0,1);}`,
  );
  const display = program(
    `void main(){vec3 c=max(sampleSmooth(source,uv).rgb,vec3(0));float l=length(sampleSmooth(source,uv-vec2(texel.x,0)).rgb);float r=length(sampleSmooth(source,uv+vec2(texel.x,0)).rgb);float b=length(sampleSmooth(source,uv-vec2(0,texel.y)).rgb);float t=length(sampleSmooth(source,uv+vec2(0,texel.y)).rgb);vec3 n=normalize(vec3((l-r)*.4,(b-t)*.4,1));float light=.7+.35*dot(n,normalize(vec3(-.4,.6,1)));c=1.-exp(-c*light);result=vec4(pow(c,vec3(.85))+vec3(.004,.006,.012),1);}`,
  );
  const fade = program(
    `uniform float decay;void main(){result=texture(source,uv)*decay;}`,
  );
  function target(w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      w,
      h,
      0,
      gl.RGBA,
      gl.HALF_FLOAT,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      throw Error("Incomplete fluid framebuffer");
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const t = { tex, fbo, w, h };
    targets.push(t);
    return t;
  }
  function pair(w, h) {
    return {
      read: target(w, h),
      write: target(w, h),
      swap() {
        [this.read, this.write] = [this.write, this.read];
      },
    };
  }
  const ratio = Math.max(
    0.5,
    Math.min(3, canvas.clientWidth / canvas.clientHeight),
  );
  const sw = Math.round(128 * ratio),
    sh = 128,
    dw = Math.round(384 * ratio),
    dh = 384;
  const velocity = pair(sw, sh),
    dye = pair(dw, dh),
    p = pair(sw, sh),
    div = target(sw, sh),
    vort = target(sw, sh);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  function run(prog, out, uniforms) {
    gl.useProgram(prog);
    let slot = 0;
    for (const [key, v] of Object.entries(uniforms)) {
      const loc = gl.getUniformLocation(prog, key);
      if (v?.tex) {
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, v.tex);
        gl.uniform1i(loc, slot++);
      } else if (Array.isArray(v)) {
        v.length === 2 ? gl.uniform2fv(loc, v) : gl.uniform3fv(loc, v);
      } else gl.uniform1f(loc, v);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, out?.fbo || null);
    gl.viewport(0, 0, out?.w || canvas.width, out?.h || canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  let queue = [],
    frame,
    last = 0,
    paused = false,
    disposed = false,
    phase = 0;
  function color() {
    phase += 0.17;
    const palette = getSettings().flowPalette || "Aurora";
    if (palette === "Ocean") return [0.08, 0.35 + 0.15 * Math.sin(phase), 1.1];
    if (palette === "Ember") return [1.1, 0.18 + 0.14 * Math.sin(phase), 0.06];
    if (palette === "Pearl") return [0.55, 0.68, 0.8];
    return [
      0.06 + 1.1 * Math.max(0, Math.sin(phase)),
      0.06 + 0.7 * Math.max(0, Math.sin(phase + 2.1)),
      0.15 + 1.2 * Math.max(0, Math.sin(phase + 4.2)),
    ];
  }
  function inject(x, y, dx, dy, boost = 1) {
    if (queue.length < 60) queue.push({ x, y, dx, dy, boost, color: color() });
  }
  function burst() {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      inject(
        0.5 + (Math.cos(a) * 0.11) / ratio,
        0.5 + Math.sin(a) * 0.11,
        -Math.sin(a) * 80,
        Math.cos(a) * 80,
        1.6,
      );
    }
  }
  function draw(time) {
    if (disposed) return;
    frame = requestAnimationFrame(draw);
    const settings = getSettings();
    const elapsed = Math.min((time - (last || time)) / 1000, 0.024);
    last = time;
    if (document.hidden) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5),
      w = Math.round(canvas.clientWidth * dpr),
      h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const texel = [1 / sw, 1 / sh];
    const calm = settings.reducedMotion;
    const energy = calm?.valueOf() ? 0 : (settings.intensity ?? 65) / 100;
    for (const s of queue) {
      const radius = 0.0004 + (settings.width ?? 5) * 0.00012;
      run(splat, velocity.write, {
        source: velocity.read,
        point: [s.x, s.y],
        color: [
          s.dx * (calm?.valueOf() ? 0.15 : 1),
          s.dy * (calm?.valueOf() ? 0.15 : 1),
          0,
        ],
        radius,
        aspect: ratio,
      });
      velocity.swap();
      run(splat, dye.write, {
        source: dye.read,
        point: [s.x, s.y],
        color: s.color.map((c) => c * s.boost),
        radius,
        aspect: ratio,
      });
      dye.swap();
    }
    queue = [];
    if (!paused) {
      const dt = elapsed * (calm?.valueOf() ? 0.25 : 0.65 + energy * 0.6);
      run(advect, velocity.write, {
        source: velocity.read,
        field: velocity.read,
        texel,
        dt,
        decay: Math.pow(0.985, dt * 60),
      });
      velocity.swap();
      run(curl, vort, { source: velocity.read, texel });
      run(confine, velocity.write, {
        source: velocity.read,
        field: vort,
        texel,
        dt,
        strength: calm ? 2 : 14 + energy * 22,
      });
      velocity.swap();
      run(divergence, div, { source: velocity.read, texel });
      run(fade, p.write, { source: p.read, decay: 0.7 });
      p.swap();
      for (let i = 0; i < 14; i++) {
        run(pressure, p.write, { source: p.read, field: div, texel });
        p.swap();
      }
      run(project, velocity.write, {
        source: velocity.read,
        field: p.read,
        texel,
      });
      velocity.swap();
      run(advect, dye.write, {
        source: dye.read,
        field: velocity.read,
        texel,
        dt,
        decay: Math.exp(
          -dt * (0.12 + (100 - (settings.resistance ?? 55)) * 0.008),
        ),
      });
      dye.swap();
    }
    run(display, null, { source: dye.read, texel: [1 / dw, 1 / dh] });
  }
  burst();
  frame = requestAnimationFrame(draw);
  return {
    inject,
    burst,
    pause(v) {
      paused = v;
    },
    clear() {
      for (const t of targets) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      queue = [];
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      targets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      });
      programs.forEach((p) => gl.deleteProgram(p));
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteVertexArray(vao);
    },
  };
}

// A lightweight flowing-particle fallback for devices without float framebuffers.
export function createFlowFallback(canvas, getSettings) {
  const ctx = canvas.getContext("2d");
  let frame,
    points = [],
    last = 0,
    paused = false;
  function inject(x, y, dx, dy, boost = 1) {
    for (let i = 0; i < 20 * boost; i++)
      points.push({
        x: x * canvas.width,
        y: (1 - y) * canvas.height,
        vx: dx * 0.04 + (Math.random() - 0.5) * 4,
        vy: -dy * 0.04 + (Math.random() - 0.5) * 4,
        life: 1,
        hue: (performance.now() * 0.035 + i * 2) % 360,
      });
    points = points.slice(-2200);
  }
  function burst() {
    inject(0.5, 0.5, 20, 15, 4);
  }
  function draw(t) {
    frame = requestAnimationFrame(draw);
    if (document.hidden) return;
    const rect = canvas.getBoundingClientRect();
    if (
      canvas.width !== Math.round(rect.width) ||
      canvas.height !== Math.round(rect.height)
    ) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = "#010204";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const dt = Math.min(2, (t - (last || t)) / 16.67);
    last = t;
    if (paused) return;
    ctx.fillStyle = "rgba(1,2,4,.035)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const settings = getSettings();
    ctx.globalCompositeOperation = "screen";
    for (const p of points) {
      const px = p.x,
        py = p.y;
      const angle =
        Math.sin(p.x * 0.008 + t * 0.00012) +
        Math.cos(p.y * 0.008 - t * 0.00008);
      const speed = settings.reducedMotion?.valueOf()
        ? 0.2
        : 0.8 + (settings.intensity ?? 65) / 70;
      p.vx = p.vx * 0.96 + Math.cos(angle * 3) * 0.3 * speed;
      p.vy = p.vy * 0.96 + Math.sin(angle * 3) * 0.3 * speed;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 0.003 * dt;
      const hue =
        settings.flowPalette === "Ocean"
          ? 220
          : settings.flowPalette === "Ember"
            ? 20
            : p.hue;
      ctx.strokeStyle = `hsla(${hue},${settings.flowPalette === "Pearl" ? 15 : 90}%,55%,${Math.max(0, p.life) * 0.45})`;
      ctx.lineWidth = 1 + (settings.width ?? 5) * 0.3;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    points = points.filter((p) => p.life > 0);
  }
  frame = requestAnimationFrame(draw);
  const initialBurst = setTimeout(burst, 50);
  return {
    inject,
    burst,
    pause(v) {
      paused = v;
    },
    clear() {
      points = [];
      ctx.fillStyle = "#010204";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    destroy() {
      clearTimeout(initialBurst);
      cancelAnimationFrame(frame);
      points = [];
    },
  };
}
