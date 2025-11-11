
document.addEventListener('DOMContentLoaded', function() {
  // --- Gameified RSA Adventure ---
  // Primes, state, helpers
  const PRIMES = [5,7,11,13,17,19,23,29,31,37,41,43,47];
  let p = null, q = null, n = null, phi = null, e = null, d = null;
  let userMessage = '', ciphertext = null, decrypted = null;

  // Math helpers
  function gcd(a, b) { while (b !== 0) [a, b] = [b, a % b]; return a; }
  function modinv(a, m) {
    let m0 = m, x0 = 0, x1 = 1, steps = [], origA = a, origM = m;
    if (m === 1) {
      steps.push("Since the modulus is 1, every number is congruent to 0 mod 1. The inverse does not exist.");
      return [0, steps];
    }
    steps.push(`We want to find an integer x such that ${origA} × x ≡ 1 (mod ${origM}).`);
    steps.push("Let's use the Extended Euclidean Algorithm to find this inverse.");
    let stepNum = 1;
    while (a > 1) {
      let q = Math.floor(a / m), t = m;
      steps.push(`Step ${stepNum}: a = ${a}, m = ${m}`);
      steps.push(`\u2192 Divide a by m: ${a} ÷ ${m} = ${q} remainder ${a % m}`);
      steps.push(`\u2192 Update a and m: a = m (${m}), m = a % m (${a % m})`);
      m = a % m; a = t; t = x0;
      let prevX0 = x0, prevX1 = x1;
      x0 = x1 - q * x0; x1 = t;
      steps.push(`\u2192 Update coefficients: x0 = x1 - q × x0 = ${prevX1} - ${q} × ${prevX0} = ${x0}, x1 = ${x1}`);
      stepNum++;
    }
    if (x1 < 0) {
      steps.push(`The result x1 = ${x1} is negative. Add the modulus ${m0} to get a positive inverse.`);
      x1 += m0;
    }
    steps.push(`\u2714 The modular inverse is ${x1}, because ${origA} × ${x1} ≡ 1 (mod ${m0}).`);
    steps.push("This means multiplying by this number 'undoes' the effect of multiplying by the original number, modulo the chosen modulus.");
    return [x1, steps];
  }
  function modexp(base, exp, mod, stepCb) {
    let result = 1, steps = [], bit = 0;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
        steps.push(`Bit ${bit}: result = (result × base) % mod = ${result}`);
      } else {
        steps.push(`Bit ${bit}: result unchanged = ${result}`);
      }
      base = (base * base) % mod;
      steps.push(`Bit ${bit}: base = (base × base) % mod = ${base}`);
      exp = Math.floor(exp / 2);
      bit++;
    }
    if (stepCb) stepCb(steps);
    return result;
  }
  function updateNandPhi() {
    n = p * q;
    phi = (p - 1) * (q - 1);
  }
  function getEOptions(phi) {
    let options = [];
    for (let candidate = 3; candidate < phi; candidate += 2) {
      if (gcd(candidate, phi) === 1) options.push(candidate);
    }
    return options;
  }

  // --- Game Stages ---
  let stage = 0;
  const stages = [
    'briefing', 'pickPrimes', 'buildLock', 'pickE', 'forgeD', 'encrypt', 'send', 'decrypt', 'success'
  ];
  const gameStage = document.getElementById('gameStage');
  const progressBar = document.getElementById('progressBar');

  function renderStage() {
    progressBar.style.width = `${Math.floor((stage/(stages.length-1))*100)}%`;
    switch(stages[stage]) {
      case 'briefing':
        gameStage.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f393.png" class="w-24 h-24 mb-2 animate-bounce-slow"/>
            <div class="bg-white rounded-xl shadow-lg px-6 py-4 mb-4 text-lg font-semibold text-indigo-700">Mission: Send a Secret Message to Agent Q!</div>
            <div class="text-gray-700 mb-4">Prof. Cipher needs your help to send a top-secret message. But beware! Spies are everywhere. We must use a magic lock called RSA to keep it safe.</div>
            <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-lg mt-2" id="startMission">Start Mission</button>
          </div>
        `;
        document.getElementById('startMission').onclick = () => { stage++; renderStage(); };
        break;
      case 'pickPrimes':
        let primeBtns = PRIMES.map(pr => `<button class="prime-stone" data-prime="${pr}">${pr}</button>`).join(' ');
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 1: Find the Magic Stones</div>
            <div class="text-gray-700 mb-2">Pick <b>two different</b> magic stones (primes) for the lock.</div>
            <div class="flex flex-wrap gap-3 justify-center mb-4">${primeBtns}</div>
            <div class="flex gap-4 mb-2">
              <div class="picked-stone" id="pickedP">?</div>
              <div class="picked-stone" id="pickedQ">?</div>
            </div>
            <div id="primeError" class="text-red-600 text-sm font-semibold mb-2" style="display:none"></div>
            <button class="btn bg-indigo-600 text-white px-4 py-2 rounded mt-2" id="confirmPrimes" disabled>Next</button>
          </div>
        `;
        let pickedP = null, pickedQ = null;
        document.querySelectorAll('.prime-stone').forEach(btn => {
          btn.onclick = () => {
            let val = +btn.dataset.prime;
            if (!pickedP) {
              pickedP = val;
              document.getElementById('pickedP').textContent = val;
              btn.disabled = true;
            } else if (!pickedQ) {
              if (val === pickedP) {
                let err = document.getElementById('primeError');
                err.textContent = "You can't pick the same stone twice!";
                err.style.display = '';
                return;
              }
              pickedQ = val;
              document.getElementById('pickedQ').textContent = val;
              btn.disabled = true;
              document.getElementById('primeError').style.display = 'none';
            }
            if (pickedP && pickedQ) {
              document.getElementById('confirmPrimes').disabled = false;
            }
          };
        });
        document.getElementById('confirmPrimes').onclick = () => {
          p = pickedP; q = pickedQ; stage++; renderStage();
        };
        break;
      case 'buildLock':
        updateNandPhi();
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 2: Build the Magic Lock</div>
            <div class="text-gray-700 mb-2">Type the answers for <b>n = p × q</b> and <b>ϕ(n) = (p-1) × (q-1)</b> to build the lock and keyhole.</div>
            <div class="flex gap-6 mt-4 mb-4">
              <div class="stone-show">p = <span>${p}</span></div>
              <div class="stone-show">q = <span>${q}</span></div>
            </div>
            <div class="lock-anim mb-2">🔒</div>
            <form id="lockForm" class="flex flex-col gap-2 items-center w-full max-w-xs mx-auto">
              <label class="text-indigo-700 font-bold">n = <span>${p}</span> × <span>${q}</span> = <input id="nInput" type="number" class="border rounded px-2 py-1 w-20 text-center" /></label>
              <label class="text-purple-700 font-bold">ϕ(n) = (<span>${p}</span>-1) × (<span>${q}</span>-1) = <input id="phiInput" type="number" class="border rounded px-2 py-1 w-20 text-center" /></label>
              <div id="lockError" class="text-red-600 text-sm font-semibold mb-2" style="display:none"></div>
              <button type="submit" class="btn bg-indigo-600 text-white px-4 py-2 rounded mt-2">Check</button>
            </form>
          </div>
        `;
        document.getElementById('lockForm').onsubmit = (e) => {
          e.preventDefault();
          let nRaw = document.getElementById('nInput').value;
          let phiRaw = document.getElementById('phiInput').value;
          let nVal = +nRaw;
          let phiVal = +phiRaw;
          let err = document.getElementById('lockError');
          if (nRaw.trim() === '' || isNaN(nVal) || phiRaw.trim() === '' || isNaN(phiVal)) {
            err.textContent = 'Please enter valid numbers for both n and ϕ(n)!';
            err.style.display = '';
            return;
          }
          if (nVal !== n && phiVal !== phi) {
            err.textContent = 'Both answers are incorrect! Try again.';
            err.style.display = '';
            return;
          }
          if (nVal !== n) {
            err.textContent = 'n is incorrect! Try again.';
            err.style.display = '';
            return;
          }
          if (phiVal !== phi) {
            err.textContent = 'ϕ(n) is incorrect! Try again.';
            err.style.display = '';
            return;
          }
          err.style.display = 'none';
          stage++;
          renderStage();
        };
        break;
      case 'pickE':
        // Reduce e options: 3 valid coprimes, 2 decoys
        let eOptionsAll = getEOptions(phi);
        let eOptions = [];
        // Randomly pick 3 valid coprimes
        let eOptionsCopy = [...eOptionsAll];
        while (eOptions.length < 3 && eOptionsCopy.length > 0) {
          let idx = Math.floor(Math.random() * eOptionsCopy.length);
          eOptions.push(eOptionsCopy.splice(idx, 1)[0]);
        }
        // Add up to 2 decoys (not coprime)
        let decoys = [];
        for (let i = 2; i < phi && decoys.length < 2; i++) {
          if (gcd(i, phi) !== 1 && !eOptions.includes(i) && !decoys.includes(i)) decoys.push(i);
        }
        let allE = [...eOptions, ...decoys].sort(() => Math.random() - 0.5);
        let eBtns = allE.map(val => `<button class="key-btn" data-e="${val}">${val}</button>`).join(' ');
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 3: Choose the Public Key</div>
            <div class="text-gray-700 mb-2">Pick a key (e) that fits the lock. Only some keys will work!</div>
            <div class="flex flex-wrap gap-3 justify-center mb-4">${eBtns}</div>
            <div class="picked-key mt-2">e = <span id="pickedE">?</span></div>
            <div id="eError" class="text-red-600 text-sm font-semibold mb-2" style="display:none"></div>
            <button class="btn bg-indigo-600 text-white px-4 py-2 rounded mt-2" id="confirmE" disabled>Next</button>
          </div>
        `;
        let pickedE = null;
        document.querySelectorAll('.key-btn').forEach(btn => {
          btn.onclick = () => {
            pickedE = +btn.dataset.e;
            document.getElementById('pickedE').textContent = pickedE;
            document.getElementById('confirmE').disabled = false;
            document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('eError').style.display = 'none';
          };
        });
        document.getElementById('confirmE').onclick = () => {
          if (gcd(pickedE, phi) !== 1) {
            let err = document.getElementById('eError');
            err.textContent = "This key doesn't fit the lock! (Not coprime with ϕ(n))";
            err.style.display = '';
            return;
          }
          e = pickedE; stage++; renderStage();
        };
        break;
      case 'forgeD':
        let [dVal, dSteps] = modinv(e, phi);
        d = dVal;
        // Add decoy d options
        let decoyDs = [];
        for (let i = 2; i < phi && decoyDs.length < 2; i++) {
          if (i !== d && (e * i) % phi !== 1 && !decoyDs.includes(i)) decoyDs.push(i);
        }
        let dOptions = [d, ...decoyDs].sort(() => Math.random() - 0.5);
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 4: Forge the Secret Key</div>
            <div class="text-gray-700 mb-2">Type the value of <b>d</b> so that <b>e × d ≡ 1 (mod ϕ(n))</b>.</div>
            <div class="key-forge-anim mb-2">🛠️</div>
            <div class="text-indigo-700 font-bold">e = ${e}</div>
            <div class="text-purple-700 font-bold">ϕ(n) = ${phi}</div>
            <form id="dForm" class="flex flex-col gap-2 items-center w-full max-w-xs mx-auto">
              <label class="text-green-700 font-bold">d = <input id="dInput" type="number" class="border rounded px-2 py-1 w-20 text-center" /></label>
              <div id="dError" class="text-red-600 text-sm font-semibold mb-2" style="display:none"></div>
              <button type="submit" class="btn bg-indigo-600 text-white px-4 py-2 rounded mt-2">Check</button>
            </form>
            <button class="btn bg-gray-200 text-gray-700 px-3 py-1 rounded mt-2 text-sm" id="showDHint">Show Hint</button>
            <div id="dHintBox" class="bg-gray-50 rounded p-2 mt-2 text-xs text-gray-700 text-left max-w-md mx-auto" style="display:none;">${dSteps.map(s=>`<div>${s}</div>`).join('')}</div>
          </div>
        `;
        document.getElementById('dForm').onsubmit = (eForm) => {
          eForm.preventDefault();
          let dRaw = document.getElementById('dInput').value;
          let dUser = +dRaw;
          let err = document.getElementById('dError');
          if (dRaw.trim() === '' || isNaN(dUser)) {
            err.textContent = 'Please enter a valid number for d!';
            err.style.display = '';
            return;
          }
          if (dUser !== d) {
            err.textContent = 'That is not the correct modular inverse! Try again.';
            err.style.display = '';
            return;
          }
          err.style.display = 'none';
          stage++;
          renderStage();
        };
        document.getElementById('showDHint').onclick = () => {
          document.getElementById('dHintBox').style.display = '';
          document.getElementById('showDHint').style.display = 'none';
        };
        break;
      case 'encrypt':
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 5: Encrypt the Message</div>
            <div class="text-gray-700 mb-2">Type your secret message (a number less than n) and lock it in the magic box!</div>
            <input type="number" id="userMsgInput" min="0" max="${n-1}" class="border border-gray-300 rounded px-2 py-1 text-center text-lg mb-2" placeholder="Enter number < ${n}" style="width:120px;" />
            <div id="msgError" class="text-red-600 text-sm font-semibold mb-2" style="display:none"></div>
            <button class="btn bg-blue-600 text-white px-4 py-2 rounded mt-2" id="encryptMsg">Lock Message</button>
            <div class="magic-box mt-4">🧰</div>
            <div class="ciphertext mt-2 text-indigo-700 font-bold text-lg" id="cipherShow"></div>
          </div>
        `;
        const userMsgInput = document.getElementById('userMsgInput');
        const msgError = document.getElementById('msgError');
        userMsgInput.addEventListener('input', () => {
          let raw = userMsgInput.value;
          let val = +raw;
          if (raw.trim() === '' || isNaN(val) || /[^0-9]/.test(raw) || val < 0 || val >= n) {
            msgError.textContent = `Oops! Message must be a number between 0 and ${n-1}.`;
            msgError.style.display = '';
          } else {
            msgError.style.display = 'none';
          }
        });
        document.getElementById('encryptMsg').onclick = () => {
          let raw = userMsgInput.value;
          let val = +raw;
          if (raw.trim() === '' || isNaN(val) || /[^0-9]/.test(raw) || val < 0 || val >= n) {
            msgError.textContent = `Oops! Message must be a number between 0 and ${n-1}.`;
            msgError.style.display = '';
            return;
          }
          msgError.style.display = 'none';
          userMessage = val;
          let steps = [];
          ciphertext = modexp(userMessage, e, n, s => steps = s);
          document.getElementById('cipherShow').innerHTML = `🔒 Ciphertext: <span>${ciphertext}</span>`;
          setTimeout(()=>{ stage++; renderStage(); }, 1200);
        };
        break;
      case 'send':
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <div class="text-lg font-bold text-indigo-700 mb-2">Step 6: Send the Secret Box</div>
            <div class="text-gray-700 mb-2">Agent Q receives the magic box. Can they open it?</div>
            <div class="flex gap-4 mt-4 mb-4">
              <div class="stone-show">n = <span>${n}</span></div>
              <div class="stone-show">e = <span>${e}</span></div>
              <div class="stone-show">d = <span>${d}</span></div>
            </div>
            <div class="magic-box mb-2 animate-bounce-slow">🧰</div>
            <button class="btn bg-purple-600 text-white px-4 py-2 rounded mt-2" id="toDecrypt">Open the Box</button>
          </div>
        `;
        document.getElementById('toDecrypt').onclick = () => { stage++; renderStage(); };
        break;
      case 'decrypt':
        let quizSteps = [];
        let quizResult = 1, quizBase = ciphertext % n, quizExp = d, quizBit = 0;
        let quizBits = [];
        let tmpExp = quizExp;
        while (tmpExp > 0) {
          quizBits.push(tmpExp % 2);
          tmpExp = Math.floor(tmpExp / 2);
        }
        // Build quiz steps (simulate modexp, but don't reveal results)
        let quizState = [];
        let qResult = 1, qBase = quizBase, qExp = d, qBit = 0;
        tmpExp = d;
        while (tmpExp > 0) {
          let isOdd = tmpExp % 2 === 1;
          quizState.push({
            bit: qBit,
            isOdd,
            base: qBase,
            result: qResult,
            exp: tmpExp
          });
          if (isOdd) qResult = (qResult * qBase) % n;
          qBase = (qBase * qBase) % n;
          tmpExp = Math.floor(tmpExp / 2);
          qBit++;
        }
        let quizIndex = 0;
        function renderBaseQuestion(s, onNext) {
          let baseSection = document.getElementById('quizBaseSection');
          baseSection.style.display = '';
          baseSection.innerHTML = `<div class='mb-2'>Now, calculate <b>base = (base × base) % n</b></div>
            <div class='mb-2'>base = <b>${s.base}</b>, n = <b>${n}</b></div>
            <input id='quizBaseInput' type='number' class='border rounded px-2 py-1 w-32 text-center mb-2' placeholder='Enter new base' />
            <div id='quizBaseError' class='text-red-600 text-sm font-semibold mb-2' style='display:none'></div>
            <button class='btn bg-green-600 text-white px-4 py-2 rounded mt-2' id='quizBaseNext'>Check & Next</button>`;
          document.getElementById('quizBaseNext').onclick = () => {
            let errB = document.getElementById('quizBaseError');
            let baseRaw = document.getElementById('quizBaseInput').value;
            let baseUser = +baseRaw;
            if (baseRaw.trim() === '' || isNaN(baseUser)) {
              errB.textContent = 'Please enter a valid number for new base!';
              errB.style.display = '';
              return;
            }
            let correctBase = (s.base * s.base) % n;
            if (baseUser !== correctBase) {
              errB.textContent = `Incorrect! (base × base) % n = (${s.base} × ${s.base}) % ${n} = ${correctBase}`;
              errB.style.display = '';
              return;
            }
            errB.style.display = 'none';
            onNext();
          };
        }

        function renderDecryptQuiz() {
          let s = quizState[quizIndex];
          let quizHtml = `<div class='flex flex-col items-center text-center'>
            <div class='text-lg font-bold text-indigo-700 mb-2'>Step 7: Decrypt the Message</div>
            <div class='text-gray-700 mb-2'>Agent Q uses the secret key to open the box and reveal the message!<br><span class='text-xs text-gray-500'>(Bit ${s.bit}, exp=${s.exp}, base=${s.base}, result so far=${s.result})</span></div>
            <div class='magic-box mb-2'>🧰</div>`;
          if (s.isOdd) {
            quizHtml += `<div class='mb-2'>Bit ${s.bit} is <b>1</b>: Calculate <b>(result × base) % n</b></div>`;
            quizHtml += `<div class='mb-2'>result so far = <b>${s.result}</b>, base = <b>${s.base}</b>, n = <b>${n}</b></div>`;
            quizHtml += `<input id='quizInput' type='number' class='border rounded px-2 py-1 w-32 text-center mb-2' placeholder='Enter new result' />`;
            quizHtml += `<div id='quizError' class='text-red-600 text-sm font-semibold mb-2' style='display:none'></div>`;
            quizHtml += `<button class='btn bg-blue-600 text-white px-4 py-2 rounded mt-2' id='quizResultNext'>Check Result</button>`;
            quizHtml += `<div id='quizBaseSection' style='display:none'></div>`;
          } else {
            quizHtml += `<div class='mb-2'>Bit ${s.bit} is <b>0</b>: Result unchanged</div>`;
            quizHtml += `<div class='mb-2'>result so far = <b>${s.result}</b></div>`;
            quizHtml += `<div id='quizBaseSection'></div>`;
          }
          quizHtml += `</div>`;
          gameStage.innerHTML = quizHtml;
          if (s.isOdd) {
            document.getElementById('quizResultNext').onclick = () => {
              let err = document.getElementById('quizError');
              let quizRaw = document.getElementById('quizInput').value;
              let quizUser = +quizRaw;
              if (quizRaw.trim() === '' || isNaN(quizUser)) {
                err.textContent = 'Please enter a valid number for new result!';
                err.style.display = '';
                return;
              }
              let correctResult = (s.result * s.base) % n;
              if (quizUser !== correctResult) {
                err.textContent = `Incorrect! (result × base) % n = (${s.result} × ${s.base}) % ${n} = ${correctResult}`;
                err.style.display = '';
                return;
              }
              err.style.display = 'none';
              document.getElementById('quizResultNext').disabled = true;
              document.getElementById('quizInput').disabled = true;
              renderBaseQuestion(s, () => {
                quizIndex++;
                if (quizIndex < quizState.length) {
                  renderDecryptQuiz();
                } else {
                  renderDecryptFinal();
                }
              });
            };
          } else {
            renderBaseQuestion(s, () => {
              quizIndex++;
              if (quizIndex < quizState.length) {
                renderDecryptQuiz();
              } else {
                renderDecryptFinal();
              }
            });
          }
        }
        function renderDecryptFinal() {
          let steps = [];
          decrypted = modexp(ciphertext, d, n, s => steps = s);
          gameStage.innerHTML = `
            <div class='flex flex-col items-center text-center'>
              <div class='text-lg font-bold text-indigo-700 mb-2'>Decryption Complete!</div>
              <div class='text-gray-700 mb-2'>Agent Q opens the box and reveals the message!</div>
              <div class='magic-box mb-2'>🧰 ➡️ <span class='text-green-700 font-bold'>${decrypted}</span></div>
              <div class='bg-gray-50 rounded p-2 mt-2 text-xs text-gray-700 text-left max-w-md mx-auto'>
                <b>How did we get this answer?</b><br>
                <ul class='list-disc pl-5'>
                  <li>We used the secret key <b>d</b> and the ciphertext to perform modular exponentiation: <b>message = ciphertext<sup>d</sup> mod n</b>.</li>
                  <li>At each step, we squared the base and, if the bit was 1, multiplied the result by the base, always taking mod n.</li>
                  <li>By following all these steps, we reversed the encryption and recovered the original message!</li>
                </ul>
                <details class='mt-2'><summary class='cursor-pointer text-indigo-700'>Show all calculation steps</summary>
                  ${steps.map(s=>`<div>${s}</div>`).join('')}
                </details>
              </div>
              <button class='btn bg-green-600 text-white px-4 py-2 rounded mt-4' id='toSuccess'>Finish</button>
            </div>
          `;
          document.getElementById('toSuccess').onclick = () => { stage++; renderStage(); };
        }
        renderDecryptQuiz();
        break;
      case 'success':
        gameStage.innerHTML = `
          <div class="flex flex-col items-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png" class="w-24 h-24 mb-2 animate-bounce-slow"/>
            <div class="bg-white rounded-xl shadow-lg px-6 py-4 mb-4 text-lg font-semibold text-green-700">Mission Complete!</div>
            <div class="text-gray-700 mb-4">Agent Q received your secret message: <span class="font-bold text-indigo-700">${userMessage}</span></div>
            <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-lg mt-2" id="restartGame">Play Again</button>
          </div>
        `;
        document.getElementById('restartGame').onclick = () => { location.reload(); };
        break;
    }
  }

  renderStage();
});

