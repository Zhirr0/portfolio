import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform vec2  iResolution;
  uniform float iTime;

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 origin = vec2(1.0, 0.0);
    float dist = length(uv - origin);
    float diag = uv.x + uv.y;
    float cross = uv.x - uv.y;

    vec2 q = uv;
    q.x += sin(diag * 4.5 - iTime * 0.28) * 0.42 + cos(cross * 3.8 - iTime * 0.24) * 0.28;
    q.y += cos(dist * 4.2 - iTime * 0.26) * 0.42 + sin(diag * 3.5 - iTime * 0.22) * 0.28;

    vec2 r = q;
    r.x += sin(length(q) * 7.0 - iTime * 0.38) * 0.30;
    r.y += cos(cross * 6.5 - iTime * 0.35) * 0.30;

    vec2 s = r;
    s.x += cos(length(r) * 9.5 - iTime * 0.48) * 0.22;
    s.y += sin(diag * 8.0 - iTime * 0.44) * 0.22;

    float waves = 0.0;
    // abs creates the sharp bright caustic lines
    waves += abs(sin(length(q) * 12.0 - iTime * 0.62)) * 0.65;
    waves += abs(cos(length(r) * 20.0 - iTime * 0.80)) * 0.52;
    waves += abs(sin(length(s) * 30.0 - iTime * 0.98)) * 0.40;
    waves += abs(cos(diag * 16.0 - iTime * 0.70)) * 0.32;
    waves += abs(sin(cross * 22.0 - iTime * 0.86)) * 0.26;
    waves -= abs(cos((dist * 14.0 + diag * 9.0) - iTime * 0.74)) * 0.20;

    float falloff = smoothstep(5.0, 0.0, dist);
    waves *= falloff;
    // invert so lines are bright on dark water
    waves = 1.0 - clamp(waves * 0.7, 0.0, 2.0);
    waves = pow(waves, 2.5);
    fragColor = vec4(vec3(waves), 1.0);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function CardBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");

    // Use the parent element's size — it's stable during GSAP pin
    // because GSAP doesn't change the parent's layout dimensions
    const setSize = () => {
      const parent = canvas.parentElement;
      const w = Math.round(parent.offsetWidth  * devicePixelRatio);
      const h = Math.round(parent.offsetHeight * devicePixelRatio);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    setSize();

    // window resize = real viewport change only, never fires on GSAP pin
    window.addEventListener("resize", setSize);

    let rafId;
    const start = performance.now();

    const render = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        transform: "translateZ(0)",
      }}
    />
  );
}
