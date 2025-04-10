import React, { useState, useEffect } from 'react';
import p5 from 'p5'; // p5.js for creative interactive art
import './OnBoarding.css';
const OnBoarding = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    useEffect(() => {
        // Set up the p5.js sketch
        const sketch = (p) => {
            let particles = [];

            p.setup = () => {
                p.createCanvas(window.innerWidth, window.innerHeight);
                p.background(0);
            };

            p.draw = () => {
                p.background(0, 10); // Slight fade for smooth animations
                particles.push(new Particle(p.mouseX, p.mouseY, p));
                particles.forEach((particle, index) => {
                    particle.update();
                    particle.display();
                    if (particle.isOffScreen()) {
                        particles.splice(index, 1);
                    }
                });
            };

            class Particle {
                constructor(x, y, p) {
                    this.pos = p.createVector(x, y);
                    this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
                    this.acc = p.createVector(0, 0);
                    this.lifespan = 255;
                }

                update() {
                    this.vel.add(this.acc);
                    this.pos.add(this.vel);
                    this.acc.mult(0);

                    // Add a little force based on mouse position
                    let mouseForce = p.createVector(p.mouseX, p.mouseY).sub(this.pos).normalize().mult(0.1);
                    this.acc.add(mouseForce);

                    this.lifespan -= 2;
                }

                display() {
                    p.stroke(255, this.lifespan);
                    p.strokeWeight(2);
                    p.noFill();
                    p.ellipse(this.pos.x, this.pos.y, 20, 20);
                }

                isOffScreen() {
                    return this.pos.x < 0 || this.pos.x > p.width || this.pos.y < 0 || this.pos.y > p.height;
                }
            }
        };

        // Initialize the p5.js sketch
        new p5(sketch);

        // Cleanup p5.js instance when component unmounts
        return () => {
            p5.remove();
        };
    }, []);

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <h1>Welcome to Our Interactive Art Onboarding!</h1>
                <p className="description">Let the art respond to your interactions.</p>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="step">
                        <h2>Step 1: Interact with the Art</h2>
                        <p>Move your mouse to create new particles on the screen.</p>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="step">
                        <h2>Step 2: Click to Create More Effects</h2>
                        <p>Click on the screen to create additional effects.</p>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="step">
                        <h2>Step 3: Enjoy the Experience</h2>
                        <p>You are now ready to explore the rest of the application.</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="navigation-buttons">
                    <button onClick={prevStep} disabled={step === 1}>Previous</button>
                    <button onClick={nextStep} disabled={step === 3}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default OnBoarding;
