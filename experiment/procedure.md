### Procedure

Welcome to the fascinating world of modular arithmetic and its applications in cryptography! In this experiment, you'll explore how mathematical concepts that might seem abstract at first are actually the foundation of modern digital security. Get ready to become a cryptography detective!

#### Step 1: Understanding the Basics - Prime Number Selection

1. **Prime Number Generation**: 
   - Start the simulation by clicking the "Generate Prime Numbers" button
   - The system will display two prime numbers (p and q) - these are your building blocks!
   - **Fun Fact**: Prime numbers are like the atoms of mathematics - they can't be broken down further by multiplication!
   - Observe how the system checks for primality using trial division
   - Try generating different sets of prime numbers and notice their randomness

2. **Calculate n = p × q**:
   - Click "Calculate n" to compute the product of your two primes
   - This value 'n' becomes part of both your public and private keys
   - **Important**: Record the values of p, q, and n in the provided table

#### Step 2: Euler's Totient Function - The Heart of RSA

3. **Understanding φ(n)**:
   - Click "Calculate Totient Function" to compute φ(n) = (p-1) × (q-1)
   - **Fun Fact**: Euler's totient function counts how many numbers less than n are coprime to n!
   - Watch the visualization show which numbers are coprime to n
   - This function is crucial for generating secure keys

#### Step 3: Key Generation - Creating Your Cryptographic Identity

4. **Select Public Exponent (e)**:
   - Choose a value for 'e' from the dropdown menu (commonly 3, 17, or 65537)
   - **Requirement**: e must be coprime to φ(n), meaning gcd(e, φ(n)) = 1
   - The system will verify this condition and highlight valid choices
   - **Fun Fact**: 65537 is popular because it's a Fermat prime (2^16 + 1)!

5. **Calculate Private Exponent (d)**:
   - Click "Find Private Key" to compute d, where e × d ≡ 1 (mod φ(n))
   - Watch the Extended Euclidean Algorithm visualization find the modular inverse
   - **Important**: This is your secret key - in real life, never share this!
   - The system will show step-by-step how d is calculated

#### Step 4: The Magic of Encryption - Securing Your Message

6. **Message Input**:
   - Enter a simple message (numbers only for this simulation)
   - Ensure your message value is less than n for proper encryption
   - **Tip**: Start with small numbers like 42 or 123 to see clear patterns

7. **Encryption Process**:
   - Click "Encrypt Message" to apply the formula: C = M^e mod n
   - Watch the modular exponentiation animation
   - **Fun Fact**: The message is raised to the power of e, but we only keep the remainder when divided by n!
   - Observe how even small changes in the message create completely different ciphertext

#### Step 5: The Art of Decryption - Revealing the Secret

8. **Decryption Process**:
   - Click "Decrypt Message" to apply: M = C^d mod n
   - Marvel at how the original message magically reappears!
   - **Mathematical Beauty**: This works because of Euler's theorem: M^(φ(n)) ≡ 1 (mod n)

#### Step 6: Interactive Exploration and Analysis

9. **Parameter Experimentation**:
   - Try different prime numbers and observe how it affects key generation
   - Experiment with different values of 'e' and see the impact on 'd'
   - **Challenge**: Can you predict what happens with larger primes?

10. **Security Analysis**:
    - Use the "Factor n" button to see how difficult it is to break the encryption
    - **Fun Fact**: With small primes, factoring is easy, but with large primes (hundreds of digits), it would take longer than the age of the universe!
    - Compare encryption/decryption times with different key sizes

#### Step 7: Real-World Connection

11. **Practical Applications**:
    - Click "Show Applications" to see where RSA is used in everyday life
    - **Examples**: HTTPS websites, email encryption, digital signatures
    - **Mind-Blowing Fact**: Every time you see that little lock icon in your browser, mathematics similar to what you just performed is protecting your data!

#### Verification and Recording

12. **Document Your Results**:
    - Complete the observation table with all calculated values
    - Verify that decryption produces the original message
    - **Double-Check**: Ensure that e × d ≡ 1 (mod φ(n)) using the verification tool