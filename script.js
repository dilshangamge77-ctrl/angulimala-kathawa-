const scenes = [
    {
        title: "අහිංසකගේ ආරම්භය",
        speaker: "",
        text: "අහිංසක තරුණයා තම ගුරුතුමා වෙතින් ශිල්පය හදාරමින් සිටියි. ගුරුතුමා, අහිංසකගේ දක්ෂතාවයට වෛර කරමින් ඔහුව විනාශ කිරීමට 'මිනිස් ඇඟිලි දහසක්' ගුරු පඬුරු ලෙස ඉල්ලා සිටියි. මෙය අහිංසකගේ ජීවිතයේ හැරවුම් ලක්ෂයයි."
    },
    {
        title: "අංගුලිමාල බවට පත්වීම",
        speaker: "",
        text: "අහිංසක දැන් අංගුලිමාල ලෙස ප්‍රසිද්ධ වී ඇත. ඔහු තම මාලය සම්පූර්ණ කිරීමට මාර්ගයේ යන ඕනෑම අයෙකුව මරා ඇඟිලි ලබා ගනී. මිනිසුන් ඔහුට බියෙන් ගම්මාන අතහැර දමයි."
    },
    {
        title: "මවගේ මෛත්‍රිය",
        speaker: "",
        text: "අංගුලිමාල තම මාලයට අවශ්‍ය එකම ඇඟිල්ල ලබා ගැනීමට මව ද මරා දැමීමට සැරසෙයි. තමාගේ පුතා බව දැන දැනත් මව ඔහුට ආදරය කරන්නේ ඔහුගේ යහපත බලාපොරොත්තුවෙන් පමණි."
    },
    {
        title: "බුදු මුවින් දහම් ගැටය",
        speaker: "",
        text: "බුදුරජාණන් වහන්සේ අංගුලිමාලව මුණගැසේ. 'මම නැවතුනෙමි අංගුලිමාල, නුඹ නොනැවතෙන්නෙහිය' යන දේශනයෙන් අංගුලිමාලගේ සිත්හි තිබූ ආක්‍රමණශීලී බව සම්පූර්ණයෙන්ම සන්සුන් වේ."
    },
    {
        title: "දමනය හා සැනසීම",
        speaker: "",
        text: "තමා කළ පාපය වටහා ගන්නා අංගුලිමාල භික්ෂුවක් ලෙස පැවිදි වේ. ඔහු රහත් භාවයට පත්වී සාමය සොයාගනී. මේ සිදුවීමෙන් පෙන්නුම් කරන්නේ ඕනෑම පවක් කරුණාවෙන් ජය ගත හැකි බවයි."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const entranceScreen = document.getElementById("entrance-screen");
    const mainScreen = document.getElementById("main-screen");
    const audio = document.getElementById("bg-audio");
    
    const hotspots = document.querySelectorAll(".hotspot");
    const modal = document.getElementById("story-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const sceneTitle = document.getElementById("scene-title");
    const speakerName = document.getElementById("speaker-name");
    const dialogueText = document.getElementById("dialogue-text");

    let karaokeTimeouts = [];

    // Start Experience
    startBtn.addEventListener("click", () => {
        // Attempt to play audio
        audio.play().catch(e => console.log("Audio play failed or file missing", e));
        
        entranceScreen.classList.remove("active");
        setTimeout(() => {
            mainScreen.classList.add("active");
        }, 1500); // Wait for fade out
    });

    // Hotspot click handling
    hotspots.forEach(hotspot => {
        hotspot.addEventListener("click", () => {
            const sceneIndex = parseInt(hotspot.getAttribute("data-scene"));
            openModal(sceneIndex);
        });
    });

    // Close Modal
    closeModalBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Approximate percentages based on previous alignments
    // To get the EXACT ones, use the calibration clicker below!
    const scenePositions = [
        "-31%, -29%", // Scene 1
        "-50%, -17%", // Scene 2
        "-69%, -29%", // Scene 3
        "-26%, -53%", // Scene 4
        "-74%, -53%"  // Scene 5
    ];

    function openModal(index) {
        const scene = scenes[index];
        sceneTitle.textContent = scene.title;
        speakerName.textContent = scene.speaker;
        
        // Update visual image translation for perfect centering
        const modalImg = document.getElementById("modal-image");
        modalImg.style.transform = `translate(${scenePositions[index]})`;
        
        // Prepare Karaoke text
        const textParts = scene.text.split(/(\s+|\n+)/); // Split by whitespace or newlines keeping delimiters
        dialogueText.innerHTML = '';
        
        textParts.forEach(part => {
            if (part === '\n') {
                dialogueText.appendChild(document.createElement('br'));
            } else if (part.trim() === '') {
                dialogueText.appendChild(document.createTextNode(part));
            } else {
                const span = document.createElement("span");
                span.textContent = part;
                dialogueText.appendChild(span);
            }
        });

        modal.classList.remove("hidden");
        runKaraoke();
    }

    function closeModal() {
        modal.classList.add("hidden");
        // Clear timeouts to stop animation if closed early
        karaokeTimeouts.forEach(t => clearTimeout(t));
        karaokeTimeouts = [];
    }

    function runKaraoke() {
        const spans = dialogueText.querySelectorAll("span");
        karaokeTimeouts.forEach(t => clearTimeout(t));
        karaokeTimeouts = [];

        spans.forEach((span, i) => {
            const timeout = setTimeout(() => {
                span.classList.add("revealed");
            }, i * 200 + 500); // 500ms delay before starting, 200ms per word
            karaokeTimeouts.push(timeout);
        });
    }

    // --- FIREWORKS CANVAS ANIMATION ---
    const canvas = document.getElementById("fireworks-canvas");
    const ctx = canvas.getContext("2d");

    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
        const rect = mainScreen.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvasWidth = rect.width;
        canvasHeight = rect.height;
    }

    // Call resize on window changes
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 2 + 1.5;
            // Explosion velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.012 + 0.008;
            this.gravity = 0.05;
            this.friction = 0.97;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }
    }

    class Firework {
        constructor() {
            // Spawn in the right half of the screen (behind the right side of the Thorana)
            this.startX = canvasWidth * (0.6 + Math.random() * 0.3);
            this.x = this.startX;
            this.y = canvasHeight;
            // Target height in the upper half of screen
            this.targetY = canvasHeight * (0.15 + Math.random() * 0.35);
            // Launch speed
            this.speed = Math.random() * 3 + 8;
            this.angle = -Math.PI / 2 + (Math.random() * 0.16 - 0.08); // mostly straight up
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            
            // Vibrant colors matching Buddhist and neon Vesak themes
            const colors = ["#00e5ff", "#ff0055", "#ffd700", "#00ff66", "#ff6600", "#ffffff", "#d033ff"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.exploded = false;
            this.trail = [];
        }

        draw() {
            if (this.exploded) return;
            
            // Draw a trailing spark
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            if (this.trail.length > 0) {
                const prev = this.trail[0];
                ctx.lineTo(prev.x, prev.y);
            } else {
                ctx.lineTo(this.x - this.vx, this.y - this.vy);
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.stroke();
            ctx.restore();
        }

        update() {
            // Keep trail points
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 8) this.trail.shift();

            this.x += this.vx;
            this.y += this.vy;

            // Decelerate upwards
            this.vy += 0.04;

            // Explode if it slows down or exceeds height limit
            if (this.vy >= 0 || this.y <= this.targetY) {
                this.exploded = true;
            }
        }
    }

    const fireworks = [];
    const particles = [];

    function animateFireworks() {
        if (!mainScreen.classList.contains("active")) {
            requestAnimationFrame(animateFireworks);
            return;
        }

        // Fading tail backdrop
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Spawn a firework at regular intervals
        if (Math.random() < 0.015 && fireworks.length < 4) {
            fireworks.push(new Firework());
        }

        // Process active fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const f = fireworks[i];
            f.update();
            f.draw();

            if (f.exploded) {
                // Explode! Create a stunning circular burst
                const numParticles = Math.floor(Math.random() * 35) + 45;
                for (let j = 0; j < numParticles; j++) {
                    particles.push(new Particle(f.x, f.y, f.color));
                }
                fireworks.splice(i, 1);
            }
        }

        // Process burst particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateFireworks);
    }

    // Initialize fireworks dimensions and run loop
    resizeCanvas();
    animateFireworks();

    // --- TRADITIONAL VESAK LIGHT SEQUENCE SYSTEM (ලයිට් වැල් රටා) ---
    function createBulb(parent, x, y, className) {
        const bulb = document.createElement("div");
        bulb.className = `bulb ${className}`;
        bulb.style.left = `${x.toFixed(1)}%`;
        bulb.style.top = `${y.toFixed(1)}%`;
        parent.appendChild(bulb);
    }

    function createBorderLights() {
        const container = document.querySelector(".thorana-container");
        const numBulbsPerSide = 25; // 25 bulbs per side = 100 border bulbs in total
        
        // Top edge: left-to-right (y=0, x from 0 to 100)
        for (let i = 0; i < numBulbsPerSide; i++) {
            createBulb(container, (i / numBulbsPerSide) * 100, 0, "border-bulb");
        }
        // Right edge: top-to-bottom (x=100, y from 0 to 100)
        for (let i = 0; i < numBulbsPerSide; i++) {
            createBulb(container, 100, (i / numBulbsPerSide) * 100, "border-bulb");
        }
        // Bottom edge: right-to-left (y=100, x from 100 to 0)
        for (let i = numBulbsPerSide; i > 0; i--) {
            createBulb(container, (i / numBulbsPerSide) * 100, 100, "border-bulb");
        }
        // Left edge: bottom-to-top (x=0, y from 100 to 0)
        for (let i = numBulbsPerSide; i > 0; i--) {
            createBulb(container, 0, (i / numBulbsPerSide) * 100, "border-bulb");
        }
    }

    function createHotspotLights() {
        const hotspots = document.querySelectorAll(".hotspot");
        hotspots.forEach((hotspot) => {
            // Concentric Layer 1 (Outer): 16 bulbs, radius 50%
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                createBulb(hotspot, 50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle), "hotspot-bulb ring-outer");
            }
            // Concentric Layer 2 (Middle): 10 bulbs, radius 33%
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                createBulb(hotspot, 50 + 33 * Math.cos(angle), 50 + 33 * Math.sin(angle), "hotspot-bulb ring-middle");
            }
            // Concentric Layer 3 (Inner): 6 bulbs, radius 16%
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                createBulb(hotspot, 50 + 16 * Math.cos(angle), 50 + 16 * Math.sin(angle), "hotspot-bulb ring-inner");
            }
            // Concentric Layer 4 (Center): 1 bulb at 50% 50%
            createBulb(hotspot, 50, 50, "hotspot-bulb ring-center");
        });
    }

    // Spawn the traditional Vesak bulbs
    createBorderLights();
    createHotspotLights();

    const borderBulbs = document.querySelectorAll(".border-bulb");

    let lightTick = 0;
    let currentPattern = 0;

    // Switch patterns every 8 seconds
    setInterval(() => {
        currentPattern = (currentPattern + 1) % 5;
    }, 8000);

    // Traditional Vesak color palette
    const vesakColors = ["#00e5ff", "#ff0055", "#ffd700", "#00ff66", "#ff6600", "#ffffff"];

    function tickVesakLights() {
        lightTick++;

        switch (currentPattern) {
            case 0:
                // --- PATTERN 0: SPINNING WHEELS / CHAKRA (කරකැවෙන රෝද රටාව) ---
                // Border: flow in groups of 4 ON, 4 OFF
                borderBulbs.forEach((bulb, i) => {
                    const isActive = (i + lightTick) % 8 < 4;
                    bulb.style.opacity = isActive ? "1" : "0.15";
                    bulb.style.color = vesakColors[Math.floor((i + lightTick * 0.25) % vesakColors.length)];
                });
                
                // Hotspots: Concentric layers counter-rotate to create gorgeous mechanical wheels!
                hotspots.forEach((hotspot) => {
                    // Outer ring: spin clockwise (Cyan)
                    const outers = hotspot.querySelectorAll(".ring-outer");
                    outers.forEach((bulb, i) => {
                        const active = (i + lightTick) % 4 < 2;
                        bulb.style.opacity = active ? "1" : "0.15";
                        bulb.style.color = "#00e5ff";
                    });
                    // Middle ring: spin counter-clockwise (Gold)
                    const middles = hotspot.querySelectorAll(".ring-middle");
                    middles.forEach((bulb, i) => {
                        const active = (i - lightTick) % 4 < 2;
                        bulb.style.opacity = active ? "1" : "0.15";
                        bulb.style.color = "#ffd700";
                    });
                    // Inner ring: spin clockwise (Pink)
                    const inners = hotspot.querySelectorAll(".ring-inner");
                    inners.forEach((bulb, i) => {
                        const active = (i + lightTick) % 3 < 1;
                        bulb.style.opacity = active ? "1" : "0.15";
                        bulb.style.color = "#ff0055";
                    });
                    // Center bulb: steady glow (White)
                    const center = hotspot.querySelector(".ring-center");
                    if (center) {
                        center.style.opacity = "1";
                        center.style.color = "#ffffff";
                    }
                });
                break;

            case 1:
                // --- PATTERN 1: RADIATING STARBURST WAVES (විහිදෙන තරු රටා තරංග) ---
                // Border: alternating Red and Green flashing
                const borderState = Math.floor(lightTick / 3) % 2;
                borderBulbs.forEach((bulb, i) => {
                    const isEven = i % 2 === 0;
                    const isActive = isEven ? (borderState === 0) : (borderState === 1);
                    bulb.style.opacity = isActive ? "1" : "0.15";
                    bulb.style.color = isEven ? "#ff0055" : "#00ff66";
                });

                // Hotspots: Concentric waves expand outwards from the center! (Center -> Inner -> Middle -> Outer)
                const waveStage = Math.floor(lightTick / 2) % 4; // 4 stages of propagation
                hotspots.forEach((hotspot) => {
                    const outers = hotspot.querySelectorAll(".ring-outer");
                    outers.forEach(b => {
                        b.style.opacity = (waveStage === 3) ? "1" : "0.15";
                        b.style.color = "#ff0055"; // Pink outer blast
                    });

                    const middles = hotspot.querySelectorAll(".ring-middle");
                    middles.forEach(b => {
                        b.style.opacity = (waveStage === 2) ? "1" : "0.15";
                        b.style.color = "#ff6600"; // Saffron middle blast
                    });

                    const inners = hotspot.querySelectorAll(".ring-inner");
                    inners.forEach(b => {
                        b.style.opacity = (waveStage === 1) ? "1" : "0.15";
                        b.style.color = "#ffd700"; // Gold inner blast
                    });

                    const center = hotspot.querySelector(".ring-center");
                    if (center) {
                        center.style.opacity = (waveStage === 0) ? "1" : "0.15";
                        center.style.color = "#ffffff"; // White core
                    }
                });
                break;

            case 2:
                // --- PATTERN 2: BREATHING COLOR CYCLE (වැඩිවෙමින් අඩුවෙමින් යන වර්ණ තරංග) ---
                // Fades all lights in and out together like breathing, cycling colors slowly
                const intensity = (Math.sin(lightTick * 0.15) + 1) / 2; // 0.0 to 1.0
                const baseColor = vesakColors[Math.floor((lightTick * 0.05) % vesakColors.length)];

                borderBulbs.forEach((bulb) => {
                    bulb.style.opacity = intensity;
                    bulb.style.color = baseColor;
                });

                // Hotspots: Concentric rings display a gradient of colors that cycles inwards
                hotspots.forEach((hotspot) => {
                    const outers = hotspot.querySelectorAll(".ring-outer");
                    outers.forEach(b => {
                        b.style.opacity = intensity;
                        b.style.color = vesakColors[lightTick % 6];
                    });

                    const middles = hotspot.querySelectorAll(".ring-middle");
                    middles.forEach(b => {
                        b.style.opacity = intensity;
                        b.style.color = vesakColors[(lightTick + 1) % 6];
                    });

                    const inners = hotspot.querySelectorAll(".ring-inner");
                    inners.forEach(b => {
                        b.style.opacity = intensity;
                        b.style.color = vesakColors[(lightTick + 2) % 6];
                    });

                    const center = hotspot.querySelector(".ring-center");
                    if (center) {
                        center.style.opacity = intensity;
                        center.style.color = "#ffffff";
                    }
                });
                break;

            case 3:
                // --- PATTERN 3: VIBRANT RAINBOW WINDMILL (බහු-වර්ණ සුළං මෝල් රටාව) ---
                // Border: Mixed gliding rainbow stream
                const numColors = 4;
                const mixColors = ["#00e5ff", "#ff0055", "#ffd700", "#00ff66"];
                borderBulbs.forEach((bulb, i) => {
                    const colorIndex = (i + lightTick) % numColors;
                    bulb.style.opacity = "1";
                    bulb.style.color = mixColors[colorIndex];
                });

                // Hotspots: spinning wheels dividing colors into angle segments like a multi-color windmill!
                hotspots.forEach((hotspot) => {
                    const outers = hotspot.querySelectorAll(".ring-outer");
                    outers.forEach((b, i) => {
                        b.style.opacity = "1";
                        b.style.color = mixColors[(i + lightTick) % 4];
                    });

                    const middles = hotspot.querySelectorAll(".ring-middle");
                    middles.forEach((b, i) => {
                        b.style.opacity = "1";
                        b.style.color = mixColors[(i - lightTick) % 4]; // Spin opposite direction
                    });

                    const inners = hotspot.querySelectorAll(".ring-inner");
                    inners.forEach((b, i) => {
                        b.style.opacity = "1";
                        b.style.color = mixColors[(i + lightTick) % 4];
                    });

                    const center = hotspot.querySelector(".ring-center");
                    if (center) {
                        center.style.opacity = "1";
                        center.style.color = mixColors[Math.floor((lightTick * 0.2) % 4)];
                    }
                });
                break;

            case 4:
                // --- PATTERN 4: TARGET ALTERNATING FLASH / ZIG-ZAG (නිවිනිවී පත්තු වෙන ඉලක්කම් රටාව) ---
                // Border: Two pulses chase from top-left/right, meet at bottom, and bounce back
                const numBorder = borderBulbs.length;
                const pos1 = lightTick % numBorder;
                const pos2 = (numBorder - 1 - lightTick) % numBorder;

                borderBulbs.forEach((bulb, i) => {
                    const dist1 = Math.abs(i - pos1);
                    const dist2 = Math.abs(i - pos2);
                    const isNear = dist1 <= 2 || dist2 <= 2;
                    bulb.style.opacity = isNear ? "1" : "0.15";
                    bulb.style.color = isNear ? "#ff6600" : "#555555"; // Saffron chasers
                });

                // Hotspots: Concentric layers blink on and off in alternates! (Outer+Center ON while Middle+Inner OFF, and vice-versa)
                const flashState = Math.floor(lightTick / 3) % 2;
                hotspots.forEach((hotspot) => {
                    const outers = hotspot.querySelectorAll(".ring-outer");
                    outers.forEach(b => {
                        b.style.opacity = (flashState === 0) ? "1" : "0.1";
                        b.style.color = "#00e5ff"; // Cyan outer
                    });

                    const middles = hotspot.querySelectorAll(".ring-middle");
                    middles.forEach(b => {
                        b.style.opacity = (flashState === 1) ? "1" : "0.1";
                        b.style.color = "#ffd700"; // Gold middle
                    });

                    const inners = hotspot.querySelectorAll(".ring-inner");
                    inners.forEach(b => {
                        b.style.opacity = (flashState === 1) ? "1" : "0.1";
                        b.style.color = "#ff0055"; // Pink inner
                    });

                    const center = hotspot.querySelector(".ring-center");
                    if (center) {
                        center.style.opacity = (flashState === 0) ? "1" : "0.1";
                        center.style.color = "#ffffff"; // White core
                    }
                });
                break;
        }
    }

    // Trigger the Vesak light loop at 100ms interval
    setInterval(tickVesakLights, 100);

});
