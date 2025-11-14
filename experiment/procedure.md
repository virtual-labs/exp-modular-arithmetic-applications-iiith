### Procedure

Welcome to the RSA Cryptosystem simulation! This interactive experiment will guide you through the complete process of implementing the RSA encryption algorithm step by step. You will take on the role of a cryptography agent working to send secure messages using mathematical principles of modular arithmetic.

#### Mission Overview

The simulation presents an RSA adventure where you must help Professor Cipher send a secret message to Agent Q using the RSA cryptosystem. The interface includes a progress bar showing your advancement through 8 distinct stages of the RSA process.

#### Stage 1: Prime Number Selection (Finding the Magic Stones)

1. **Start the Mission**: 
   - Click the "Start Mission" button to begin the RSA simulation
   - The interface will present you with a selection of prime numbers displayed as circular buttons

2. **Select Two Different Prime Numbers**:
   - You will see prime numbers: 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
   - Click on your first prime number (p) - it will appear in the first selection box
   - Click on a different prime number for your second choice (q) - it will appear in the second selection box
   - **Important**: You cannot select the same prime number twice
   - **Fun Fact**: Prime numbers are fundamental building blocks in cryptography because they have exactly two factors: 1 and themselves

3. **Confirm Your Selection**:
   - Once both primes are selected, the "Next" button will become active
   - Click "Next" to proceed with your chosen prime numbers p and q

#### Stage 2: Building the Cryptographic Foundation (Build the Magic Lock)

4. **Calculate n (RSA Modulus)**:
   - The simulation will display your selected primes p and q
   - Calculate n = p × q using mental math or a calculator
   - Enter your calculated value in the input field labeled "n = p × q = "

5. **Calculate φ(n) (Euler's Totient Function)**:
   - Calculate φ(n) = (p-1) × (q-1) 
   - Enter your calculated value in the input field labeled "φ(n) = (p-1) × (q-1) = "
   - **Fun Fact**: Euler's totient function φ(n) counts the positive integers up to n that are relatively prime to n

6. **Verify Your Calculations**:
   - Click the "Check" button to verify both calculations
   - If incorrect, error messages will guide you to the correct answers
   - Both values must be correct to proceed to the next stage

#### Stage 3: Public Key Selection (Choose the Public Key)

7. **Understanding the Public Exponent**:
   - The simulation will present you with several candidate values for the public exponent e
   - These options include both valid choices (coprime to φ(n)) and invalid decoys

8. **Select a Valid Public Exponent (e)**:
   - Click on one of the presented numbers to select it as your public exponent
   - **Mathematical Requirement**: The chosen e must satisfy gcd(e, φ(n)) = 1
   - Your selection will be validated automatically

9. **Confirm Your Choice**:
   - If your selection is valid (coprime to φ(n)), you can proceed
   - If invalid, an error message will appear: "This key doesn't fit the lock! (Not coprime with φ(n))"
   - Select a different value until you find a valid public exponent
   - Click "Next" once a valid e is selected

#### Stage 4: Private Key Generation (Forge the Secret Key)

10. **Calculate the Private Exponent (d)**:
    - You must find d such that e × d ≡ 1 (mod φ(n))
    - This means d is the modular multiplicative inverse of e modulo φ(n)
    - Enter your calculated value for d in the input field

11. **Use the Hint System** (if needed):
    - Click "Show Hint" to reveal the step-by-step Extended Euclidean Algorithm calculation
    - The hint shows the complete process of finding the modular inverse
    - **Fun Fact**: The Extended Euclidean Algorithm not only finds the greatest common divisor but also the coefficients that express it as a linear combination

12. **Verify the Private Key**:
    - Click "Check" to validate your calculated d value
    - The system will confirm if d is the correct modular inverse
    - You must enter the exact correct value to proceed

#### Stage 5: Message Encryption (Lock the Message)

13. **Enter Your Secret Message**:
    - Input a numerical message in the text field
    - **Constraint**: Your message must be a positive integer less than n
    - The simulation will validate that your input meets this requirement

14. **Perform Encryption**:
    - Click "Lock Message" to encrypt your message using the formula: C = M^e mod n
    - The system performs modular exponentiation to compute the ciphertext
    - **Fun Fact**: Modular exponentiation is computed efficiently using the square-and-multiply algorithm to handle large numbers

15. **Observe the Result**:
    - The encrypted ciphertext will be displayed
    - Note how the encryption transforms your original message into a seemingly random number

#### Stage 6: Message Transmission (Send the Secret Box)

16. **Review the Key Information**:
    - The simulation displays the public parameters: n, e (which can be shared)
    - The private key d is also shown (but in reality, this would be kept secret)
    - This stage represents the transmission of the encrypted message

17. **Proceed to Decryption**:
    - Click "Open the Box" to move to the decryption phase
    - This simulates Agent Q receiving the encrypted message

#### Stage 7: Interactive Decryption (Decrypt the Message)

18. **Step-by-Step Decryption Process**:
    - The simulation guides you through the modular exponentiation for decryption: M = C^d mod n
    - You will work through each bit of the exponent d in binary representation
    - For each bit, you will perform the following calculations:

19. **Binary Exponentiation Steps**:
    - **If the current bit is 1**: Calculate (result × base) mod n
    - **If the current bit is 0**: Keep the result unchanged
    - **Always**: Calculate new base = (base × base) mod n for the next iteration

20. **Interactive Calculation**:
    - Enter your calculated values when prompted
    - The system will verify each step before proceeding
    - Error messages will guide you if calculations are incorrect
    - Continue until all bits of the exponent have been processed

#### Stage 8: Mission Completion (Success)

21. **Verify the Decryption**:
    - The final result should match your original message
    - The simulation will display both the original message and the decrypted result
    - **Mathematical Verification**: The process demonstrates that (M^e)^d ≡ M (mod n)

22. **Review the Complete Process**:
    - The simulation provides a summary of all calculation steps
    - Detailed explanations show how modular exponentiation reversed the encryption
    - **Fun Fact**: The RSA algorithm's security relies on the computational difficulty of factoring large composite numbers

#### Completion and Analysis

23. **Mission Accomplished**:
    - The simulation confirms successful message transmission and decryption
    - You have demonstrated the complete RSA cryptosystem workflow
    - Click "Play Again" to experiment with different parameters

24. **Key Learning Outcomes**:
    - Understanding the role of prime numbers in cryptographic security
    - Practical application of modular arithmetic and Euler's totient function
    - Experience with modular exponentiation algorithms
    - Appreciation for the mathematical foundations of modern digital security