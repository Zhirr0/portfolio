import { useLayoutEffect, useRef } from "react";
import p5 from "p5";
import Matter from "matter-js";
import "../../styles/gravity-interaction.css";
import gravityConfig from "../../config/gravity.config";
import RoutingTransition from "../../components/transitionRouter/Transition";

let gravityP5Instance = null;
let gravityP5Canvas = null;
let gravityP5Creator = null;

const GravityInteraction = () => {
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useLayoutEffect(() => {
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;

    let engine;
    let words = [];
    let stars = [];
    let gravityMode = true;
    let cursorAnimTime = 0;

    class Word {
      constructor(p, x, y, word) {
        this.p = p;
        this.body = Bodies.rectangle(
          x,
          y,
          word.length * gravityConfig.wordSpacing.padding +
            gravityConfig.wordSpacing.extraWidth,
          gravityConfig.wordSpacing.height,
          {
            restitution: gravityConfig.physics.restitution,
            friction: gravityConfig.physics.friction,
            frictionAir: gravityConfig.physics.frictionAir,
          },
        );
        this.word = word;
        this.orbitAngle = 0;
        this.glowIntensity = 0;
        World.add(engine.world, this.body);
      }

      update() {
        this.orbitAngle += 0.02;

        let d = this.p.dist(
          this.p.mouseX,
          this.p.mouseY,
          this.body.position.x,
          this.body.position.y,
        );
        this.glowIntensity = this.p.constrain(
          this.p.map(d, 0, gravityConfig.wordStyle.glowDistance, 1, 0),
          0,
          1,
        );

        if (gravityMode) {
          // Pull words toward cursor when close enough
          if (d < gravityConfig.gravityWell.pullRadius) {
            let force = p5.Vector.sub(
              this.p.createVector(this.p.mouseX, this.p.mouseY),
              this.p.createVector(this.body.position.x, this.body.position.y),
            );
            force.normalize();
            let strength = this.p.map(
              d,
              0,
              gravityConfig.gravityWell.pullRadius,
              gravityConfig.gravityWell.maxPullStrength,
              gravityConfig.gravityWell.minPullStrength,
            );
            force.mult(strength);
            Body.applyForce(this.body, this.body.position, {
              x: force.x,
              y: force.y,
            });
          }

          // Apply tangential force for orbital motion
          if (d < gravityConfig.gravityWell.orbitRadius) {
            let perpAngle =
              this.p.atan2(
                this.body.position.y - this.p.mouseY,
                this.body.position.x - this.p.mouseX,
              ) + this.p.HALF_PI;
            Body.applyForce(this.body, this.body.position, {
              x: this.p.cos(perpAngle) * gravityConfig.gravityWell.orbitForce,
              y: this.p.sin(perpAngle) * gravityConfig.gravityWell.orbitForce,
            });
          }
        } else {
          // Push words away from cursor
          if (d < gravityConfig.repulsion.pushRadius) {
            let force = p5.Vector.sub(
              this.p.createVector(this.body.position.x, this.body.position.y),
              this.p.createVector(this.p.mouseX, this.p.mouseY),
            );
            force.normalize();
            let strength = this.p.map(
              d,
              0,
              gravityConfig.repulsion.pushRadius,
              gravityConfig.repulsion.maxPushStrength,
              gravityConfig.repulsion.minPushStrength,
            );
            force.mult(strength);
            Body.applyForce(this.body, this.body.position, {
              x: force.x,
              y: force.y,
            });
          }
        }

        // Boundary constraints
        let margin = gravityConfig.boundary.margin;
        if (this.body.position.x < margin) {
          Body.setPosition(this.body, { x: margin, y: this.body.position.y });
        }
        if (this.body.position.x > this.p.width - margin) {
          Body.setPosition(this.body, {
            x: this.p.width - margin,
            y: this.body.position.y,
          });
        }
        if (this.body.position.y < margin) {
          Body.setPosition(this.body, { x: this.body.position.x, y: margin });
        }
        if (this.body.position.y > this.p.height - margin) {
          Body.setPosition(this.body, {
            x: this.body.position.x,
            y: this.p.height - margin,
          });
        }
      }

      show() {
        let { position, angle } = this.body;

        this.p.push();
        this.p.translate(position.x, position.y);

        // Draw orbit trail when word is close to cursor
        if (this.glowIntensity > 0.3) {
          this.p.noFill();
          this.p.stroke(
            ...gravityConfig.wordStyle.strokeBaseColor,
            this.glowIntensity * 100,
          );
          this.p.strokeWeight(1);
          let d = this.p.dist(
            this.p.mouseX,
            this.p.mouseY,
            position.x,
            position.y,
          );
          this.p.circle(0, 0, d * 2);
        }

        this.p.rotate(angle);

        if (this.glowIntensity > 0) {
          this.p.drawingContext.shadowBlur =
            gravityConfig.wordStyle.shadowBlur * this.glowIntensity;
          this.p.drawingContext.shadowColor = `rgba(150, 100, 255, ${this.glowIntensity})`;
        }

        this.p.rectMode(this.p.CENTER);
        let boxAlpha =
          gravityConfig.wordStyle.boxAlpha +
          this.glowIntensity * gravityConfig.wordStyle.boxAlphaIncrease;
        let boxR =
          gravityConfig.wordStyle.boxBaseColor[0] +
          this.glowIntensity * gravityConfig.wordStyle.boxGlowIncrease[0];
        let boxG =
          gravityConfig.wordStyle.boxBaseColor[1] +
          this.glowIntensity * gravityConfig.wordStyle.boxGlowIncrease[1];
        let boxB =
          gravityConfig.wordStyle.boxBaseColor[2] +
          this.glowIntensity * gravityConfig.wordStyle.boxGlowIncrease[2];
        this.p.fill(boxR, boxG, boxB, boxAlpha);

        let strokeR =
          gravityConfig.wordStyle.strokeBaseColor[0] +
          this.glowIntensity * gravityConfig.wordStyle.strokeGlowIncrease[0];
        let strokeG =
          gravityConfig.wordStyle.strokeBaseColor[1] +
          this.glowIntensity * gravityConfig.wordStyle.strokeGlowIncrease[1];
        let strokeB =
          gravityConfig.wordStyle.strokeBaseColor[2] +
          this.glowIntensity * gravityConfig.wordStyle.strokeGlowIncrease[2];
        this.p.stroke(strokeR, strokeG, strokeB);
        this.p.strokeWeight(
          gravityConfig.wordStyle.strokeWeight +
            this.glowIntensity * gravityConfig.wordStyle.strokeWeightIncrease,
        );
        this.p.rect(
          0,
          0,
          this.word.length * gravityConfig.wordSpacing.padding +
            gravityConfig.wordSpacing.extraWidth,
          gravityConfig.wordSpacing.height,
          gravityConfig.wordStyle.borderRadius,
        );

        this.p.drawingContext.shadowBlur = 0;

        this.p.noStroke();
        let textR =
          gravityConfig.wordStyle.textColor[0] +
          this.glowIntensity * gravityConfig.wordStyle.textGlowIncrease[0];
        let textG =
          gravityConfig.wordStyle.textColor[1] +
          this.glowIntensity * gravityConfig.wordStyle.textGlowIncrease[1];
        let textB =
          gravityConfig.wordStyle.textColor[2] +
          this.glowIntensity * gravityConfig.wordStyle.textGlowIncrease[2];
        this.p.fill(textR, textG, textB);
        this.p.textSize(
          gravityConfig.wordStyle.fontSize +
            this.glowIntensity * gravityConfig.wordStyle.fontSizeIncrease,
        );
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textStyle(this.p.BOLD);
        this.p.text(this.word, 0, 0);

        this.p.pop();
      }
    }

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.cursor("none");
        engine = Engine.create();
        engine.gravity.y = gravityConfig.physics.gravity;

        for (let i = 0; i < gravityConfig.starfield.count; i++) {
          stars.push({
            x: p.random(p.width),
            y: p.random(p.height),
            size: p.random(
              gravityConfig.starfield.minSize,
              gravityConfig.starfield.maxSize,
            ),
            twinkle: p.random(p.TWO_PI),
          });
        }

        // Position words in a circle formation
        for (let i = 0; i < gravityConfig.words.length; i++) {
          let angle = (p.TWO_PI / gravityConfig.words.length) * i;
          let x =
            p.width / 2 + p.cos(angle) * gravityConfig.wordSpacing.circleRadius;
          let y =
            p.height / 2 +
            p.sin(angle) * gravityConfig.wordSpacing.circleRadius;
          words.push(new Word(p, x, y, gravityConfig.words[i]));
        }
      };

      p.draw = () => {
        p.background(...gravityConfig.background.color);

        for (let star of stars) {
          star.twinkle += gravityConfig.starfield.twinkleSpeed;
          let brightness = p.map(
            p.sin(star.twinkle),
            -1,
            1,
            gravityConfig.starfield.minBrightness,
            gravityConfig.starfield.maxBrightness,
          );
          p.fill(brightness);
          p.noStroke();
          p.circle(star.x, star.y, star.size);
        }

        Engine.update(engine);

        drawCursor(p);

        for (let word of words) {
          word.update();
          word.show();
        }
        const paddingTop = 100;

        p.fill(...gravityConfig.ui.instructionColor);
        p.noStroke();
        p.textSize(gravityConfig.ui.fontSize);
        p.textAlign(p.LEFT, p.TOP);

        p.text(
          "CLICK: Toggle Gravity Mode",
          gravityConfig.ui.position.x,
          gravityConfig.ui.position.y + paddingTop,
        );

        p.text(
          `Mode: ${gravityMode ? "Gravity Well" : "Repulsion"}`,
          gravityConfig.ui.position.x,
          gravityConfig.ui.position.y +
            paddingTop +
            gravityConfig.ui.lineHeight,
        );
      };

      function drawCursor(p) {
        p.push();
        p.translate(p.mouseX, p.mouseY);
        p.noFill();

        let cursorConfig = gravityMode
          ? gravityConfig.cursor.gravityMode
          : gravityConfig.cursor.repulsionMode;

        cursorAnimTime += 0.02;

        // Animated rings that pulse and rotate based on mode
        for (let i = 1; i <= cursorConfig.ringsCount; i++) {
          let alpha = p.map(
            i,
            1,
            cursorConfig.ringsCount,
            cursorConfig.ringsMaxAlpha,
            cursorConfig.ringsMinAlpha,
          );
          p.stroke(...cursorConfig.ringsColor, alpha);
          p.strokeWeight(2);

          let baseRadius = i * cursorConfig.ringsSpacing;
          let animatedRadius, rotation;

          if (gravityMode) {
            // Inward spiral motion
            let pulseAmount = p.sin(cursorAnimTime + i * 0.5) * 0.075;
            animatedRadius = baseRadius * (1 - pulseAmount);
            rotation = (cursorAnimTime + i * 0.3) * 0.5;
          } else {
            // Outward expansion motion
            let pulseAmount = p.sin(cursorAnimTime + i * 0.5) * 0.075;
            animatedRadius = baseRadius * (1 + pulseAmount);
            rotation = -(cursorAnimTime + i * 0.3) * 0.5;
          }

          p.push();
          p.rotate(rotation);

          for (let angle = 0; angle < p.TWO_PI; angle += p.PI / 8) {
            let startAngle = angle;
            let endAngle = angle + p.PI / 10;
            p.arc(0, 0, animatedRadius, animatedRadius, startAngle, endAngle);
          }

          p.pop();
        }

        p.fill(...cursorConfig.outerColor);
        p.noStroke();
        p.circle(0, 0, cursorConfig.outerSize);
        p.fill(...cursorConfig.innerColor);
        p.circle(0, 0, cursorConfig.innerSize);
        p.pop();
      }

      p.mousePressed = () => {
        gravityMode = !gravityMode;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    // Reuse existing p5 instance across remounts to prevent canvas duplication
    if (canvasRef.current) {
      if (gravityP5Canvas) {
        if (gravityP5Canvas.parentElement !== canvasRef.current) {
          canvasRef.current
            .querySelectorAll("canvas")
            .forEach((c) => c.remove());
          canvasRef.current.appendChild(gravityP5Canvas);
          gravityP5Creator = canvasRef.current;
        }
        p5InstanceRef.current = gravityP5Instance;
      } else {
        canvasRef.current.querySelectorAll("canvas").forEach((c) => c.remove());

        gravityP5Instance = new p5(sketch, canvasRef.current);
        gravityP5Canvas = canvasRef.current.querySelector("canvas") || null;
        gravityP5Creator = canvasRef.current;
        p5InstanceRef.current = gravityP5Instance;
      }
    }

    return () => {
      if (canvasRef.current && gravityP5Creator === canvasRef.current) {
        if (gravityP5Instance) {
          try {
            gravityP5Instance.remove();
          } catch (err) {
            console.log(err);
          }
        }
        if (gravityP5Canvas && gravityP5Canvas.parentElement) {
          gravityP5Canvas.parentElement.removeChild(gravityP5Canvas);
        }

        gravityP5Instance = null;
        gravityP5Canvas = null;
        gravityP5Creator = null;
        p5InstanceRef.current = null;
      } else {
        if (canvasRef.current) {
          canvasRef.current
            .querySelectorAll("canvas")
            .forEach((c) => c.remove());
        }
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default RoutingTransition(GravityInteraction);
