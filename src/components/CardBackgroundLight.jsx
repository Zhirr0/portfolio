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
    vec2 p = uv;
    
    float t = iTime * 0.8;
    float dist = length(p);
    
    vec2 q = p;
    q += vec2(
        sin(dist * 3.5 - t * 0.8),
        cos(dist * 3.0 - t * 0.7)
    ) * 0.6;
    
    vec2 r = q;
    r += vec2(
        sin(length(q) * 5.0 - t * 1.0),
        cos(dist * 4.5 - t * 0.9)
    ) * 0.4;
    
    vec2 s = r;
    s += vec2(
        sin(dist * 6.5 - t * 1.2),
        cos(length(r) * 6.0 - t * 1.1)
    ) * 0.3;
    
    float waves = 0.0;
    waves += sin(dist * 12.0 - t * 1.6);
    waves += cos(length(s) * 15.0 - t * 1.9);
    waves += sin(dist * 8.0 - t * 1.3) * 0.7;
    
    waves = waves * 0.23 + 2.0;
    waves = smoothstep(0.13, 2.7, waves);
    
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

    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");

    const setSize = () => {
      const parent = canvas.parentElement;
      const w = Math.round(parent.offsetWidth * devicePixelRatio);
      const h = Math.round(parent.offsetHeight * devicePixelRatio);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    setSize();
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
