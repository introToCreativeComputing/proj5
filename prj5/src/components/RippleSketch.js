import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const RippleSketch = () => {
    const canvasRef = useRef(null);
    const p5Instance = useRef(null); // Store the p5 instance

    useEffect(() => {
        // Define your p5.js sketch
        const sketch = (p) => {
            let ripples = [];
            let rippleInterval = 500;
            let lastRippleTime = 0;

            p.setup = () => {
                p.createCanvas(1920, 1080).parent(canvasRef.current);
                p.background(0);
            };

            p.draw = () => {
                p.background(0);

                if (p.mouseIsPressed) {
                    let posX = p.mouseX;
                    let posY = p.mouseY;
                    if (p.millis() - lastRippleTime > rippleInterval) {
                        ripples.push(new Ripple(posX, posY, p));  // Pass p to Ripple
                        lastRippleTime = p.millis();
                    }
                }

                for (let i = ripples.length - 1; i >= 0; i--) {
                    let r = ripples[i];
                    r.update();
                    r.display(i, ripples.length);
                    if (r.isExpired()) {
                        ripples.splice(i, 1);
                    }
                }
            };

            p.mousePressed = () => {
                lastRippleTime = p.millis();
                ripples.push(new Ripple(p.mouseX, p.mouseY, p));  // Pass p to Ripple
            };

            class Ripple {
                constructor(x, y, p) {
                    this.creationTime = p.millis();
                    this.lifetime = 5000;
                    this.particles = [];
                    this.numParticles = 300;
                    this.speed = 3;

                    for (let i = 0; i < this.numParticles; i++) {
                        let angle = p.map(i, 0, this.numParticles, 0, p.TWO_PI);
                        let vx = p.cos(angle) * this.speed;
                        let vy = p.sin(angle) * this.speed;
                        this.particles.push(new Particle(x, y, vx, vy));
                    }
                }

                update() {
                    for (let particle of this.particles) {
                        particle.update();
                    }
                }

                display(index, total) {
                    let elapsed = p.millis() - this.creationTime;
                    let fadeFactor = p.constrain(elapsed / this.lifetime, 0, 1);
                    let baseBrightness = p.lerp(255, 0, fadeFactor);
                    let modFactor = 1;

                    if (total > 1) {
                        let fraction = index / (total - 1);
                        modFactor = p.map(p.sin(fraction * p.TWO_PI), -1, 1, 0.8, 1.2);
                    }

                    let modulatedBrightness = baseBrightness * modFactor;
                    modulatedBrightness = p.constrain(modulatedBrightness, 0, 255);

                    p.noFill();
                    p.stroke(modulatedBrightness);
                    p.strokeWeight(2);
                    p.curveTightness(0);

                    p.beginShape();
                    let first = this.particles[0].pos;
                    p.curveVertex(first.x, first.y);
                    for (let particle of this.particles) {
                        p.curveVertex(particle.pos.x, particle.pos.y);
                    }
                    p.curveVertex(first.x, first.y);
                    p.endShape();
                }

                isExpired() {
                    return p.millis() - this.creationTime >= this.lifetime;
                }
            }

            class Particle {
                constructor(x, y, vx, vy) {
                    this.pos = p.createVector(x, y);
                    this.vel = p.createVector(vx, vy);
                }

                update() {
                    this.pos.add(this.vel);
                    if (this.pos.x < 0) {
                        this.pos.x = 0;
                        this.vel.x *= -1;
                    } else if (this.pos.x > p.width) {
                        this.pos.x = p.width;
                        this.vel.x *= -1;
                    }
                    if (this.pos.y < 0) {
                        this.pos.y = 0;
                        this.vel.y *= -1;
                    } else if (this.pos.y > p.height) {
                        this.pos.y = p.height;
                        this.vel.y *= -1;
                    }
                }
            }
        };

        // Store the p5 instance so we can access it later for cleanup
        p5Instance.current = new p5(sketch);

        // Cleanup p5.js instance when component unmounts
        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, []); // Empty dependency array ensures this effect runs once when component mounts

    return <div ref={canvasRef}></div>;
};

export default RippleSketch;
