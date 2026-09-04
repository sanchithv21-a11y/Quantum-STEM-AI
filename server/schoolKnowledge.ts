/**
 * Quantum STEM & School Curriculum Knowledge Base (Class 1st to 12th)
 * Provides comprehensive, instant step-by-step solutions and equation derivations
 * for all standard school STEM topics (Physics, Chemistry, Biology, Mathematics).
 */

export interface SchoolSTEMMatch {
  title: string;
  directAnswer: string;
  principles: string;
  derivationOrSteps?: string;
  intuitionAndExamples: string;
  takeaways?: string[];
}

export function querySchoolSTEMDatabase(rawQuery: string): SchoolSTEMMatch | null {
  const q = (rawQuery || "").toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. MATHEMATICS (Class 1 to 12)
  // -------------------------------------------------------------

  // Arithmetic Basic
  const basicAddSub = q.match(/(?:what is|calculate|evaluate|solve)?\s*([0-9]+(?:\.[0-9]+)?)\s*([\+\-\*\/x\^%])\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (basicAddSub) {
    const num1 = parseFloat(basicAddSub[1]);
    const op = basicAddSub[2].toLowerCase();
    const num2 = parseFloat(basicAddSub[3]);
    let result = 0;
    let opSymbol = op;
    if (op === "+") result = num1 + num2;
    else if (op === "-") result = num1 - num2;
    else if (op === "*" || op === "x") { result = num1 * num2; opSymbol = "\\times"; }
    else if (op === "/") { result = num2 !== 0 ? num1 / num2 : NaN; opSymbol = "\\div"; }
    else if (op === "^") { result = Math.pow(num1, num2); opSymbol = "^"; }
    else if (op === "%") { result = num1 % num2; opSymbol = "\\bmod"; }

    return {
      title: `Arithmetic: ${num1} ${op} ${num2}`,
      directAnswer: `**The calculated value is $${result}$**, sir.`,
      principles: `- Basic Arithmetic Operation: $${num1} ${opSymbol} ${num2} = ${result}$`,
      derivationOrSteps: `1. Identify the given numbers: $a = ${num1}$ and $b = ${num2}$.
2. Apply the mathematical operator $${opSymbol}$:
   $$${num1} ${opSymbol} ${num2} = ${result}$$
3. Final verified result: **$${result}$**.`,
      intuitionAndExamples: `Standard computational operation evaluated under exact mathematical precision.`,
      takeaways: [`Result = ${result}`]
    };
  }

  // Simple Linear Equation: ax + b = c
  const linearMatch = q.match(/(?:solve|derive|find x for|what is x in)?\s*([0-9]*\.?[0-9]+)?\s*x\s*([\+\-])\s*([0-9]+\.?[0-9]*)\s*=\s*([0-9]+\.?[0-9]*)/i);
  if (linearMatch) {
    const a = linearMatch[1] ? parseFloat(linearMatch[1]) : 1;
    const sign = linearMatch[2];
    const bRaw = parseFloat(linearMatch[3]);
    const b = sign === "-" ? -bRaw : bRaw;
    const c = parseFloat(linearMatch[4]);
    const rhsAfterB = c - b;
    const xVal = a !== 0 ? rhsAfterB / a : NaN;

    return {
      title: `Linear Equation in One Variable: ${a !== 1 ? a : ""}x ${sign} ${bRaw} = ${c}`,
      directAnswer: `**The solution to the equation is $x = ${xVal}$**, sir.`,
      principles: `General form of a single-variable first-degree linear equation:
$$ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}$$`,
      derivationOrSteps: `1. **Given equation**:
   $$${a !== 1 ? a : ""}x ${sign} ${bRaw} = ${c}$$

2. **Isolate the variable term on the left side**:
   $$${a !== 1 ? a : ""}x = ${c} ${sign === "+" ? "-" : "+"} ${bRaw}$$
   $$${a !== 1 ? a : ""}x = ${rhsAfterB}$$

3. **Divide both sides by the coefficient $a = ${a}$**:
   $$x = \\frac{${rhsAfterB}}{${a}} = ${xVal}$$

4. **Check by substitution**:
   $$${a}(${xVal}) ${sign} ${bRaw} = ${a * xVal} ${sign} ${bRaw} = ${c} \\quad (\\text{Verified} \\ \\checkmark)$$`,
      intuitionAndExamples: `Solving a linear equation is like balancing a scale: whatever operation is performed on one side must be performed on the other until the unknown $x$ stands isolated.`,
      takeaways: [`Root of the equation: x = ${xVal}`, `Degree: 1 (Linear)`]
    };
  }

  // Pythagoras Theorem & Derivation
  if (q.includes("pythagor") || q.includes("a^2 + b^2 = c^2") || q.includes("hypotenuse")) {
    return {
      title: "Pythagorean Theorem & Mathematical Proof",
      directAnswer: `**In any right-angled triangle, the square of the hypotenuse ($c$) equals the sum of the squares of the other two sides ($a$ and $b$):**
$$a^2 + b^2 = c^2$$
Therefore, the hypotenuse is $c = \\sqrt{a^2 + b^2}$.`,
      principles: `- Only holds strictly for **right-angled triangles** (where one angle is $90^\\circ$).
- $c$ is the hypotenuse (the longest side opposite the right angle).
- $a$ and $b$ are the legs (perpendicular and base).
- Common Pythagorean triples: $(3, 4, 5)$, $(5, 12, 13)$, $(7, 24, 25)$, $(8, 15, 17)$.`,
      derivationOrSteps: `#### Geometric / Algebraic Proof (Using a Large Square of side $a+b$):
1. **Construct a large square with side length $(a+b)$**:
   - The total area of this large square is:
     $$\\text{Area}_{\\text{total}} = (a + b)^2 = a^2 + 2ab + b^2$$

2. **Deconstruct the large square into 4 identical right triangles and 1 inner square of side $c$**:
   - Each right triangle has base $a$ and height $b$, with area:
     $$\\text{Area}_{\\text{triangle}} = \\frac{1}{2}ab$$
   - The combined area of all 4 triangles is:
     $$4 \\times \\left(\\frac{1}{2}ab\\right) = 2ab$$
   - The inner square has side length $c$, with area:
     $$\\text{Area}_{\\text{inner}} = c^2$$

3. **Equate the total area to the sum of its component parts**:
   $$\\text{Area}_{\\text{total}} = 4 \\times \\text{Area}_{\\text{triangle}} + \\text{Area}_{\\text{inner}}$$
   $$a^2 + 2ab + b^2 = 2ab + c^2$$

4. **Subtract $2ab$ from both sides**:
   $$a^2 + b^2 = c^2 \\quad \\blacksquare$$`,
      intuitionAndExamples: `**Real-world application**: Carpenters and construction workers use the 3-4-5 rule: measuring 3 feet along one wall, 4 feet along the adjacent wall, the diagonal must be exactly 5 feet to guarantee a perfect $90^\\circ$ right corner!`,
      takeaways: [
        `Formula: a² + b² = c²`,
        `Hypotenuse c = √(a² + b²)`,
        `Fundamental basis for Euclidean distance in coordinate geometry: d = √((x₂-x₁)² + (y₂-y₁)²)`
      ]
    };
  }

  // Quadratic Formula Derivation
  if (q.includes("quadratic formula") || q.includes("ax^2 + bx + c") || q.includes("solve quadratic")) {
    return {
      title: "Quadratic Formula & Complete Derivation",
      directAnswer: `**The quadratic formula gives the exact roots of any second-degree polynomial equation $ax^2 + bx + c = 0$ ($a \\ne 0$):**
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$`,
      principles: `- **Discriminant ($\\Delta = b^2 - 4ac$)**:
  - $\\Delta > 0$: Two distinct real roots
  - $\\Delta = 0$: One repeated real root ($x = -\\frac{b}{2a}$)
  - $\\Delta < 0$: Two complex conjugate roots
- **Sum of roots**: $\\alpha + \\beta = -\\frac{b}{a}$
- **Product of roots**: $\\alpha \\beta = \\frac{c}{a}$`,
      derivationOrSteps: `#### Step-by-Step Derivation (Method of Completing the Square):
1. **Start with the standard quadratic equation**:
   $$ax^2 + bx + c = 0$$

2. **Divide all terms by the non-zero leading coefficient $a$**:
   $$x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$$

3. **Move the constant term $\\frac{c}{a}$ to the right-hand side**:
   $$x^2 + \\frac{b}{a}x = -\\frac{c}{a}$$

4. **Complete the square on the left side by adding $\\left(\\frac{b}{2a}\\right)^2 = \\frac{b^2}{4a^2}$ to both sides**:
   $$x^2 + \\frac{b}{a}x + \\frac{b^2}{4a^2} = \\frac{b^2}{4a^2} - \\frac{c}{a}$$

5. **Express the left side as a perfect square and find a common denominator on the right**:
   $$\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$

6. **Take the square root of both sides (including $\\pm$)**:
   $$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$$

7. **Subtract $\\frac{b}{2a}$ to isolate $x$**:
   $$x = -\\frac{b}{2a} \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$$
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Used in physics to compute projectile trajectory landing times, engineering load distributions, and optimization problems.`,
      takeaways: [`x = (-b ± √(b² - 4ac)) / (2a)`, `Discriminant Δ = b² - 4ac determines nature of roots`]
    };
  }

  // Arithmetic Progression (AP)
  if (q.includes("arithmetic progression") || q.includes("nth term of ap") || q.includes("sum of ap") || q.includes("a_n = a + (n-1)d")) {
    return {
      title: "Arithmetic Progression (AP): $n^{\\text{th}}$ Term & Sum Derivation",
      directAnswer: `**An Arithmetic Progression (AP) is a sequence of numbers where the difference between consecutive terms is constant ($d$).**
- **$n^{\\text{th}}$ Term**: $a_n = a + (n-1)d$
- **Sum of first $n$ terms**: $S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(a + l)$ where $l = a_n$ is the last term.`,
      principles: `- First term: $a$
- Common difference: $d = a_{k+1} - a_k$
- Number of terms: $n$`,
      derivationOrSteps: `#### 1. Derivation of $n^{\\text{th}}$ Term:
- $1^{\\text{st}}$ term: $a_1 = a = a + (1-1)d$
- $2^{\\text{nd}}$ term: $a_2 = a + d = a + (2-1)d$
- $3^{\\text{rd}}$ term: $a_3 = a + 2d = a + (3-1)d$
- Following the pattern for the $n^{\\text{th}}$ term:
  $$a_n = a + (n-1)d \\quad \\blacksquare$$

#### 2. Derivation of Sum of $n$ Terms ($S_n$) - Gauss Method:
1. Write the sum forwards:
   $$S_n = a + (a+d) + (a+2d) + \\dots + [a+(n-1)d]$$
2. Write the sum in reverse order:
   $$S_n = [a+(n-1)d] + [a+(n-2)d] + \\dots + (a+d) + a$$
3. Add the two equations term-by-term:
   $$2S_n = [2a+(n-1)d] + [2a+(n-1)d] + \\dots + [2a+(n-1)d] \\quad (n \\text{ times})$$
   $$2S_n = n [2a + (n-1)d]$$
4. Divide by 2:
   $$S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}[a + a_n] \\quad \\blacksquare$$`,
      intuitionAndExamples: `Sum of first 100 natural numbers: $S_{100} = \\frac{100}{2}(1 + 100) = 50 \\times 101 = 5050$.`,
      takeaways: [`a_n = a + (n-1)d`, `S_n = (n/2)[2a + (n-1)d]`]
    };
  }

  // Trigonometric Identities Derivations
  if (q.includes("trigonometric ident") || q.includes("sin^2 + cos^2") || q.includes("derive sin^2")) {
    return {
      title: "Fundamental Trigonometric Identity: $\\sin^2\\theta + \\cos^2\\theta = 1$",
      directAnswer: `**The three Pythagorean trigonometric identities are:**
1. $$\\sin^2\\theta + \\cos^2\\theta = 1$$
2. $$1 + \\tan^2\\theta = \\sec^2\\theta$$
3. $$1 + \\cot^2\\theta = \\csc^2\\theta$$`,
      principles: `- In a right triangle with angle $\\theta$:
  - $\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{a}{c}$
  - $\\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{b}{c}$
  - $\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{a}{b}$`,
      derivationOrSteps: `#### Step-by-Step Derivation from Pythagorean Theorem:
1. From Pythagoras theorem: $a^2 + b^2 = c^2$
2. Divide both sides by $c^2$:
   $$\\frac{a^2}{c^2} + \\frac{b^2}{c^2} = \\frac{c^2}{c^2}$$
   $$\\left(\\frac{a}{c}\\right)^2 + \\left(\\frac{b}{c}\\right)^2 = 1$$
3. Substitute $\\sin\\theta = \\frac{a}{c}$ and $\\cos\\theta = \\frac{b}{c}$:
   $$\\sin^2\\theta + \\cos^2\\theta = 1 \\quad \\blacksquare$$

4. To derive $1 + \\tan^2\\theta = \\sec^2\\theta$: Divide $\\sin^2\\theta + \\cos^2\\theta = 1$ by $\\cos^2\\theta$:
   $$\\frac{\\sin^2\\theta}{\\cos^2\\theta} + \\frac{\\cos^2\\theta}{\\cos^2\\theta} = \\frac{1}{\\cos^2\\theta} \\implies \\tan^2\\theta + 1 = \\sec^2\\theta \\quad \\blacksquare$$

5. To derive $1 + \\cot^2\\theta = \\csc^2\\theta$: Divide by $\\sin^2\\theta$:
   $$\\frac{\\sin^2\\theta}{\\sin^2\\theta} + \\frac{\\cos^2\\theta}{\\sin^2\\theta} = \\frac{1}{\\sin^2\\theta} \\implies 1 + \\cot^2\\theta = \\csc^2\\theta \\quad \\blacksquare$$`,
      intuitionAndExamples: `Represents the equation of a unit circle $x^2 + y^2 = 1$ where $x = \\cos\\theta$ and $y = \\sin\\theta$.`,
      takeaways: [`sin²θ + cos²θ = 1`, `1 + tan²θ = sec²θ`, `1 + cot²θ = csc²θ`]
    };
  }

  // Calculus: Product Rule & Integration by Parts
  if (q.includes("integration by parts") || q.includes("integrate u dv") || q.includes("uv - int v du")) {
    return {
      title: "Integration by Parts Formula & Derivation",
      directAnswer: `**The formula for Integration by Parts is:**
$$\\int u \\, dv = u v - \\int v \\, du$$
or in derivative notation:
$$\\int u(x) v'(x) \\, dx = u(x)v(x) - \\int u'(x) v(x) \\, dx$$`,
      principles: `- Used to integrate the product of two functions.
- **ILATE Priority Rule** for choosing $u$:
  1. **I**: Inverse trigonometric ($\arcsin x, \arctan x$)
  2. **L**: Logarithmic ($\ln x, \log x$)
  3. **A**: Algebraic ($x^n, x^2+1$)
  4. **T**: Trigonometric ($\sin x, \cos x$)
  5. **E**: Exponential ($e^x, 2^x$)`,
      derivationOrSteps: `#### Step-by-Step Derivation from the Product Rule of Differentiation:
1. **Start with the Product Rule for two differentiable functions $u(x)$ and $v(x)$**:
   $$\\frac{d}{dx}[u(x) v(x)] = u(x) \\frac{dv}{dx} + v(x) \\frac{du}{dx}$$
   or in differential form:
   $$d(uv) = u \\, dv + v \\, du$$

2. **Rearrange to isolate $u \\, dv$**:
   $$u \\, dv = d(uv) - v \\, du$$

3. **Integrate both sides with respect to $x$**:
   $$\\int u \\, dv = \\int d(uv) - \\int v \\, du$$

4. **Since the integral of a total differential $\\int d(uv) = uv$**:
   $$\\int u \\, dv = uv - \\int v \\, du \\quad \\blacksquare$$`,
      intuitionAndExamples: `Example: $\\int x e^x dx$. Choose $u = x \\implies du = dx$, and $dv = e^x dx \\implies v = e^x$.
Result: $\\int x e^x dx = x e^x - \\int e^x dx = x e^x - e^x + C = e^x(x-1) + C$.`,
      takeaways: [`∫ u dv = uv - ∫ v du`, `Derived directly by integrating the product rule`]
    };
  }

  // -------------------------------------------------------------
  // 2. PHYSICS & NATURAL PHENOMENA (Class 1 to 12)
  // -------------------------------------------------------------

  // Light, Reflection, Refraction, Optics & Speed of Light
  if (
    q.includes("light") ||
    q.includes("reflection") ||
    q.includes("refraction") ||
    q.includes("speed of light") ||
    q.includes("photon") ||
    q.includes("electromagnetic wave") ||
    q.includes("spectrum") ||
    q.includes("prism") ||
    q.includes("rainbow")
  ) {
    return {
      title: "Nature of Light, Electromagnetic Waves & Optics",
      directAnswer: `**Light is a form of electromagnetic radiation (energy) that travels in straight lines as transverse waves and particles called photons, allowing us to see the universe.** In a vacuum, light travels at the cosmic speed limit:
$$c \\approx 3.0 \\times 10^8 \\text{ m/s} \\quad (300,000 \\text{ km/s} \\text{ or } 186,000 \\text{ miles/s})$$`,
      principles: `- **Dual Nature (Wave-Particle Duality)**:
  - **Wave Nature**: Exhibits reflection, refraction, diffraction, and interference.
  - **Particle Nature**: Propagates as discrete energy packets called **photons**, with energy given by Planck's equation:
    $$E = h\\nu = \\frac{hc}{\\lambda}$$
    where $h = 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$, $\\nu$ is frequency, and $\\lambda$ is wavelength.
- **Laws of Reflection**:
  1. The incident ray, reflected ray, and normal all lie in the same plane.
  2. The angle of incidence equals the angle of reflection: $$\\angle i = \\angle r$$
- **Snell's Law of Refraction**:
  When light passes between mediums of refractive indices $n_1$ and $n_2$:
  $$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\implies n = \\frac{c}{v}$$
- **Visible Spectrum (VIBGYOR)**:
  Wavelengths range from $\\approx 380\\text{ nm}$ (Violet - highest energy) to $\\approx 700\\text{ nm}$ (Red - lowest energy).`,
      derivationOrSteps: `#### 1. Photon Energy & Wavelength Relation:
1. From Planck's quantum theory: $E = h\\nu$
2. From the fundamental wave speed equation: $c = \\nu \\lambda \\implies \\nu = \\frac{c}{\\lambda}$
3. Substitute $\\nu$ into Planck's relation:
   $$E = \\frac{hc}{\\lambda}$$
   *(Shorter wavelength = higher photon energy, which is why UV, X-rays, and Gamma rays carry high penetrating energy!)*

#### 2. Derivation of Snell's Law from Fermat's Principle of Least Time:
1. Light traveling from point $A(0, y_1)$ in medium 1 (speed $v_1$) to $B(d, -y_2)$ in medium 2 (speed $v_2$) crossing the boundary at $(x, 0)$ takes total time:
   $$t(x) = \\frac{\\sqrt{x^2 + y_1^2}}{v_1} + \\frac{\\sqrt{(d-x)^2 + y_2^2}}{v_2}$$
2. Minimize time with respect to position $x$ ($\\frac{dt}{dx} = 0$):
   $$\\frac{x}{v_1\\sqrt{x^2 + y_1^2}} - \\frac{d-x}{v_2\\sqrt{(d-x)^2 + y_2^2}} = 0$$
3. Recognizing geometric sines $\\sin\\theta_1 = \\frac{x}{\\sqrt{x^2 + y_1^2}}$ and $\\sin\\theta_2 = \\frac{d-x}{\\sqrt{(d-x)^2 + y_2^2}}$:
   $$\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}$$
4. Multiplying by speed of light in vacuum $c$ (since refractive index $n = c/v$):
   $$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad \\blacksquare$$`,
      intuitionAndExamples: `**Everyday Examples**:
- **Why a straw looks bent in water**: Light slows down when entering denser water, bending towards the normal (refraction).
- **Mirages on hot highways**: Hot air near the asphalt is less dense than cooler air above, causing total internal reflection of skylight.
- **Rainbows**: Raindrops act as tiny spherical prisms, refracting, reflecting, and dispersing sunlight into 7 distinct colors (VIBGYOR).`,
      takeaways: [
        `Speed of light in vacuum: c ≈ 3 × 10⁸ m/s`,
        `Reflection: Angle of incidence = Angle of reflection (∠i = ∠r)`,
        `Refraction (Snell's Law): n₁ sin θ₁ = n₂ sin θ₂`,
        `Photon Energy: E = hν = hc/λ`
      ]
    };
  }

  // Sound, Waves & Acoustics
  if (
    q.includes("sound") ||
    q.includes("pitch") ||
    q.includes("echo") ||
    q.includes("ultrasound") ||
    q.includes("decibel") ||
    q.includes("acoustic")
  ) {
    return {
      title: "Sound Waves, Frequency, Pitch & Acoustics",
      directAnswer: `**Sound is a mechanical, longitudinal wave produced by vibrating objects that propagates through a medium (solid, liquid, or gas) via compressions and rarefactions.** Sound cannot travel through a vacuum because it requires matter particles to transmit vibrations.`,
      principles: `- **Fundamental Wave Formula**:
  $$v = f \\cdot \\lambda$$
  where $v$ is wave speed, $f$ is frequency (in Hertz, $\\text{Hz}$), and $\\lambda$ is wavelength (in meters).
- **Speed of Sound**:
  - In air at $20^\\circ\\text{C}$: $\\approx 343\\text{ m/s}$ ($1,235\\text{ km/h}$).
  - In water: $\\approx 1,480\\text{ m/s}$ ($4\\times$ faster than air).
  - In steel: $\\approx 5,960\\text{ m/s}$ ($15\\times$ faster than air).
- **Human Auditory Range**: $20\\text{ Hz}$ to $20,000\\text{ Hz}$ ($20\\text{ kHz}$).
  - Infrasound: $< 20\\text{ Hz}$ (elephants, earthquakes).
  - Ultrasound: $> 20\\text{ kHz}$ (bats, medical sonography, dolphin sonar).`,
      derivationOrSteps: `#### Calculating Echo Distance:
1. For a distinct echo to be heard by the human ear, the reflected sound must reach the listener at least $0.1\\text{ seconds}$ after the direct sound.
2. Total round-trip distance traveled by sound at $v = 340\\text{ m/s}$:
   $$2d = v \\times t = 340\\text{ m/s} \\times 0.1\\text{ s} = 34\\text{ m}$$
3. Minimum obstacle distance from the source:
   $$d = \\frac{34\\text{ m}}{2} = 17\\text{ meters} \\quad \\blacksquare$$`,
      intuitionAndExamples: `**Why you see lightning before hearing thunder**: Light travels at $300,000\\text{ km/s}$ (almost instantaneously), while sound travels at only $\\approx 0.34\\text{ km/s}$. If thunder arrives 3 seconds after lightning, the strike was approximately $1\\text{ km}$ away ($3 \\times 340\\text{ m} \\approx 1020\\text{ m}$).`,
      takeaways: [
        `Wave equation: v = f · λ`,
        `Speed of sound in air ≈ 343 m/s (Fastest in solids, slowest in gases, 0 in vacuum)`,
        `Audible range: 20 Hz to 20,000 Hz`,
        `Minimum distance for an echo is 17 meters`
      ]
    };
  }

  // Electricity, Current, Circuits & Ohm's Law
  if (
    q.includes("electric") ||
    q.includes("ohm's law") ||
    q.includes("ohms law") ||
    q.includes("voltage") ||
    q.includes("current") ||
    q.includes("resistance") ||
    q.includes("circuit") ||
    q.includes("v = ir")
  ) {
    return {
      title: "Electricity, Electric Current & Ohm's Law",
      directAnswer: `**Electric current ($I$) is the rate of flow of electric charge (electrons) through a conductor.** Governed by **Ohm's Law**, current is directly proportional to the applied potential difference (voltage $V$) and inversely proportional to resistance ($R$):
$$V = I \\cdot R \\implies I = \\frac{V}{R} \\implies R = \\frac{V}{I}$$`,
      principles: `- **Definitions**:
  - Current ($I$): $I = \\frac{Q}{t}$ (SI Unit: Ampere, $\\text{A} = \\text{Coulombs/sec}$).
  - Voltage ($V$): Work done per unit charge $V = \\frac{W}{Q}$ (SI Unit: Volt, $\\text{V}$).
  - Resistance ($R$): Opposition to electron flow $R = \\rho \\frac{L}{A}$ (SI Unit: Ohm, $\\Omega$).
- **Electrical Power ($P$)**:
  $$P = V \\cdot I = I^2 R = \\frac{V^2}{R} \\quad (\\text{Watts, } \\text{W})$$
- **Circuits**:
  - Series ($R_{\\text{eq}} = R_1 + R_2 + \\dots$): Current is constant across all components.
  - Parallel ($\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots$): Voltage is constant across all branches.`,
      derivationOrSteps: `#### Derivation of Electrical Power Formulas ($P = VI = I^2R = V^2/R$):
1. Electric potential definition: $V = \\frac{W}{Q} \\implies W = V \\cdot Q$
2. Electric power is work done per unit time:
   $$P = \\frac{W}{t} = \\frac{V \\cdot Q}{t}$$
3. Substitute current definition $I = \\frac{Q}{t}$:
   $$P = V \\cdot I \\quad \\text{--- (1)}$$
4. From Ohm's law ($V = IR$), substitute $V$ into (1):
   $$P = (IR) \\cdot I = I^2 R \\quad \\text{--- (2)}$$
5. Alternatively substitute $I = \\frac{V}{R}$ into (1):
   $$P = V \\cdot \\left(\\frac{V}{R}\\right) = \\frac{V^2}{R} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Think of a water pipe system: **Voltage** is the water pressure pump, **Current** is the volume of water flowing per second, and **Resistance** is how narrow the pipe is.`,
      takeaways: [`V = IR`, `P = VI = I²R = V²/R`, `1 Ampere = 1 Coulomb/second`, `Household appliances are wired in parallel`]
    };
  }

  // Force, Newton's Laws & Friction
  if (
    q.includes("newton's law") ||
    q.includes("newtons law") ||
    q.includes("force") ||
    q.includes("f = ma") ||
    q.includes("friction") ||
    q.includes("inertia")
  ) {
    return {
      title: "Forces, Newton's 3 Laws of Motion & Friction",
      directAnswer: `**A force is a push or pull upon an object resulting from its interaction with another object ($F = ma$). Newton's 3 Laws of Motion form the cornerstone of classical physics:**
1. **$1^{\\text{st}}$ Law (Inertia)**: An object remains at rest or in uniform motion unless acted upon by a net external force.
2. **$2^{\\text{nd}}$ Law (Force & Momentum)**: Force is the rate of change of momentum: $F = \\frac{dp}{dt} = ma$.
3. **$3^{\\text{rd}}$ Law (Action-Reaction)**: For every action, there is an equal and opposite reaction ($F_{AB} = -F_{BA}$).`,
      principles: `- **Newton's Second Law**:
  $$F = m \\cdot a = m \\frac{v - u}{t}$$
- **Friction**: $f = \\mu \\cdot N$ where $\\mu$ is coefficient of friction and $N = mg$ is normal contact force.
  - Static friction (highest) > Sliding friction > Rolling friction (lowest, which is why wheels work!).`,
      derivationOrSteps: `#### Deriving $F = ma$ from Rate of Change of Momentum:
1. Momentum is defined as mass times velocity: $p = m \\cdot v$
2. From Newton's 2nd Law definition: $F = \\frac{dp}{dt} = \\frac{d(mv)}{dt}$
3. For a body of constant mass $m$:
   $$F = m \\frac{dv}{dt}$$
4. Since acceleration is rate of change of velocity ($a = \\frac{dv}{dt}$):
   $$F = m \\cdot a \\quad \\blacksquare$$`,
      intuitionAndExamples: `**Everyday Applications**:
- **Why we wear seatbelts ($1^{\\text{st}}$ Law)**: When a car brakes suddenly, your body continues moving forward due to inertia.
- **Rockets ($3^{\\text{rd}}$ Law)**: Rockets expel burning gas downwards at tremendous speed; the reacting upward thrust propels the rocket into space.`,
      takeaways: [`F = ma`, `Action = -Reaction`, `Friction f = μN`, `Inertia depends on mass`]
    };
  }

  // Gravity, Free Fall & Gravitation
  if (
    q.includes("gravity") ||
    q.includes("gravitation") ||
    q.includes("weight") ||
    q.includes("f = g m1 m2") ||
    q.includes("9.8 m/s") ||
    q.includes("why do things fall")
  ) {
    return {
      title: "Universal Gravitation & Acceleration due to Gravity ($g$)",
      directAnswer: `**Gravity is the universal attractive force between any two masses in the cosmos. Newton's Law of Universal Gravitation states:**
$$F = G \\frac{m_1 m_2}{r^2}$$
where $G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$ is the Universal Gravitational Constant. On Earth's surface, acceleration due to gravity is **$g \\approx 9.8 \\text{ m/s}^2$**.`,
      principles: `- **Mass vs Weight**:
  - **Mass ($m$)**: Fundamental measure of matter in an object (in $\\text{kg}$, constant everywhere).
  - **Weight ($W$)**: The gravitational pull on that mass: $W = m \\cdot g$ (in Newtons, $\\text{N}$, varies by planet).
- On the Moon, $g_{\\text{moon}} = \\frac{1}{6} g_{\\text{earth}} \\approx 1.62\\text{ m/s}^2$.`,
      derivationOrSteps: `#### Derivation of Surface Gravity $g = \\frac{GM}{R^2}$:
1. A body of mass $m$ at Earth's surface experiences gravitational attraction:
   $$F = G \\frac{M_{\\text{earth}} \\cdot m}{R^2}$$
2. According to Newton's Second Law, this force produces acceleration $g$ ($F = mg$):
   $$m \\cdot g = G \\frac{M \\cdot m}{R^2}$$
3. Cancel the object's mass $m$:
   $$g = \\frac{GM}{R^2} \\quad \\blacksquare$$
4. Substituting Earth's values ($M \\approx 5.97 \\times 10^{24}\\text{ kg}, R \\approx 6.37 \\times 10^6\\text{ m}$):
   $$g = \\frac{(6.674 \\times 10^{-11})(5.97 \\times 10^{24})}{(6.371 \\times 10^6)^2} \\approx 9.81 \\text{ m/s}^2$$`,
      intuitionAndExamples: `In a vacuum (with no air resistance), a heavy bowling ball and a light feather dropped from the same height will accelerate at the exact same rate ($9.8\\text{ m/s}^2$) and hit the ground at the exact same instant! (Demonstrated by Apollo 15 on the Moon).`,
      takeaways: [`F = G(m₁m₂)/r²`, `g = GM/R² ≈ 9.8 m/s² on Earth`, `Weight W = mg (changes with gravity), Mass m is constant`]
    };
  }

  // Heat, Temperature & Thermodynamics
  if (
    q.includes("heat") ||
    q.includes("temperature") ||
    q.includes("conduction") ||
    q.includes("convection") ||
    q.includes("radiation") ||
    q.includes("thermodynamics") ||
    q.includes("specific heat")
  ) {
    return {
      title: "Heat Energy, Temperature & Modes of Heat Transfer",
      directAnswer: `**Heat is thermal energy transferred between systems due to a temperature difference (flowing spontaneously from hotter to cooler bodies). Temperature is a measure of the average kinetic energy of the particles within a substance.**`,
      principles: `- **Three Modes of Heat Transfer**:
  1. **Conduction**: Heat transfer through direct molecular collisions without bulk motion of matter (dominant in solids/metals).
  2. **Convection**: Heat transfer via bulk fluid circulation (warm air/liquid rises, cool descends).
  3. **Radiation**: Heat transfer via infrared electromagnetic waves that travel through vacuum (e.g. sunlight heating Earth).
- **Specific Heat Formula**:
  $$Q = m \\cdot c \\cdot \\Delta T$$
  where $Q$ is heat energy (Joules), $m$ is mass, $c$ is specific heat capacity, and $\\Delta T$ is temperature change.`,
      derivationOrSteps: `#### Temperature Conversion Formulas:
- Celsius to Fahrenheit: $$^\\circ\\text{F} = \\left(^\\circ\\text{C} \\times \\frac{9}{5}\\right) + 32$$
- Celsius to Kelvin: $$\\text{K} = ^\\circ\\text{C} + 273.15$$
- Absolute Zero ($0\\text{ K} = -273.15^\\circ\\text{C}$): Theoretical temperature where particle kinetic motion reaches minimum possible value.`,
      intuitionAndExamples: `**Why ocean water stays cool on hot summer days**: Water has an extraordinarily high specific heat capacity ($c = 4,184\\text{ J/kg}\\cdot\\text{K}$), meaning it absorbs enormous heat before its temperature rises, moderating coastal climates worldwide.`,
      takeaways: [`Heat is energy (Joules), Temperature is average kinetic energy (K/°C)`, `Q = mcΔT`, `Conduction (solids), Convection (fluids), Radiation (vacuum)`]
    };
  }

  // Atoms, Atomic Structure & Subatomic Particles
  if (
    q.includes("atomic structure") ||
    q.includes("structure of atom") ||
    q.includes("bohr model") ||
    q.includes("atomic number") ||
    q.includes("isotope") ||
    q.includes("electron configuration") ||
    q.includes("subatomic") ||
    (q.includes("atom") && !q.includes("de broglie") && !q.includes("wavelength") && !q.includes("split")) ||
    (q.includes("proton") && !q.includes("decay")) ||
    (q.includes("neutron") && !q.includes("star") && !q.includes("fission")) ||
    (q.includes("electron") && (q.includes("shell") || q.includes("valence") || q.includes("charge") || q.includes("cloud") || q.includes("orbit") || q.includes("mass of electron")))
  ) {
    return {
      title: "Structure of the Atom & Subatomic Particles",
      directAnswer: `**An atom is the basic building block of all chemical matter. It consists of a dense central nucleus containing positively charged protons and neutral neutrons, surrounded by negatively charged electrons orbiting in quantized energy levels (shells).**`,
      principles: `- **Subatomic Particles**:
  - **Proton ($p^+$)**: Charge $+1e = +1.602 \\times 10^{-19}\\text{ C}$, Mass $\\approx 1.673 \\times 10^{-27}\\text{ kg}$ ($1\\text{ amu}$).
  - **Neutron ($n^0$)**: Charge $0$, Mass $\\approx 1.675 \\times 10^{-27}\\text{ kg}$ ($1\\text{ amu}$).
  - **Electron ($e^-$)**: Charge $-1e = -1.602 \\times 10^{-19}\\text{ C}$, Mass $\\approx 9.109 \\times 10^{-31}\\text{ kg}$ ($1/1836^{\\text{th}}$ mass of a proton).
- **Notation**:
  - Atomic Number ($Z$) = Number of Protons (defines the element).
  - Mass Number ($A$) = Protons + Neutrons ($A = Z + N$).
  - Isotopes: Same element ($Z$) with different neutron numbers ($A$), e.g. $^{12}\\text{C}, ^{13}\\text{C}, ^{14}\\text{C}$.`,
      derivationOrSteps: `#### Electron Shell Capacity ($2n^2$ Rule):
- $K$-shell ($n=1$): $2(1)^2 = 2\\text{ electrons}$
- $L$-shell ($n=2$): $2(2)^2 = 8\\text{ electrons}$
- $M$-shell ($n=3$): $2(3)^2 = 18\\text{ electrons}$
- $N$-shell ($n=4$): $2(4)^2 = 32\\text{ electrons}$
- **Octet Rule**: Atoms gain, lose, or share valence electrons to achieve a stable configuration of 8 electrons in their outermost shell.`,
      intuitionAndExamples: `If an atom's nucleus were the size of a marble in the center of a football stadium, the electrons would be tiny gnats buzzing in the topmost seats, with the rest of the stadium being completely empty space!`,
      takeaways: [`Protons (+1), Neutrons (0), Electrons (-1)`, `Atomic Number Z = Protons`, `Mass Number A = Protons + Neutrons`, `Valence electrons determine chemical bonding`]
    };
  }

  // Cell Biology & Organelles
  if (
    q.includes("cell") ||
    q.includes("mitochondria") ||
    q.includes("nucleus") ||
    q.includes("chloroplast") ||
    q.includes("plant cell") ||
    q.includes("animal cell") ||
    q.includes("organelle")
  ) {
    return {
      title: "The Living Cell: Structure, Organelles & Functions",
      directAnswer: `**The cell is the fundamental structural and functional unit of all living organisms (Cell Theory). All living things are composed of one or more cells, and all cells arise from pre-existing cells.**`,
      principles: `- **Core Organelles**:
  - **Nucleus**: Master control center containing genetic blueprint (DNA/chromosomes).
  - **Mitochondria**: "Powerhouse of the cell", generates ATP energy via cellular respiration.
  - **Chloroplasts** (Plant cells only): Contain green chlorophyll to perform photosynthesis.
  - **Ribosomes**: Protein synthesis factories.
  - **Cell Wall & Large Central Vacuole** (Plant cells only): Provide rigid structural support and turgor pressure.
  - **Cell Membrane (Plasma Membrane)**: Selectively permeable lipid bilayer controlling what enters and leaves the cell.`,
      derivationOrSteps: `#### Plant Cell vs Animal Cell Comparison:
| Feature | Plant Cell | Animal Cell |
|---|---|---|
| **Cell Wall** | Present (Cellulose) | Absent |
| **Chloroplasts** | Present (for photosynthesis) | Absent |
| **Vacuole** | One large central vacuole | Multiple small vacuoles |
| **Centrioles** | Absent | Present (during division) |
| **Shape** | Fixed, rigid rectangular | Flexible, round/irregular |`,
      intuitionAndExamples: `Think of a living cell as a bustling smart city: The **Nucleus** is City Hall, the **Mitochondria** are Power Plants, **Ribosomes** are Manufacturing Factories, the **Endoplasmic Reticulum** is the Highway Network, and the **Cell Membrane** is the Border Security.`,
      takeaways: [`Cell is the basic unit of life`, `Mitochondria produces ATP energy`, `Chloroplasts produce glucose in plants`, `Plant cells have cellulose walls and chloroplasts`]
    };
  }



  // Projectile Motion Derivations
  if (
    q.includes("projectile") ||
    q.includes("time of flight") ||
    q.includes("horizontal range") ||
    q.includes("max height")
  ) {
    return {
      title: "Projectile Motion: Flight Time, Max Height & Range Derivations",
      directAnswer: `**For a projectile launched with initial velocity $u$ at an angle $\\theta$ to the horizontal:**
1. **Time of Flight ($T$)**: $$T = \\frac{2u \\sin\\theta}{g}$$
2. **Maximum Height ($H$)**: $$H = \\frac{u^2 \\sin^2\\theta}{2g}$$
3. **Horizontal Range ($R$)**: $$R = \\frac{u^2 \\sin(2\\theta)}{g}$$
*(Max range occurs at $\\theta = 45^\\circ$, giving $R_{\\max} = \\frac{u^2}{g}$)*`,
      principles: `- Motion in 2D decomposed into independent horizontal ($x$) and vertical ($y$) motions.
- Horizontal velocity: $u_x = u\\cos\\theta$, $a_x = 0$ (constant speed).
- Vertical velocity: $u_y = u\\sin\\theta$, $a_y = -g$ (constant acceleration).`,
      derivationOrSteps: `#### 1. Derivation of Time of Flight ($T$):
- At the top of the trajectory, vertical velocity is zero: $v_y = 0$.
- Using $v_y = u_y - gt$:
  $$0 = u\\sin\\theta - g t_{\\text{top}} \\implies t_{\\text{top}} = \\frac{u\\sin\\theta}{g}$$
- Total time of flight is twice the time to top:
  $$T = 2 t_{\\text{top}} = \\frac{2u\\sin\\theta}{g} \\quad \\blacksquare$$

#### 2. Derivation of Maximum Height ($H$):
- Using the vertical kinematics formula: $v_y^2 = u_y^2 - 2gH$.
- At peak height, $v_y = 0$:
  $$0 = (u\\sin\\theta)^2 - 2gH \\implies 2gH = u^2\\sin^2\\theta$$
  $$H = \\frac{u^2\\sin^2\\theta}{2g} \\quad \\blacksquare$$

#### 3. Derivation of Horizontal Range ($R$):
- Range is horizontal distance traveled during total time $T$:
  $$R = u_x \\times T = (u\\cos\\theta) \\times \\left(\\frac{2u\\sin\\theta}{g}\\right) = \\frac{u^2 (2\\sin\\theta\\cos\\theta)}{g}$$
- Using double-angle trig identity $2\\sin\\theta\\cos\\theta = \\sin(2\\theta)$:
  $$R = \\frac{u^2\\sin(2\\theta)}{g} \\quad \\blacksquare$$`,
      intuitionAndExamples: `A football kicked at $45^\\circ$ travels the maximum horizontal distance. Complementary launch angles (e.g. $30^\\circ$ and $60^\\circ$) achieve the exact same horizontal range!`,
      takeaways: [`T = 2u sinθ / g`, `H = u² sin²θ / (2g)`, `R = u² sin(2θ) / g`, `Max range at θ = 45°`]
    };
  }

  // Simple Pendulum Time Period Derivation
  if (
    q.includes("simple pendulum") ||
    q.includes("time period of pendulum") ||
    q.includes("t = 2pi sqrt(l/g)") ||
    q.includes("pendulum derivation")
  ) {
    return {
      title: "Simple Pendulum Time Period: $T = 2\\pi\\sqrt{\\frac{L}{g}}$ Derivation",
      directAnswer: `**The time period ($T$) of a simple pendulum of length $L$ executing small-angle oscillations is:**
$$T = 2\\pi \\sqrt{\\frac{L}{g}}$$
where $L$ is string length and $g$ is gravitational acceleration.`,
      principles: `- Restoring torque is caused by the tangential component of gravity ($mg\\sin\\theta$).
- **Small Angle Approximation**: For $\\theta \\ll 1\\text{ rad}$ (under $\\approx 10^\\circ$), $\\sin\\theta \\approx \\theta$.`,
      derivationOrSteps: `#### Step-by-Step Derivation (SHM Dynamics):
1. **Identify the restoring force acting tangential to the arc of length $s = L\\theta$**:
   $$F_{\\text{restoring}} = -mg \\sin\\theta$$

2. **Apply the small angle approximation ($\sin\\theta \\approx \\theta = \\frac{x}{L}$)**:
   $$F = -mg \\left(\\frac{x}{L}\\right) = -\\left(\\frac{mg}{L}\\right) x$$

3. **From Newton's second law ($F = m a = m \\frac{d^2x}{dt^2}$)**:
   $$m \\frac{d^2x}{dt^2} = -\\left(\\frac{mg}{L}\\right) x \\implies \\frac{d^2x}{dt^2} + \\left(\\frac{g}{L}\\right) x = 0$$

4. **Compare with standard Simple Harmonic Motion equation ($\\frac{d^2x}{dt^2} + \\omega^2 x = 0$)**:
   $$\\omega^2 = \\frac{g}{L} \\implies \\omega = \\sqrt{\\frac{g}{L}}$$

5. **Substitute into the time period definition ($T = \\frac{2\\pi}{\\omega}$)**:
   $$T = \\frac{2\\pi}{\\sqrt{g/L}} = 2\\pi \\sqrt{\\frac{L}{g}} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Notice that the pendulum's mass $m$ does **not** appear in the formula! A light pendulum and a heavy pendulum of the same length will swing with the exact same time period.`,
      takeaways: [`T = 2π √(L/g)`, `Independent of bob mass and amplitude (for small angles)`]
    };
  }

  // Escape Velocity Derivation
  if (
    q.includes("escape velocity") ||
    q.includes("v_e = sqrt(2gr)") ||
    q.includes("sqrt(2gm/r)")
  ) {
    return {
      title: "Escape Velocity Derivation: $v_e = \\sqrt{\\frac{2GM}{R}}$",
      directAnswer: `**The escape velocity from the surface of a spherical planet of mass $M$ and radius $R$ is:**
$$v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}$$
For Earth ($M \\approx 5.97 \\times 10^{24}\\text{ kg}, R \\approx 6371\\text{ km}$), **$v_e \\approx 11.2\\text{ km/s}$** (approx. $25,000\\text{ mph}$).`,
      principles: `- Escape velocity is the minimum speed needed for a non-propelled object to escape the gravitational pull of a celestial body and reach infinity with zero kinetic energy.
- Governed by the **Law of Conservation of Mechanical Energy**: $E_{\\text{initial}} = E_{\\text{final}} = 0$.`,
      derivationOrSteps: `#### Step-by-Step Derivation:
1. **Total mechanical energy at surface ($r = R$)**:
   $$E_{\\text{surface}} = K_{\\text{surface}} + U_{\\text{surface}} = \\frac{1}{2}m v_e^2 - \\frac{GMm}{R}$$

2. **Total mechanical energy at infinity ($r \\to \\infty$)**:
   At infinity, the object has escaped the gravitational field ($U_\\infty = 0$) and its minimum speed is zero ($K_\\infty = 0$):
   $$E_\\infty = 0$$

3. **Equate energies by Conservation of Energy**:
   $$\\frac{1}{2}m v_e^2 - \\frac{GMm}{R} = 0$$

4. **Add $\\frac{GMm}{R}$ to both sides and cancel object mass $m$**:
   $$\\frac{1}{2} v_e^2 = \\frac{GM}{R} \\implies v_e^2 = \\frac{2GM}{R}$$

5. **Take the square root**:
   $$v_e = \\sqrt{\\frac{2GM}{R}} \\quad \\blacksquare$$

6. **Alternative form using surface gravity $g = \\frac{GM}{R^2} \\implies GM = gR^2$**:
   $$v_e = \\sqrt{\\frac{2(gR^2)}{R}} = \\sqrt{2gR} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Because the Moon has lower mass and radius, its escape velocity is only $2.38\\text{ km/s}$, which is why the Moon cannot hold an atmosphere (gas molecules exceed this speed and escape into space).`,
      takeaways: [`v_e = √(2GM/R) = √(2gR)`, `Earth v_e ≈ 11.2 km/s`, `Independent of the escaping object's mass`]
    };
  }

  // Lens Formula & Lens Maker's Formula
  if (
    q.includes("lens formula") ||
    q.includes("lens maker") ||
    q.includes("mirror formula") ||
    q.includes("1/f = 1/v - 1/u") ||
    q.includes("1/f = 1/v + 1/u")
  ) {
    return {
      title: "Optics: Lens Formula & Mirror Formula Derivation",
      directAnswer: `**The Thin Lens Formula and Mirror Formula relate focal length ($f$), object distance ($u$), and image distance ($v$):**
- **Thin Lens Formula**: $$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$
- **Spherical Mirror Formula**: $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
- **Lens Maker's Formula**: $$\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$$`,
      principles: `- **Cartesian Sign Convention**:
  - Distances measured in the direction of incident light are positive (+).
  - Distances measured against the incident light are negative (-).
  - For real objects, $u$ is negative.
  - Convex lens: $f > 0$; Concave lens: $f < 0$.
- **Magnification**:
  - Lens: $m = \\frac{v}{u} = \\frac{h_i}{h_o}$
  - Mirror: $m = -\\frac{v}{u} = \\frac{h_i}{h_o}$`,
      derivationOrSteps: `#### Step-by-Step Derivation of Thin Lens Formula (Similar Triangles):
1. Consider a convex lens with optical centre $O$. An object $AB$ of height $h_o$ is placed at distance $-u$.
2. Ray 1 passes through the optical centre $O$ undeviated, forming triangle $\\triangle ABO \\sim \\triangle A'B'O$:
   $$\\frac{A'B'}{AB} = \\frac{v}{-u} \\implies \\frac{h_i}{h_o} = -\\frac{v}{u} \\quad \\text{--- (1)}$$
3. Ray 2 parallel to the principal axis refracts through the focus $F_2$, forming triangle $\\triangle MOF_2 \\sim \\triangle A'B'F_2$ (where $MO = AB$):
   $$\\frac{A'B'}{MO} = \\frac{v - f}{f} \\implies \\frac{h_i}{h_o} = \\frac{v - f}{f} \\quad \\text{--- (2)}$$
4. Equate equations (1) and (2):
   $$\\frac{v}{u} = \\frac{v - f}{f} = \\frac{v}{f} - 1$$
5. Divide the entire equation by image distance $v$:
   $$\\frac{1}{u} = \\frac{1}{f} - \\frac{1}{v} \\implies \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Eyeglasses and microscope objectives use these formulas to position lenses so that blurred incoming light refocuses sharply onto the retina or sensor.`,
      takeaways: [`Lens: 1/f = 1/v - 1/u`, `Mirror: 1/f = 1/v + 1/u`, `Power P = 1/f (in Dioptres)`]
    };
  }

  // De Broglie Wavelength & Photoelectric Effect
  if (
    q.includes("de broglie") ||
    q.includes("photoelectric") ||
    q.includes("wave particle duality") ||
    q.includes("lambda = h/p")
  ) {
    return {
      title: "Wave-Particle Duality: De Broglie Wavelength & Photoelectric Effect",
      directAnswer: `**De Broglie hypothesized that all moving matter has an associated wave nature with wavelength $\\lambda$:**
$$\\lambda = \\frac{h}{p} = \\frac{h}{mv} = \\frac{h}{\\sqrt{2mE_k}}$$
where $h = 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$ is Planck's constant, $p$ is momentum, $m$ is mass, and $v$ is velocity.`,
      principles: `- **Einstein's Photoelectric Equation**:
  $$h\\nu = \\phi + K_{\\max} = h\\nu_0 + e V_0$$
  where $\\phi = h\\nu_0$ is the work function and $V_0$ is stopping potential.
- Confirmed experimentally for electrons by Davisson and Germer (1927).`,
      derivationOrSteps: `#### Step-by-Step Derivation of De Broglie Wavelength:
1. **From Einstein's mass-energy equivalence**:
   $$E = mc^2 = (mc)c = pc \\implies p = \\frac{E}{c}$$

2. **From Planck's quantum photon energy relation ($E = h\\nu$)**:
   $$p = \\frac{h\\nu}{c}$$

3. **Since wave speed $c = \\nu\\lambda \\implies \\frac{\\nu}{c} = \\frac{1}{\\lambda}$**:
   $$p = \\frac{h}{\\lambda}$$

4. **Rearrange to solve for wavelength $\\lambda$ and generalize for any matter particle of mass $m$ and velocity $v$**:
   $$\\lambda = \\frac{h}{p} = \\frac{h}{mv} \\quad \\blacksquare$$

5. **Express in terms of Kinetic Energy ($E_k = \\frac{p^2}{2m} \\implies p = \\sqrt{2mE_k}$)**:
   $$\\lambda = \\frac{h}{\\sqrt{2mE_k}} \\quad \\blacksquare$$`,
      intuitionAndExamples: `This principle enables **Electron Microscopes**! Because electrons have tiny wavelengths ($100,000\\times$ smaller than visible light photons), electron microscopes can image individual virus structures and atoms without optical diffraction limits.`,
      takeaways: [`λ = h/p = h/(mv)`, `Photoelectric: E = hν = ϕ + K_max`]
    };
  }

  // -------------------------------------------------------------
  // 5. SPACE, ASTRONOMY & ASTROPHYSICS (Class 1 to 12)
  // -------------------------------------------------------------

  // Solar System & 8 Planets
  if (
    q.includes("solar system") ||
    q.includes("planet") ||
    q.includes("mercury") ||
    q.includes("venus") ||
    q.includes("mars") ||
    q.includes("jupiter") ||
    q.includes("saturn") ||
    q.includes("uranus") ||
    q.includes("neptune") ||
    q.includes("pluto")
  ) {
    return {
      title: "The Solar System, 8 Planets & Planetary Physics",
      directAnswer: `**The Solar System consists of our central star (the Sun, containing $99.86\\%$ of total system mass), 8 major planets, dwarf planets (like Pluto and Ceres), over 200 moons, and millions of asteroids and comets held together by gravity.**`,
      principles: `- **Inner Terrestrial Planets (Rocky)**:
  1. **Mercury**: Smallest planet, closest to Sun, no atmosphere, extreme temperature swings ($-180^\\circ\\text{C}$ to $+430^\\circ\\text{C}$).
  2. **Venus**: Hottest planet ($465^\\circ\\text{C}$) due to runaway greenhouse effect with thick $\\text{CO}_2$ atmosphere and sulfuric acid clouds. Rotates backwards (retrograde).
  3. **Earth**: Only known world with liquid water oceans, nitrogen-oxygen atmosphere, dynamic magnetic shield, and thriving life.
  4. **Mars**: The "Red Planet" (iron oxide rust soil), thin $\\text{CO}_2$ atmosphere, home to Olympus Mons (tallest volcano in solar system, $22\\text{ km}$ high).
- **Outer Jovian Planets (Gas & Ice Giants)**:
  5. **Jupiter**: Largest planet ($1,300\\times$ Earth volume), Great Red Spot anticyclonic storm, powerful magnetosphere, 95 moons (including Europa with subsurface ocean).
  6. **Saturn**: Spectacular ring system composed of billions of ice and rock particles, low density (would float in water), moon Titan has methane lakes.
  7. **Uranus**: Ice giant with methane atmosphere giving it a cyan-blue tint, tilted on its side at $98^\\circ$ rotation axis.
  8. **Neptune**: Furthest planet, deep azure blue, fastest winds in the solar system (up to $2,100\\text{ km/h}$).
- **Astronomical Unit (AU)**: Average Earth-Sun distance $\\approx 1.496 \\times 10^8\\text{ km}$ ($150\\text{ million km}$).`,
      derivationOrSteps: `#### Planetary Orbital Mechanics (Kepler's 3rd Law Derivation):
1. For a planet of mass $m$ orbiting the Sun of mass $M$ in a circular orbit of radius $r$ with speed $v$:
   $$F_{\\text{gravity}} = F_{\\text{centripetal}} \\implies \\frac{GMm}{r^2} = \\frac{m v^2}{r} \\implies v^2 = \\frac{GM}{r}$$
2. Planetary orbital period $T$ is the circumference divided by orbital speed:
   $$T = \\frac{2\\pi r}{v} \\implies T^2 = \\frac{4\\pi^2 r^2}{v^2}$$
3. Substitute $v^2 = \\frac{GM}{r}$:
   $$T^2 = \\frac{4\\pi^2 r^2}{\\frac{GM}{r}} = \\left(\\frac{4\\pi^2}{GM}\\right) r^3 \\implies T^2 \\propto r^3 \\quad \\blacksquare$$
*(The square of the orbital period is directly proportional to the cube of the semi-major axis!)*`,
      intuitionAndExamples: `Why planets stay in orbit: An orbit is essentially free fall where an object moves forward so fast sideways that as it falls toward the Sun, the spherical curve of space drops away beneath it at the exact same rate!`,
      takeaways: [`8 Planets: My Very Educated Mother Just Served Us Noodles`, `Venus is the hottest planet (runaway greenhouse effect)`, `Kepler's 3rd Law: T² ∝ r³`, `1 AU ≈ 150 million km`]
    };
  }

  // The Sun, Nuclear Fusion & Solar Physics
  if (
    q.includes("sun") ||
    q.includes("solar flare") ||
    q.includes("sunspot") ||
    q.includes("fusion in sun") ||
    q.includes("proton proton chain") ||
    q.includes("photosphere") ||
    q.includes("corona")
  ) {
    return {
      title: "The Sun: Structure, Energy Production & Nuclear Fusion",
      directAnswer: `**The Sun is a G-type main-sequence yellow dwarf star at the center of our solar system. It generates energy at its core ($15\\text{ million K}$) by fusing $600\\text{ million tons}$ of Hydrogen into Helium every second through the proton-proton nuclear fusion chain, releasing energy governed by $E = mc^2$.**`,
      principles: `- **Solar Architecture (Inside Out)**:
  1. **Core**: Density $150\\text{ g/cm}^3$, temperature $\\approx 15\\times 10^6\\text{ K}$, where thermonuclear fusion occurs.
  2. **Radiative Zone**: Energy travels outward very slowly as photons (taking $100,000\\text{ to }170,000\\text{ years}$ to reach the convective zone).
  3. **Convective Zone**: Boiling plasma currents carry heat outward to the surface.
  4. **Photosphere**: Visible surface of the Sun ($T \\approx 5,500^\\circ\\text{C}$ or $5,800\\text{ K}$).
  5. **Chromosphere & Corona**: Outer solar atmosphere; the Corona reaches over $1-3\\text{ million K}$ and expands into the Solar Wind.
- **Solar Mass**: $M_\\odot \\approx 1.989 \\times 10^{30}\\text{ kg}$ ($333,000\\times$ Earth mass).`,
      derivationOrSteps: `#### Thermonuclear Proton-Proton ($p-p$) Fusion Reaction:
1. Two protons fuse into a deuteron, positron, and neutrino:
   $$^1\\text{H} + ^1\\text{H} \\longrightarrow ^2\\text{H} + e^+ + \\nu_e + 0.42\\text{ MeV}$$
2. Positron annihilates with an electron producing gamma-ray photons:
   $$e^+ + e^- \\longrightarrow 2\\gamma + 1.022\\text{ MeV}$$
3. Deuteron fuses with another proton forming Helium-3:
   $$^2\\text{H} + ^1\\text{H} \\longrightarrow ^3\\text{He} + \\gamma + 5.49\\text{ MeV}$$
4. Two Helium-3 nuclei fuse into stable Helium-4 and release two protons:
   $$^3\\text{He} + ^3\\text{He} \\longrightarrow ^4\\text{He} + 2\\,^1\\text{H} + 12.86\\text{ MeV}$$
5. **Net Reaction**:
   $$4\\,^1\\text{H} + 2e^- \\longrightarrow ^4\\text{He} + 2\\nu_e + 6\\gamma + 26.7\\text{ MeV} \\quad \\blacksquare$$
*(The mass of $^4\\text{He}$ is $0.7\\%$ less than $4$ protons; this lost mass is converted directly into solar radiant energy via $E = \\Delta m c^2$!)*`,
      intuitionAndExamples: `Light generated in the Sun's core today started its journey thousands of years ago as high-energy gamma rays bouncing between plasma ions before finally escaping the photosphere and reaching Earth in just $8\\text{ minutes and }20\\text{ seconds}$!`,
      takeaways: [`Core temperature ≈ 15 million K, Surface ≈ 5,800 K`, `4 ¹H -> ⁴He + 26.7 MeV`, `Sunlight takes 8 min 20 sec to reach Earth`]
    };
  }

  // Moon, Lunar Phases, Tides & Eclipses
  if (
    q.includes("moon") ||
    q.includes("lunar") ||
    q.includes("eclipse") ||
    q.includes("tide") ||
    q.includes("phases of the moon") ||
    q.includes("tidal force")
  ) {
    return {
      title: "The Moon: Lunar Phases, Ocean Tides & Solar/Lunar Eclipses",
      directAnswer: `**The Moon is Earth's only natural satellite, orbiting at an average distance of $384,400\\text{ km}$ ($238,855\\text{ miles}$). It is gravitationally tidally locked to Earth (orbital period = rotational period = $27.3\\text{ days}$), meaning we always see the same lunar face.**`,
      principles: `- **Lunar Phases ($29.5\\text{ day}$ synodic cycle)**:
  New Moon $\\to$ Waxing Crescent $\\to$ First Quarter $\\to$ Waxing Gibbous $\\to$ Full Moon $\\to$ Waning Gibbous $\\to$ Third Quarter $\\to$ Waning Crescent.
- **Ocean Tides**:
  Caused by the differential gravitational pull of the Moon and Sun stretching Earth's oceans:
  - **Spring Tides** (highest high tides): Sun, Moon, and Earth align (Full & New Moon).
  - **Neap Tides** (lowest tidal range): Sun and Moon pull at $90^\\circ$ right angles (Quarter Moons).
- **Eclipses**:
  - **Solar Eclipse**: Moon passes directly between Sun and Earth ($\text{Sun} \\to \\text{Moon} \\to \\text{Earth}$), casting its shadow (umbra/penumbra) on Earth.
  - **Lunar Eclipse**: Earth passes directly between Sun and Moon ($\text{Sun} \\to \\text{Earth} \\to \\text{Moon}$), casting Earth's shadow on the Moon turning it blood red due to atmospheric Rayleigh refraction.`,
      derivationOrSteps: `#### Why Lunar Tides are $2.2\\times$ Stronger than Solar Tides:
1. Gravitational Force: $F = \\frac{GMm}{r^2}$.
2. Tidal stretching force is the gradient (derivative) of gravity across Earth's diameter $2R_E$:
   $$F_{\\text{tidal}} = \\frac{dF}{dr} \\cdot 2R_E = -\\frac{2GMm}{r^3} \\cdot 2R_E \\propto \\frac{M}{r^3}$$
3. Ratio of Moon's tidal force to Sun's tidal force:
   $$\\frac{\\text{Tidal}_{\\text{Moon}}}{\\text{Tidal}_{\\text{Sun}}} = \\left(\\frac{M_{\\text{Moon}}}{M_{\\text{Sun}}}\\right) \\cdot \\left(\\frac{r_{\\text{Sun}}}{r_{\\text{Moon}}}\\right)^3$$
4. Substituting $M_{\\odot} = 2.7 \\times 10^7 M_{\\text{Moon}}$ and $r_{\\odot} = 390\\, r_{\\text{Moon}}$:
   $$\\frac{\\text{Tidal}_{\\text{Moon}}}{\\text{Tidal}_{\\text{Sun}}} = \\frac{1}{2.7 \\times 10^7} \\times (390)^3 = \\frac{5.93 \\times 10^7}{2.7 \\times 10^7} \\approx 2.2 \\quad \\blacksquare$$`,
      intuitionAndExamples: `Even though the Sun is $27\\text{ million times}$ more massive than the Moon, the Moon is $390\\text{ times}$ closer, and because tidal forces drop off with distance cubed ($1/r^3$), the Moon dominates our daily ocean tides!`,
      takeaways: [`Moon is tidally locked (27.3 days)`, `Solar Eclipse: Sun-Moon-Earth`, `Lunar Eclipse: Sun-Earth-Moon`, `Lunar tides are 2.2x stronger than Solar tides`]
    };
  }

  // Black Holes, Supernovas & Life Cycle of Stars
  if (
    q.includes("black hole") ||
    q.includes("supernova") ||
    q.includes("event horizon") ||
    q.includes("neutron star") ||
    q.includes("stellar evolution") ||
    q.includes("white dwarf") ||
    q.includes("schwarzschild radius")
  ) {
    return {
      title: "Life Cycle of Stars, Supernovae & Black Holes",
      directAnswer: `**A star is born in a giant molecular gas cloud (nebula) when gravity compresses hydrogen to ignite nuclear fusion. Its ultimate fate is determined strictly by its initial mass:**
- **Low/Medium Mass Stars (like our Sun)**: Nebula $\\to$ Main Sequence $\\to$ Red Giant $\\to$ Planetary Nebula $\\to$ **White Dwarf** ($M < 1.44 M_\\odot$, Chandrasekhar limit).
- **High Mass Stars ($> 8 M_\\odot$)**: Nebula $\\to$ Red Supergiant $\\to$ Type II **Supernova** $\\to$ **Neutron Star** (Pulsar) or **Black Hole** ($M > 3 M_\\odot$, Oppenheimer-Volkoff limit).`,
      principles: `- **Event Horizon**: The boundary around a black hole from within which nothing—not even light—can escape.
- **Singularity**: Point of infinite density at the center where classical general relativity breaks down.
- **Schwarzschild Radius ($R_s$)**:
  $$R_s = \\frac{2GM}{c^2}$$
  *(For Earth: $R_s \\approx 9\\text{ mm}$; for Sun: $R_s \\approx 3\\text{ km}$)*.
- **Supermassive Black Holes**: Lurk at galactic centers, e.g., Sagittarius A* at Milky Way's center ($4.3\\text{ million }M_\\odot$).`,
      derivationOrSteps: `#### Derivation of the Schwarzschild Radius ($R_s = \\frac{2GM}{c^2}$):
1. Recall the classical escape velocity from a mass $M$ at radius $R$:
   $$v_{\\text{esc}} = \\sqrt{\\frac{2GM}{R}}$$
2. For a black hole, the escape velocity at the event horizon equals the cosmic speed limit—the speed of light $c$:
   $$c = \\sqrt{\\frac{2GM}{R_s}}$$
3. Square both sides:
   $$c^2 = \\frac{2GM}{R_s}$$
4. Solve for $R_s$:
   $$R_s = \\frac{2GM}{c^2} \\quad \\blacksquare$$`,
      intuitionAndExamples: `If you were compressed into a black hole without losing mass, Earth would fit inside a marble the size of a blueberry, yet its gravitational pull on the Moon would remain completely unchanged!`,
      takeaways: [`Schwarzschild Radius Rs = 2GM/c²`, `Chandrasekhar Limit = 1.44 M☉`, `Nothing can escape past the Event Horizon`]
    };
  }

  // Big Bang, Galaxies, Expansion of Universe & Hubble's Law
  if (
    q.includes("big bang") ||
    q.includes("universe") ||
    q.includes("galaxy") ||
    q.includes("milky way") ||
    q.includes("hubble's law") ||
    q.includes("hubbles law") ||
    q.includes("dark matter") ||
    q.includes("dark energy") ||
    q.includes("redshift")
  ) {
    return {
      title: "The Big Bang, Galaxies, Hubble's Law & Expanding Universe",
      directAnswer: `**The universe began approximately $13.8\\text{ billion years ago}$ from an extremely hot, dense singularity in an event called the Big Bang. Space itself expanded exponentially, cooling to allow quarks, protons, atoms, stars, and over $2\\text{ trillion galaxies}$ to form.**`,
      principles: `- **Cosmic Composition**:
  - **Ordinary Baryonic Matter** ($4.9\\%$): Stars, planets, gas, atoms, humans.
  - **Dark Matter** ($26.8\\%$): Invisible matter detected through gravitational lensing and galaxy rotation curves.
  - **Dark Energy** ($68.3\\%$): Mysterious repulsive energy driving the accelerating expansion of the universe.
- **Hubble-Lemaître Law**:
  $$v = H_0 \\cdot d$$
  where $v$ is recessional velocity of a galaxy, $d$ is distance, and $H_0 \\approx 70\\text{ km/s/Mpc}$ is the Hubble Constant.
- **Cosmic Microwave Background (CMB)**: Thermal radiation relic left over from the Big Bang at $T \\approx 2.725\\text{ K}$.`,
      derivationOrSteps: `#### Estimating the Age of the Universe from Hubble's Constant:
1. From Hubble's Law: $v = H_0 \\cdot d \\implies \\frac{d}{v} = \\frac{1}{H_0}$.
2. Since distance over velocity is time ($t = d/v$), the Hubble Time $t_H$ estimates the expansion duration:
   $$t_{\\text{age}} \\approx \\frac{1}{H_0}$$
3. Convert $H_0 \\approx 70\\text{ km/s/Mpc}$ into SI units:
   $$1\\text{ Mpc} \\approx 3.086 \\times 10^{19}\\text{ km}$$
   $$H_0 \\approx \\frac{70}{3.086 \\times 10^{19}}\\text{ s}^{-1} \\approx 2.27 \\times 10^{-18}\\text{ s}^{-1}$$
4. Calculate $t_{\\text{age}}$:
   $$t_{\\text{age}} = \\frac{1}{2.27 \\times 10^{-18}\\text{ s}^{-1}} \\approx 4.4 \\times 10^{17}\\text{ seconds}$$
5. Convert seconds to years ($1\\text{ yr} \\approx 3.156 \\times 10^7\\text{ s}$):
   $$t_{\\text{age}} \\approx \\frac{4.4 \\times 10^{17}}{3.156 \\times 10^7} \\approx 13.8\\text{ billion years} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Think of baking raisin bread: as the dough expands in the oven, every raisin sees every other raisin moving away from it—not because raisins are running away, but because the fabric of dough between them is stretching!`,
      takeaways: [`Age of Universe ≈ 13.8 billion years`, `Hubble's Law: v = H₀ · d`, `Universe: 68% Dark Energy, 27% Dark Matter, 5% Normal Matter`]
    };
  }

  // -------------------------------------------------------------
  // 6. EARTH SCIENCE, GEOLOGY & ATMOSPHERE (Class 1 to 12)
  // -------------------------------------------------------------

  // Earth's Structure: Crust, Mantle, Outer & Inner Core
  if (
    q.includes("layers of earth") ||
    q.includes("earth's structure") ||
    q.includes("earths structure") ||
    q.includes("crust") ||
    q.includes("mantle") ||
    q.includes("core") ||
    q.includes("lithosphere") ||
    q.includes("asthenosphere") ||
    q.includes("earth's magnetic field") ||
    q.includes("geodynamo")
  ) {
    return {
      title: "Layers of the Earth: Crust, Mantle, Outer & Inner Core",
      directAnswer: `**The Earth is a differentiated terrestrial planet composed of concentric spherical layers characterized by distinct chemical compositions and physical states, spanning a mean radius of $6,371\\text{ km}$:**`,
      principles: `- **The 4 Major Layers**:
  1. **Crust** ($0-70\\text{ km}$):
     - Continental crust: $30-70\\text{ km}$ thick, composed of granitic silicate rocks (Si-Al).
     - Oceanic crust: $5-10\\text{ km}$ thick, dense basaltic rock (Si-Mg).
  2. **Mantle** ($70-2,890\\text{ km}$, $84\\%$ of Earth's volume):
     - Solid silicate peridotite rock that flows sluggishly via convection over millions of years.
     - Divided into rigid **Lithosphere** and semi-fluid **Asthenosphere** ($100-350\\text{ km}$).
  3. **Outer Core** ($2,890-5,150\\text{ km}$):
     - Liquid iron ($85\\%$) and nickel ($10\\%$) alloy at $4,000-5,000^\\circ\\text{C}$.
     - Convection of molten iron generates Earth's **Geodynamo Magnetic Shield**, deflecting lethal solar wind radiation!
  4. **Inner Core** ($5,150-6,371\\text{ km}$):
     - Solid iron-nickel sphere at $5,500-6,000^\\circ\\text{C}$ (hotter than the Sun's surface!). It remains solid despite extreme heat due to immense confining pressure ($3.6\\text{ million atm}$).`,
      derivationOrSteps: `#### How Scientists Map Earth's Interior (Seismic Wave Analysis):
1. **$P$-Waves (Primary / Longitudinal)**: Travel through both solids and liquids; refract at boundary layers.
2. **$S$-Waves (Secondary / Transverse Shear)**: Cannot travel through liquids ($v_s = \\sqrt{\\mu/\\rho} = 0$ when shear modulus $\\mu = 0$).
3. **The Liquid Outer Core Discovery**:
   - Seismographs detect an **$S$-wave shadow zone** ($103^\\circ$ to $180^\\circ$ from earthquake epicenters) where no direct $S$-waves arrive, proving conclusively that the Outer Core is molten liquid!`,
      intuitionAndExamples: `Earth's liquid outer core acts like an enormous electrical generator. The circulating molten iron creates magnetic field lines that exit near the South Pole and loop around to the North Pole, creating our **Magnetosphere** that protects Earth's atmosphere from being stripped away by the solar wind (which happened to Mars!).`,
      takeaways: [`Crust (thin rock), Mantle (plastic silicates), Outer Core (liquid iron), Inner Core (solid iron)`, `Outer Core convection creates Earth's magnetic shield`, `Earth's radius R ≈ 6,371 km`]
    };
  }

  // Plate Tectonics, Earthquakes & Volcanoes
  if (
    q.includes("plate tectonic") ||
    q.includes("earthquake") ||
    q.includes("volcano") ||
    q.includes("fault") ||
    q.includes("seismic") ||
    q.includes("richter") ||
    q.includes("continental drift") ||
    q.includes("pangaea") ||
    q.includes("ring of fire")
  ) {
    return {
      title: "Plate Tectonics, Continental Drift, Earthquakes & Volcanoes",
      directAnswer: `**Plate Tectonics is the unifying geological theory stating that Earth's outer rigid shell (lithosphere) is divided into ~15 major tectonic plates that glide over the ductile asthenosphere driven by mantle convection currents at speeds of $2-15\\text{ cm/year}$.**`,
      principles: `- **Three Types of Plate Boundaries**:
  1. **Convergent Boundaries (Colliding)**:
     - Continental-Continental: Mountains form (e.g. Indian plate into Eurasian plate creating the Himalayas).
     - Oceanic-Continental / Oceanic-Oceanic: Denser oceanic plate subducts into mantle, generating deep ocean trenches, explosive volcanoes, and earthquakes (e.g. Pacific "Ring of Fire").
  2. **Divergent Boundaries (Pulling Apart)**:
     - Magma rises to create new seafloor (e.g. Mid-Atlantic Ridge) or continental rift valleys (East African Rift).
  3. **Transform Boundaries (Sliding Past)**:
     - Plates grind horizontally, locking with friction until energy releases suddenly in earthquakes (e.g. San Andreas Fault).
- **Earthquake Measurement**:
  - **Focus (Hypocenter)**: Exact underground point where rock fractures.
  - **Epicenter**: Point on Earth's surface directly above the focus.
  - **Moment Magnitude Scale ($M_w$)**: Logarithmic scale where each $+1$ unit represents $10^{1.5} \\approx 32\\times$ more energy released!`,
      derivationOrSteps: `#### Energy Scaling in Earthquakes:
1. Gutenberg-Richter Energy relation:
   $$\\log_{10} E = 4.8 + 1.5 M$$
2. Energy ratio between an $M=7.0$ and $M=5.0$ earthquake:
   $$\\frac{E_7}{E_5} = 10^{1.5(7 - 5)} = 10^{1.5(2)} = 10^3 = 1,000\\times \\text{ more energy!} \\quad \\blacksquare$$`,
      intuitionAndExamples: `250 million years ago, all continents were joined together in a supercontinent called **Pangaea**. Fossil discoveries of identical freshwater reptiles (Mesosaurus) in South America and Africa provided evidence that these continents once touched and drifted apart!`,
      takeaways: [`Plates move 2-10 cm/yr driven by mantle convection`, `Convergent (Himalayas), Divergent (Mid-Atlantic), Transform (San Andreas)`, `Each +1 earthquake magnitude = 31.6x more energy`]
    };
  }

  // Earth's Atmosphere, Layers, Weather & Ozone
  if (
    q.includes("atmosphere") ||
    q.includes("troposphere") ||
    q.includes("stratosphere") ||
    q.includes("mesosphere") ||
    q.includes("thermosphere") ||
    q.includes("exosphere") ||
    q.includes("ozone") ||
    q.includes("aurora") ||
    q.includes("northern lights")
  ) {
    return {
      title: "Earth's Atmosphere: Layers, Composition, Ozone & Auroras",
      directAnswer: `**Earth's atmosphere is a blanket of gases retained by gravity spanning ~10,000 km altitude. It is composed of $78.08\\%\\text{ Nitrogen } (\\text{N}_2)$, $20.95\\%\\text{ Oxygen } (\\text{O}_2)$, $0.93\\%\\text{ Argon } (\\text{Ar})$, $0.04\\%\\text{ Carbon Dioxide } (\\text{CO}_2)$, and variable water vapor ($0-4\\%$).**`,
      principles: `- **5 Atmospheric Layers (Bottom to Top)**:
  1. **Troposphere** ($0-12\\text{ km}$):
     - Contains $75\\%$ of atmospheric mass and almost all water vapor. All weather (clouds, rain, storms, jet streams) happens here. Temperature decreases with altitude (down to $-60^\\circ\\text{C}$).
  2. **Stratosphere** ($12-50\\text{ km}$):
     - Contains the **Ozone Layer** ($\text{O}_3$), which absorbs harmful solar UV-B and UV-C radiation. Temperature *increases* with altitude due to UV absorption. Commercial airliners fly in lower stratosphere to avoid turbulence.
  3. **Mesosphere** ($50-85\\text{ km}$):
     - Coldest atmospheric layer (down to $-90^\\circ\\text{C}$ to $-140^\\circ\\text{C}$). Most meteors burn up here due to friction and compression with gas molecules ("shooting stars").
  4. **Thermosphere & Ionosphere** ($85-600\\text{ km}$):
     - Extremely thin air heated by high-energy X-rays and UV from the Sun up to $2,000^\\circ\\text{C}$. Home to the **International Space Station (ISS)** at $\\approx 400\\text{ km}$ and the **Auroras** (Northern & Southern Lights).
  5. **Exosphere** ($600-10,000\\text{ km}$):
     - Outer fringe where light gases like Hydrogen and Helium gradually bleed into interplanetary space. Geostationary satellites orbit here ($35,786\\text{ km}$).`,
      derivationOrSteps: `#### Ozone Chapman Cycle Mechanism in Stratosphere:
1. High-energy solar UV photon ($< 240\\text{ nm}$) splits oxygen:
   $$\\text{O}_2 + h\\nu \\longrightarrow \\text{O} + \\text{O}$$
2. Atomic oxygen combines with molecular oxygen:
   $$\\text{O} + \\text{O}_2 + M \\longrightarrow \\text{O}_3 + M$$
3. Ozone absorbs harmful UV-B ($240-310\\text{ nm}$), protecting Earth's DNA:
   $$\\text{O}_3 + h\\nu \\longrightarrow \\text{O}_2 + \\text{O} \\quad \\blacksquare$$`,
      intuitionAndExamples: `**Auroras (Aurora Borealis / Australis)**: Solar wind plasma particles charged by the Sun get funneled along Earth's magnetic field lines into the polar thermosphere, colliding with oxygen (emitting glowing green and red light) and nitrogen (emitting blue/purple light)!`,
      takeaways: [`Atmosphere: 78% Nitrogen, 21% Oxygen, 0.9% Argon`, `Troposphere (weather), Stratosphere (Ozone), Mesosphere (meteors), Thermosphere (ISS/Auroras)`, `Ozone (O₃) filters lethal solar UV radiation`]
    };
  }

  // Water Cycle, Hydrosphere & Ocean Currents
  if (
    q.includes("water cycle") ||
    q.includes("hydrologic") ||
    q.includes("evaporation") ||
    q.includes("condensation") ||
    q.includes("precipitation") ||
    q.includes("transpiration") ||
    q.includes("ocean current") ||
    q.includes("gulf stream") ||
    q.includes("thermohaline")
  ) {
    return {
      title: "The Hydrologic (Water) Cycle & Global Ocean Circulation",
      directAnswer: `**The Water Cycle is the continuous biogeochemical cycle that circulates Earth's $1.386\\text{ billion km}^3$ of water through the atmosphere, land, and oceans driven by solar energy and gravity. Over $71\\%$ of Earth's surface is covered by water, of which $97.5\\%$ is saline ocean water and $2.5\\%$ is freshwater.**`,
      principles: `- **Core Hydrologic Stages**:
  1. **Evaporation**: Solar heat converts liquid surface water into water vapor gas.
  2. **Transpiration**: Plants release water vapor from leaves through microscopic stomata.
  3. **Condensation**: Rising warm water vapor cools at higher altitudes, condensing around condensation nuclei (dust/salt) to form clouds.
  4. **Precipitation**: When water droplets become too heavy, gravity pulls them down as rain, snow, sleet, or hail.
  5. **Infiltration & Groundwater Percolation**: Rainwater soaks into soil, recharging deep aquifers.
  6. **Surface Runoff**: Excess water flows through streams and rivers back into oceans.
- **Global Ocean Conveyor Belt (Thermohaline Circulation)**:
  Deep-ocean circulation driven by water density differences (temperature and salinity). Cold, salty water sinks near Greenland, flowing along the ocean floor and driving global climate equilibrium (like the Gulf Stream warming Europe).`,
      derivationOrSteps: `#### Global Water Distribution Breakdown:
- **Total Earth Water**: $100\\%$
  - Oceans (Saline): $97.5\\%$
  - Freshwater: $2.5\\%$
    - Glaciers & Polar Ice Caps: $68.7\\%$ of freshwater
    - Groundwater / Aquifers: $30.1\\%$ of freshwater
    - Surface Water (Lakes, Rivers, Swamps): $1.2\\%$ of freshwater
    - Atmospheric Vapor: $\\approx 0.04\\%$`,
      intuitionAndExamples: `The water molecule you drank this morning might have evaporated from a prehistoric ocean, condensed into rain that watered a dinosaur, frozen inside an Arctic glacier, and flowed down a mountain river into your tap today!`,
      takeaways: [`Water Cycle: Evaporation -> Condensation -> Precipitation -> Runoff/Infiltration`, `71% of Earth is water (97.5% saline, 2.5% freshwater)`, `Thermohaline ocean currents regulate global climate`]
    };
  }

  // Carbon Cycle & Greenhouse Effect
  if (
    q.includes("greenhouse effect") ||
    q.includes("carbon cycle") ||
    q.includes("global warming") ||
    q.includes("climate change") ||
    q.includes("greenhouse gas") ||
    q.includes("co2") ||
    q.includes("methane")
  ) {
    return {
      title: "The Carbon Cycle & The Natural/Enhanced Greenhouse Effect",
      directAnswer: `**The Greenhouse Effect is a natural physical process where atmospheric greenhouse gases (Water Vapor $\\text{H}_2\\text{O}$, Carbon Dioxide $\\text{CO}_2$, Methane $\\text{CH}_4$, Nitrous Oxide $\\text{N}_2\\text{O}$) absorb and re-emit outgoing infrared thermal radiation, keeping Earth's average surface temperature at a hospitable $+15^\\circ\\text{C}$ ($59^\\circ\\text{F}$) instead of a frozen $-18^\\circ\\text{C}$ ($0^\\circ\\text{F}$).**`,
      principles: `- **Mechanism**:
  1. High-energy shortwave solar radiation passes through the clear atmosphere.
  2. Earth's surface absorbs sunlight and warms up.
  3. Earth radiates low-energy longwave infrared (heat) back toward space.
  4. Greenhouse gas molecules absorb this infrared radiation and re-radiate it in all directions, trapping heat in the lower troposphere.
- **The Global Carbon Cycle**:
  - **Carbon Sinks**: Oceans (dissolved $\\text{CO}_2$, carbonate shells), Forests (photosynthetic biomass), Soil/Limestone rocks.
  - **Carbon Sources**: Respiration, Volcanic eruptions, Fossil fuel combustion (coal, oil, gas), Deforestation.`,
      derivationOrSteps: `#### Planetary Equilibrium Temperature Calculation (Why Greenhouse Gases are Crucial):
1. Stefan-Boltzmann Law: $P = \\sigma T^4$ where $\\sigma = 5.67 \\times 10^{-8}\\text{ W/m}^2\\text{K}^4$.
2. Solar energy absorbed by Earth with albedo $A = 0.30$:
   $$S_{\\text{absorbed}} = (1 - A) \\cdot \\frac{S_0}{4} = (1 - 0.30) \\cdot \\frac{1361\\text{ W/m}^2}{4} \\approx 238.2\\text{ W/m}^2$$
3. Radiative equilibrium with no atmosphere ($\sigma T_{\\text{bare}}^4 = S_{\\text{absorbed}}$):
   $$T_{\\text{bare}} = \\left(\\frac{238.2}{5.67 \\times 10^{-8}}\\right)^{1/4} \\approx 255\\text{ K} = -18^\\circ\\text{C} \\quad (\\text{Frozen Ice World})$$
4. Natural Greenhouse warming adds $+33^\\circ\\text{C}$:
   $$T_{\\text{actual}} = -18^\\circ\\text{C} + 33^\\circ\\text{C} = +15^\\circ\\text{C} \\quad \\blacksquare$$`,
      intuitionAndExamples: `Think of greenhouse gases like a glass greenhouse or a thermal blanket on your bed: the blanket doesn't create new heat, but it traps your body's outgoing heat from escaping into the cold bedroom!`,
      takeaways: [`Natural greenhouse effect warms Earth by +33°C (from -18°C to +15°C)`, `Major GHGs: Water vapor, CO₂, CH₄, N₂O`, `Carbon sinks: Oceans, forests, and limestone rocks`]
    };
  }

  // Rock Cycle, Minerals & Weathering
  if (
    q.includes("rock cycle") ||
    q.includes("igneous") ||
    q.includes("sedimentary") ||
    q.includes("metamorphic") ||
    q.includes("mineral") ||
    q.includes("weathering") ||
    q.includes("erosion") ||
    q.includes("fossil")
  ) {
    return {
      title: "The Rock Cycle: Igneous, Sedimentary & Metamorphic Rocks",
      directAnswer: `**The Rock Cycle is a fundamental geological model describing how rocks continuously transform between three primary rock types (Igneous, Sedimentary, and Metamorphic) over geological timescales driven by Earth's internal heat and surface weathering forces.**`,
      principles: `- **The Three Primary Rock Types**:
  1. **Igneous Rocks** (Formed from cooling and solidification of molten magma/lava):
     - **Intrusive / Plutonic**: Cools slowly deep underground, forming large crystals (e.g. Granite).
     - **Extrusive / Volcanic**: Cools rapidly on Earth's surface with fine crystals or glass (e.g. Basalt, Obsidian, Pumice).
  2. **Sedimentary Rocks** (Formed from compaction and cementation of mineral/organic sediments):
     - Formed via Weathering $\\to$ Erosion $\\to$ Deposition $\\to$ Lithification in horizontal strata.
     - Only rock type containing **fossils** (e.g. Limestone, Sandstone, Shale, Coal).
  3. **Metamorphic Rocks** (Formed by intense heat and pressure altering pre-existing rocks without melting):
     - Foliated (banded crystals) vs Non-foliated:
     - Limestone $\\xrightarrow{\\Delta, P}$ Marble; Shale $\\xrightarrow{\\Delta, P}$ Slate $\\xrightarrow{\\Delta, P}$ Schist $\\xrightarrow{\\Delta, P}$ Gneiss; Sandstone $\\xrightarrow{\\Delta, P}$ Quartzite.`,
      derivationOrSteps: `#### Key Transformations in the Rock Cycle:
- Igneous / Metamorphic $\\xrightarrow{\\text{Weathering + Erosion + Compaction}}$ Sedimentary Rock
- Sedimentary / Igneous $\\xrightarrow{\\text{Heat + Intense Pressure}}$ Metamorphic Rock
- Any Rock Type $\\xrightarrow{\\text{Deep Subduction + Melting}}$ Magma $\\xrightarrow{\\text{Crystallization}}$ Igneous Rock`,
      intuitionAndExamples: `Mount Rushmore's presidential faces are carved into hard intrusive Granite, the white cliffs of Dover are Sedimentary chalk made of prehistoric microscopic shells, and the Taj Mahal is constructed from brilliant Metamorphic Marble!`,
      takeaways: [`Igneous (cooled magma/lava), Sedimentary (compressed layers + fossils), Metamorphic (heat & pressure transformed)`, `Any rock can transform into any other rock given sufficient geological time`]
    };
  }


  // Mole Concept & Stoichiometry
  if (
    q.includes("mole concept") ||
    q.includes("avogadro") ||
    q.includes("what is a mole") ||
    q.includes("6.022")
  ) {
    return {
      title: "The Mole Concept & Avogadro's Number",
      directAnswer: `**A mole ($1\\text{ mol}$) is the SI unit for amount of substance containing exactly $6.02214076 \\times 10^{23}$ elementary entities (Avogadro's Number, $N_A$).**`,
      principles: `- **Core Formulas**:
  - Number of moles from mass: $$n = \\frac{m}{M} = \\frac{\\text{Mass (in g)}}{\\text{Molar Mass (in g/mol)}}$$
  - Number of particles ($N$): $$N = n \\times N_A = \\left(\\frac{m}{M}\\right) \\times 6.022 \\times 10^{23}$$
  - Gas volume at STP ($0^\\circ\\text{C}, 1\\text{ atm}$): $$V = n \\times 22.4\\text{ Litres}$$
  - Solution Molarity ($M$): $$M = \\frac{\\text{Moles of Solute}}{\\text{Volume of Solution in Litres}}$$`,
      derivationOrSteps: `#### Example Calculation: How many atoms in $12\\text{ grams}$ of Carbon-12?
1. Molar mass of Carbon-12: $M = 12\\text{ g/mol}$.
2. Number of moles: $n = \\frac{12\\text{ g}}{12\\text{ g/mol}} = 1.0\\text{ mol}$.
3. Number of carbon atoms: $N = 1.0 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{23}\\text{ atoms}$.`,
      intuitionAndExamples: `A "mole" is a chemist's counting unit, just like a "dozen" means 12 items. Because atoms are unimaginably tiny, $1\\text{ mole}$ provides a bridge between macroscopic grams we can weigh on a scale and microscopic individual atoms!`,
      takeaways: [`1 mole = 6.022 × 10²³ particles`, `n = mass / molar mass`, `1 mole gas at STP = 22.4 L`]
    };
  }

  // Acids, Bases & pH Scale
  if (
    q.includes("acid") ||
    q.includes("base") ||
    q.includes("ph scale") ||
    q.includes("neutralization") ||
    q.includes("litmus")
  ) {
    return {
      title: "Acids, Bases, Salts & The pH Scale",
      directAnswer: `**Acids are substances that release hydrogen ions ($H^+$ or $H_3O^+$) in aqueous solution (sour taste, turns blue litmus red, $\\text{pH} < 7$). Bases release hydroxide ions ($OH^-$) (bitter taste, slippery feel, turns red litmus blue, $\\text{pH} > 7$).**`,
      principles: `- **The pH Scale ($0$ to $14$ at $25^\\circ\\text{C}$)**:
  $$\\text{pH} = -\\log_{10}[H^+] \\qquad \\text{pOH} = -\\log_{10}[OH^-] \\qquad \\text{pH} + \\text{pOH} = 14$$
  - $\\text{pH} < 7$: Acidic (e.g. Lemon juice $\\approx 2$, Stomach acid $\\approx 1.5$)
  - $\\text{pH} = 7$: Pure Neutral Water ($[H^+] = [OH^-] = 10^{-7}\\text{ M}$)
  - $\\text{pH} > 7$: Basic/Alkaline (e.g. Baking soda $\\approx 9$, Bleach $\\approx 13$)
- **Neutralization Reaction**:
  $$\\text{Acid} + \\text{Base} \\longrightarrow \\text{Salt} + \\text{Water} \\qquad (\\text{e.g. } \\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O})$$`,
      derivationOrSteps: `#### Calculating pH of a $0.01\\text{ M HCl}$ solution:
1. Hydrochloric acid is a strong acid that dissociates completely: $\\text{HCl} \\to H^+ + Cl^-$.
2. Therefore $[H^+] = 0.01\\text{ M} = 10^{-2}\\text{ M}$.
3. Apply pH definition:
   $$\\text{pH} = -\\log_{10}(10^{-2}) = -(-2) = 2.0 \\quad \\blacksquare$$`,
      intuitionAndExamples: `Because pH is logarithmic, a liquid with $\\text{pH} = 3$ is **10 times** more acidic than $\\text{pH} = 4$, and **100 times** more acidic than $\\text{pH} = 5$!`,
      takeaways: [`pH = -log[H+]`, `Acid + Base -> Salt + Water`, `pH < 7 Acidic, pH = 7 Neutral, pH > 7 Basic`]
    };
  }

  // -------------------------------------------------------------
  // 4. BIOLOGY & NATURAL SCIENCES (Class 1 to 12)
  // -------------------------------------------------------------

  // Cellular Respiration
  if (
    q.includes("respiration") ||
    q.includes("cellular respiration") ||
    q.includes("aerobic respiration") ||
    q.includes("how cells make energy")
  ) {
    return {
      title: "Cellular Respiration: Aerobic & Anaerobic Energy Production",
      directAnswer: `**Cellular respiration is the biochemical process by which cells break down glucose sugar in the presence of oxygen to produce ATP (adenosine triphosphate) chemical energy, water, and carbon dioxide:**
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\longrightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 36\\text{ to }38\\text{ ATP}$$`,
      principles: `- **Three Main Stages**:
  1. **Glycolysis** (in Cytoplasm): Splits 1 glucose ($6\\text{C}$) into 2 pyruvate ($3\\text{C}$), yielding net $2\\text{ ATP}$ and $2\\text{ NADH}$ (Anaerobic).
  2. **Krebs Cycle / Citric Acid Cycle** (in Mitochondrial Matrix): Breaks down pyruvate into $\\text{CO}_2$, generating electron carriers ($6\\text{ NADH}, 2\\text{ FADH}_2, 2\\text{ ATP}$).
  3. **Electron Transport Chain & Oxidative Phosphorylation** (in Inner Mitochondrial Cristae): Uses oxygen as final electron acceptor to generate the bulk of energy ($\approx 32-34\\text{ ATP}$) via ATP Synthase.`,
      derivationOrSteps: `#### Comparison with Photosynthesis:
Notice that Cellular Respiration is the exact chemical reverse of Photosynthesis!
- Photosynthesis: Stores solar energy into glucose: $6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$.
- Respiration: Releases chemical energy from glucose: $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{ATP}$.`,
      intuitionAndExamples: `When you sprint hard and your muscles run out of oxygen, cells switch temporarily to **anaerobic fermentation**, producing lactic acid which causes muscle burn!`,
      takeaways: [`Glucose + 6O₂ -> 6CO₂ + 6H₂O + ATP`, `Mitochondria is the power plant where ATP is synthesized`]
    };
  }

  // Genetics & Mendel's Laws
  if (
    q.includes("mendel") ||
    q.includes("heredity") ||
    q.includes("punnett square") ||
    q.includes("genetics") ||
    q.includes("allele")
  ) {
    return {
      title: "Mendelian Genetics: Laws of Inheritance & Punnett Squares",
      directAnswer: `**Gregor Mendel established the fundamental laws of genetic inheritance by experimenting with pea plants:**
1. **Law of Dominance**: In a heterozygote ($Tt$), the dominant allele ($T$) masks the expression of the recessive allele ($t$).
2. **Law of Segregation**: During gamete formation, the two alleles for each gene separate so each egg/sperm carries only one allele.
3. **Law of Independent Assortment**: Genes for different traits sort independently during gamete formation.`,
      principles: `- **Monohybrid Cross Phenotypic Ratio**: $3:1$ (Dominant : Recessive).
- **Genotypic Ratio**: $1:2:1$ ($1\\text{ TT} : 2\\text{ Tt} : 1\\text{ tt}$).
- **Dihybrid Cross Phenotypic Ratio**: $9:3:3:1$.`,
      derivationOrSteps: `#### Monohybrid Cross Punnett Square ($Tt \\times Tt$):
- Parent Gametes: $T$ and $t$.
- Punnett Grid:
  |   | **T** | **t** |
  |---|---|---|
  | **T** | **TT** (Tall) | **Tt** (Tall) |
  | **t** | **Tt** (Tall) | **tt** (Dwarf) |
- **Result**: $3\\text{ Tall} (75\\%) : 1\\text{ Dwarf} (25\\%)$.`,
      intuitionAndExamples: `Explains why two brown-eyed parents carrying a recessive blue-eye gene ($Bb$) have a $25\\%$ chance of having a blue-eyed child ($bb$).`,
      takeaways: [`Monohybrid ratio: 3:1 phenotype, 1:2:1 genotype`, `Dihybrid ratio: 9:3:3:1`]
    };
  }

  // Wave-Particle Duality & Quantum Mechanics
  if (q.includes("wave-particle") || q.includes("de broglie") || q.includes("quantum mechanics") || q.includes("double slit")) {
    return {
      title: "Wave-Particle Duality & The de Broglie Wavelength",
      directAnswer: `**Wave-particle duality states that matter and light exhibit both wave-like and particle-like properties simultaneously.** Photons behave like waves (interference, diffraction) and particles (photoelectric collision), while particles like electrons have an associated de Broglie wavelength:
$$\\lambda = \\frac{h}{p} = \\frac{h}{m v}$$
where $h = 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$ is Planck's constant.`,
      principles: `- **Photoelectric Effect**: Proves light delivers localized quanta of energy $E = hf$ (particles called photons).
- **Young's Double-Slit Experiment with Electrons**: Firing single electrons through two slits creates an interference pattern on the screen, proving matter acts as a probability wave $\\psi$.
- **Heisenberg Uncertainty Principle**: $\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$, meaning position and momentum cannot be simultaneously measured with infinite precision.`,
      derivationOrSteps: `#### Derivation of de Broglie's Equation:
1. From Einstein's mass-energy equivalence: $E = m c^2$
2. From Planck's quantum photon energy: $E = h f = \\frac{h c}{\\lambda}$
3. Equating both expressions:
   $$m c^2 = \\frac{h c}{\\lambda} \\implies m c = \\frac{h}{\\lambda}$$
4. Since momentum $p = m c$ (or $p = m v$ for non-relativistic particles):
   $$\\lambda = \\frac{h}{p} = \\frac{h}{m v}$$`,
      intuitionAndExamples: `Why don't we see a pitched baseball diffract through a doorway? Because a $0.145\\text{ kg}$ baseball at $40\\text{ m/s}$ has a de Broglie wavelength of $\\sim 10^{-34}\\text{ meters}$—trillions of times smaller than an atomic nucleus! But for an electron with tiny mass, its wavelength is $\\approx 10^{-10}\\text{ m}$, perfectly matching atomic crystal spacings.`,
      takeaways: [`de Broglie: λ = h / p`, `Photons and electrons exhibit both particle and wave behavior`]
    };
  }

  // Thermodynamics & Entropy
  if (q.includes("entropy") || q.includes("thermodynamics") || q.includes("carnot") || q.includes("second law")) {
    return {
      title: "The Laws of Thermodynamics & Entropy ($S$)",
      directAnswer: `**Thermodynamics governs heat, work, and energy transformations across physical systems:**
- **First Law (Conservation)**: Energy cannot be created or destroyed: $\\Delta U = Q - W$.
- **Second Law (Entropy)**: In any spontaneous process, the total entropy of the universe always increases: $\\Delta S_{\\text{universe}} > 0$. Heat never spontaneously flows from colder to hotter bodies.
- **Carnot Maximum Efficiency**: $\\eta_{\\text{max}} = 1 - \\frac{T_C}{T_H}$.`,
      principles: `- **Entropy Formula (Clausius)**: $dS = \\frac{dQ_{\\text{rev}}}{T}$.
- **Statistical Entropy (Boltzmann)**: $S = k_B \\ln(\\Omega)$, where $\\Omega$ is the number of accessible microstates and $k_B = 1.38 \\times 10^{-23}\\text{ J/K}$.
- **Absolute Zero (Third Law)**: As $T \\to 0\\text{ K}$, the entropy of a perfect crystal approaches zero ($S \\to 0$).`,
      derivationOrSteps: `#### Carnot Engine Maximum Thermal Efficiency:
1. Ideal heat engine absorbs heat $Q_H$ at temperature $T_H$ and expels waste heat $Q_C$ at temperature $T_C$.
2. Work done: $W = Q_H - Q_C$.
3. Efficiency $\\eta = \\frac{W}{Q_H} = \\frac{Q_H - Q_C}{Q_H} = 1 - \\frac{Q_C}{Q_H}$.
4. For a reversible Carnot cycle, $\\frac{Q_C}{Q_H} = \\frac{T_C}{T_H}$ (in Kelvin):
   $$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}$$`,
      intuitionAndExamples: `A dropped glass cup shatters into disordered shards spontaneously because broken shards have vastly more microstates $\\Omega$ than a pristine cup. Time's arrow flows forward along the direction of increasing universal entropy.`,
      takeaways: [`ΔS_universe ≥ 0 for all spontaneous processes`, `Carnot efficiency: η = 1 - (T_cold / T_hot)`]
    };
  }

  // Bernoulli's Principle & Fluid Dynamics
  if (q.includes("bernoulli") || q.includes("fluid dynamic") || q.includes("airplane lift") || q.includes("venturi")) {
    return {
      title: "Bernoulli's Principle & Fluid Continuity",
      directAnswer: `**Bernoulli's Principle states that along a streamline of moving fluid, an increase in fluid velocity occurs simultaneously with a decrease in static pressure:**
$$P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{constant}$$
Faster flowing fluid exerts less lateral pressure.`,
      principles: `- **Continuity Equation**: For an incompressible fluid through a varying cross-section, $A_1 v_1 = A_2 v_2 = \\text{constant}$ (mass conservation).
- **Venturi Effect**: Fluid speed surges and static pressure plunges when constricted through a narrow pipe throat.
- **Aerodynamic Lift**: Air travels faster over curved upper airfoil surfaces than flatter lower surfaces, creating lower pressure on top and generating upward aerodynamic lift.`,
      derivationOrSteps: `#### Derivation from Conservation of Energy / Work-Energy Theorem:
1. Work done by pressure forces on fluid volume $\\Delta V$:
   $$W_{\\text{net}} = (P_1 - P_2)\\Delta V$$
2. Change in kinetic energy:
   $$\\Delta K = \\frac{1}{2}m(v_2^2 - v_1^2) = \\frac{1}{2}\\rho \\Delta V (v_2^2 - v_1^2)$$
3. Change in gravitational potential energy:
   $$\\Delta U_g = m g (h_2 - h_1) = \\rho \\Delta V g (h_2 - h_1)$$
4. By the Work-Energy Theorem $W_{\\text{net}} = \\Delta K + \\Delta U_g$:
   $$(P_1 - P_2)\\Delta V = \\frac{1}{2}\\rho \\Delta V (v_2^2 - v_1^2) + \\rho g \\Delta V (h_2 - h_1)$$
5. Rearranging terms:
   $$P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2$$`,
      intuitionAndExamples: `Blow air horizontally over the top of a loose strip of paper. Instead of being pushed down, the strip lifts upward because high-speed air creates a low-pressure pocket above it!`,
      takeaways: [`Faster fluid velocity = Lower static pressure`, `Bernoulli: P + 1/2ρv² + ρgh = constant`]
    };
  }

  // Le Chatelier's Principle & Chemical Equilibrium
  if (q.includes("le chatelier") || q.includes("chemical equilibrium") || q.includes("haber process")) {
    return {
      title: "Chemical Equilibrium & Le Chatelier's Principle",
      directAnswer: `**Le Chatelier's Principle states that when a dynamic equilibrium is subjected to an external disturbance (change in concentration, temperature, or pressure), the system shifts its position to partially counteract that disturbance:**
$$aA + bB \\rightleftharpoons cC + dD \\quad (K_{eq} = \\frac{[C]^c [D]^d}{[A]^a [B]^b})$$`,
      principles: `- **Adding Reactants**: Shifts equilibrium right (forward) to consume excess reactants.
- **Increasing Pressure**: Shifts toward the side with fewer gas moles (e.g. Haber process: $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)$ has $4\\text{ moles} \\to 2\\text{ moles}$, so high pressure favors ammonia).
- **Increasing Temperature**: Shifts in the endothermic direction ($\Delta H > 0$) to absorb heat.`,
      derivationOrSteps: `#### Industrial Application: The Haber-Bosch Process
$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad (\\Delta H = -92.4\\text{ kJ/mol, Exothermic})$$
- **High Pressure (200 atm)**: Pushes equilibrium to the right ($4\\text{ gas moles} \\to 2\\text{ gas moles}$).
- **Moderate Temperature (450°C)**: Compromise between high yield (favored by low temperature) and practical reaction speed (catalyzed by iron).
- **Continuous ammonia condensation**: Removing product shifts the reaction forward continuously.`,
      intuitionAndExamples: `Carbonated soda cans: When sealed under high $\\text{CO}_2$ pressure, carbonic acid remains dissolved. When popped open, pressure drops drastically, shifting equilibrium to bubble $\\text{CO}_2$ gas out.`,
      takeaways: [`System counteracts external stresses`, `Catalysts increase reaction speed but do NOT change equilibrium position`]
    };
  }

  // Neurons, Action Potentials & Nervous System
  if (q.includes("neuron") || q.includes("action potential") || q.includes("synapse") || q.includes("nervous system")) {
    return {
      title: "Neurobiology: Neurons, Action Potentials & Synaptic Transmission",
      directAnswer: `**Neurons transmit electrical signals called action potentials along axons via voltage-gated ion channels:**
1. **Resting Membrane Potential**: $-70\\text{ mV}$ maintained by $\\text{Na}^+/\\text{K}^+$ ATPase pumps ($3\\text{ Na}^+$ pumped out, $2\\text{ K}^+$ pumped in).
2. **Depolarization**: Stimulus reaches threshold ($-55\\text{ mV}$), triggering voltage-gated $\\text{Na}^+$ channels to open; $\\text{Na}^+$ rushes inside up to $+40\\text{ mV}$.
3. **Repolarization**: $\\text{Na}^+$ channels inactivate, $\\text{K}^+$ channels open, releasing positive potassium to restore negative interior.`,
      principles: `- **All-or-None Principle**: Action potentials fire at full amplitude once the threshold is crossed, or not at all.
- **Myelin Sheath & Saltatory Conduction**: Oligodendrocytes/Schwann cells insulate axons; impulses jump rapidly across Nodes of Ranvier at speeds up to $120\\text{ m/s}$.
- **Chemical Synapse**: Action potential arrival opens voltage-gated $\\text{Ca}^{2+}$ channels, triggering exocytosis of neurotransmitters (dopamine, acetylcholine) across the $20\\text{ nm}$ synaptic cleft.`,
      derivationOrSteps: `#### Phases of an Action Potential:
1. **Resting State**: $-70\\text{ mV}$ (Interior rich in $\\text{K}^+$ and negative proteins, exterior rich in $\\text{Na}^+$).
2. **Threshold**: $-55\\text{ mV}$.
3. **Depolarization**: Rapid influx of $\\text{Na}^+$ spikes voltage to $+40\\text{ mV}$.
4. **Repolarization**: $\\text{K}^+$ efflux brings voltage back down.
5. **Hyperpolarization / Refractory Period**: Dips to $-80\\text{ mV}$ before $\\text{Na}^+/\\text{K}^+$ pumps restore resting equilibrium.`,
      intuitionAndExamples: `Touching a hot stove triggers a spinal sensory-motor reflex arc in 20 milliseconds, contracting your biceps muscle before the nerve impulse even finishes traveling up to your conscious cerebral cortex!`,
      takeaways: [`Resting potential: -70 mV; Threshold: -55 mV`, `Saltatory conduction jumps along Nodes of Ranvier`]
    };
  }

  // Vaccines & Immune System
  if (q.includes("vaccine") || q.includes("immune system") || q.includes("antibody") || q.includes("t cell") || q.includes("b cell")) {
    return {
      title: "Immunology: Innate vs Adaptive Immunity & Vaccine Mechanisms",
      directAnswer: `**The human immune system defends against pathogens using innate (immediate non-specific) and adaptive (targeted memory) branches:**
- **Innate Immunity**: Physical skin barriers, stomach acid, phagocytic macrophages, and natural killer cells.
- **Adaptive Immunity**: B-lymphocytes produce antigen-specific Y-shaped antibodies, while cytotoxic T-cells destroy infected host cells.
- **Vaccines**: Introduce harmless antigens or mRNA instructions to generate long-lived memory B and T cells without causing illness.`,
      principles: `- **Antigen-Antibody Binding**: High-affinity locks bind matching epitope keys to neutralize pathogens or mark them for destruction (opsonization).
- **Primary vs Secondary Immune Response**: First exposure takes 7-14 days to build antibodies. Second exposure triggers memory cells within 24-48 hours, producing 1,000× more antibodies.
- **mRNA Vaccines**: Deliver mRNA wrapped in lipid nanoparticles instructing ribosomes to synthesize harmless viral spike proteins.`,
      derivationOrSteps: `#### How Vaccines Create Immunological Memory:
1. **Introduction**: Vaccine introduces antigen (attenuated virus, protein subunit, or mRNA).
2. **Presentation**: Dendritic cells phagocytose antigen and present it on MHC-II proteins to helper T-cells ($CD4^+$).
3. **Activation**: Helper T-cells activate B-cells to undergo clonal expansion and somatic hypermutation.
4. **Differentiation**: B-cells form plasma cells (releasing antibodies) and memory B-cells.
5. **Lifelong Protection**: Memory cells survive in bone marrow for decades ready for instant defense.`,
      intuitionAndExamples: `Vaccinating a population confers **herd immunity**, preventing viral transmission chains and protecting newborns and immunocompromised patients who cannot receive certain vaccines.`,
      takeaways: [`Innate = fast/general; Adaptive = specific/memory`, `Memory cells confer rapid secondary immune responses`]
    };
  }

  // Exoplanets & Habitable Goldilocks Zone
  if (q.includes("exoplanet") || q.includes("goldilocks") || q.includes("habitable zone") || q.includes("trappist")) {
    return {
      title: "Exoplanets, Habitable Goldilocks Zones & Transit Detection",
      directAnswer: `**An exoplanet is any planet orbiting a star beyond our Solar System. The circumstellar Habitable Zone ('Goldilocks Zone') is the orbital sweet spot where stellar irradiation allows liquid water to persist on the planet's surface without freezing or boiling away:**
$$R_{\\text{habitable}} \\approx \\sqrt{\\frac{L_*}{L_{\\odot}}} \\text{ AU}$$
where $L_*$ is the host star's luminosity relative to our Sun.`,
      principles: `- **Transit Photometry (Kepler/TESS)**: When a planet passes directly between its star and our telescope, it blocks a fraction of starlight:
  $$\\frac{\\Delta F}{F} = \\left(\\frac{R_p}{R_*}\\right)^2$$
- **Radial Velocity (Doppler Wobble)**: Planet's gravitational tug causes host star to wobble, creating periodic red/blue Doppler shifts in starlight spectra.
- **Atmospheric Transmission Spectroscopy**: Starlight filtering through the exoplanet's atmosphere reveals water vapor, methane, and oxygen absorption lines.`,
      derivationOrSteps: `#### Calculating Habitable Distance from Star Luminosity:
1. Solar flux arriving at distance $d$: $S = \\frac{L_*}{4\\pi d^2}$.
2. For Earth, $S_0 = 1361\\text{ W/m}^2$ at $d = 1\\text{ AU}$.
3. For an alien planet to receive the equivalent flux:
   $$\\frac{L_*}{d^2} = \\frac{L_{\\odot}}{(1\\text{ AU})^2} \\implies d = \\sqrt{\\frac{L_*}{L_{\\odot}}}\\text{ AU}$$
- For a red dwarf star with $L_* = 0.01 L_\\odot$, the habitable zone is much closer: $d = \\sqrt{0.01} = 0.1\\text{ AU}$.`,
      intuitionAndExamples: `The TRAPPIST-1 system hosts 7 Earth-sized rocky planets orbiting an ultracool dwarf star, with three planets (TRAPPIST-1e, f, g) nestled right in the liquid water habitable zone!`,
      takeaways: [`Transit dip: ΔF/F = (Rp/R*)²`, `Habitable zone scales as √(L_star / L_sun)`]
    };
  }

  // Calculus: Derivatives & Power Rule
  if (q.includes("derivative") || q.includes("power rule") || (q.includes("calculus") && (q.includes("rate") || q.includes("slope")))) {
    return {
      title: "Differential Calculus: The Derivative & Power Rule Derivation",
      directAnswer: `**The derivative $f'(x)$ or $\\frac{df}{dx}$ measures the instantaneous rate of change of a function—the exact slope of the tangent line at point $x$:**
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$
For any power function $f(x) = x^n$, the Power Rule gives:
$$\\frac{d}{dx}\\left[x^n\\right] = n x^{n-1}$$`,
      principles: `- **Core Rules**:
  - Constant Rule: $\\frac{d}{dx}[c] = 0$
  - Sum Rule: $(f + g)' = f' + g'$
  - Product Rule: $(uv)' = u'v + uv'$
  - Chain Rule: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$
- **Geometric Meaning**: Slope of the curve tangent line at $(x, f(x))$.
- **Physics Meaning**: If position is $s(t)$, velocity is $v(t) = s'(t)$, and acceleration is $a(t) = v'(t) = s''(t)$.`,
      derivationOrSteps: `#### Derivation of the Power Rule using Binomial Expansion:
1. Start from limit definition for $f(x) = x^n$:
   $$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}$$
2. Expand $(x+h)^n$ using the Binomial Theorem:
   $$(x+h)^n = x^n + n x^{n-1}h + \\frac{n(n-1)}{2}x^{n-2}h^2 + \\dots + h^n$$
3. Substitute back and subtract $x^n$:
   $$\\frac{(x+h)^n - x^n}{h} = \\frac{n x^{n-1}h + \\frac{n(n-1)}{2}x^{n-2}h^2 + \\dots + h^n}{h}$$
4. Divide through by $h$:
   $$= n x^{n-1} + \\frac{n(n-1)}{2}x^{n-2}h + \\dots + h^{n-1}$$
5. Take the limit as $h \\to 0$:
   $$f'(x) = n x^{n-1}$$`,
      intuitionAndExamples: `If your car travels distance $s(t) = 5t^2$ meters, at $t = 3\\text{ seconds}$, the instantaneous speedometer reads $v(3) = s'(3) = 10(3) = 30\\text{ m/s}$ (about $108\\text{ km/h}$).`,
      takeaways: [`Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹`, `Derivative gives instantaneous slope and rate of change`]
    };
  }

  // Normal Distribution & Central Limit Theorem
  if (q.includes("normal distribution") || q.includes("central limit theorem") || q.includes("bell curve") || q.includes("standard deviation")) {
    return {
      title: "Probability & Statistics: Normal Distribution & Central Limit Theorem",
      directAnswer: `**The Normal (Gaussian) Distribution is a symmetric, bell-shaped probability distribution defined by mean $\\mu$ and standard deviation $\\sigma$:**
$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$
The **Central Limit Theorem (CLT)** proves that the sum (or average) of many independent random variables naturally converges to a normal distribution, regardless of the underlying distribution shape!`,
      principles: `- **68–95–99.7 Empirical Rule**:
  - $\\approx 68.27\\%$ of values lie within $\\mu \\pm 1\\sigma$.
  - $\\approx 95.45\\%$ of values lie within $\\mu \\pm 2\\sigma$.
  - $\\approx 99.73\\%$ of values lie within $\\mu \\pm 3\\sigma$.
- **Standard Normal ($Z$-score)**: $Z = \\frac{x - \\mu}{\\sigma}$ with $\\mu = 0, \\sigma = 1$.
- **Standard Error of the Mean**: $\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}$.`,
      derivationOrSteps: `#### Why the Central Limit Theorem is Fundamental:
1. Let $X_1, X_2, \\dots, X_n$ be independent random variables drawn from ANY distribution with finite mean $\\mu$ and variance $\\sigma^2$.
2. The sample mean is $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i$.
3. As $n \\to \\infty$, the standardized variable:
   $$Z_n = \\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$$
This is why test scores, poll survey averages, and physical measurement uncertainties are normally distributed!`,
      intuitionAndExamples: `Roll a single 6-sided die: it has a flat, uniform distribution ($1$ to $6$ equally likely). But roll 10 dice and average their sum: the resulting distribution forms a smooth Gaussian bell curve centered at $3.5$!`,
      takeaways: [`68-95-99.7 rule for standard deviations`, `CLT: sample averages converge to a normal distribution`]
    };
  }

  return null;
}
