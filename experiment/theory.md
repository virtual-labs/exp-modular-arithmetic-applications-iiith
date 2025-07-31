## Overview

Cryptography is the study and practice of techniques for securing communication and data from adversaries. Among the many cryptographic protocols in use today, the **RSA algorithm** stands as one of the most influential. It is a public-key cryptosystem grounded in number theory, particularly the concepts of **modular arithmetic**, **prime numbers**, and **Euler’s Totient Function**.

This module introduces the mathematical foundations of RSA encryption through a simplified but complete walkthrough. By the end, students will understand how modular arithmetic enables secure communication, and how it is applied to encrypt and decrypt messages using the RSA system.

---

## 1. Modular Arithmetic

Modular arithmetic is a system of arithmetic for integers where numbers "wrap around" after reaching a specified value called the modulus.

Formally, if two integers `a` and `b` satisfy:

```
a ≡ b (mod n)
```

this means that `(a - b)` is divisible by `n`, or that `a` and `b` leave the same remainder when divided by `n`.

### Examples

* `17 ≡ 5 (mod 12)`
  Since 17 divided by 12 leaves a remainder of 5.
* `34 ≡ 10 (mod 12)`
  Because 34 ÷ 12 = 2 remainder 10.
* `23 ≡ 3 (mod 10)`
  As 23 and 3 both leave remainder 3 when divided by 10.

This arithmetic behaves similarly to operations on a clock, where, for example, 14 hours after 10 o'clock brings us back to 12 o'clock:
`(10 + 14) ≡ 12 (mod 12)`

---

## 2. Prime Numbers and Euler’s Totient Function

### Prime Numbers

A **prime number** is an integer greater than 1 that has no positive divisors other than 1 and itself. Prime numbers are central to RSA because the security of the algorithm relies on the difficulty of factoring the product of two large primes.

### Totient Function φ(n)

Euler’s Totient Function φ(n) counts the number of integers less than `n` that are **coprime** to `n` (i.e., share no common divisors with `n` other than 1).

If `n = p × q`, where `p` and `q` are distinct prime numbers, then:

```
φ(n) = (p − 1) × (q − 1)
```

### Example

Let `p = 5` and `q = 11`. Then:

* `n = p × q = 55`
* `φ(55) = (5 − 1) × (11 − 1) = 4 × 10 = 40`

This value is essential for constructing the private key in RSA.

---

## 3. Key Generation in RSA

RSA requires two keys: a **public key** for encryption and a **private key** for decryption.

### Steps to Generate Keys

1. **Select two distinct prime numbers**, `p` and `q`.
2. **Compute** `n = p × q`.
3. **Compute Euler’s Totient Function** `φ(n) = (p − 1) × (q − 1)`.
4. **Choose a public exponent** `e` such that `1 < e < φ(n)` and `gcd(e, φ(n)) = 1`.
5. **Compute the modular inverse** `d` of `e` modulo `φ(n)`, i.e., find `d` such that:

   ```
   (e × d) mod φ(n) = 1
   ```

   This `d` is the private key exponent.

The Extended Euclidean Algorithm is typically used to compute the modular inverse.

### Example

Let `p = 5`, `q = 11`

* `n = 55`
* `φ(n) = 40`
* Choose `e = 3` (since `gcd(3, 40) = 1`)
* Find `d` such that `3 × d ≡ 1 (mod 40)`
  Using the Extended Euclidean Algorithm: `d = 27`

Thus,

* **Public Key:** `(n = 55, e = 3)`
* **Private Key:** `(n = 55, d = 27)`

---

## 4. RSA Encryption and Decryption

RSA uses **modular exponentiation** for both encryption and decryption.

### Encryption

To encrypt a plaintext message `m` (where `m < n`), compute:

```
c = m^e mod n
```

### Decryption

To decrypt the ciphertext `c`, compute:

```
m = c^d mod n
```

### Example

Using the previous keys:

* Encrypt message `m = 9`
  `c = 9^3 mod 55 = 729 mod 55 = 14`

* Decrypt `c = 14`
  `m = 14^27 mod 55 = 9` (Recovered original message)

This confirms that the RSA system operates correctly when the parameters are chosen properly.

---

## 5. Mathematical Justification

The security and correctness of RSA depend on properties of number theory.

If `e` and `d` are chosen such that:

```
(e × d) ≡ 1 (mod φ(n))
```

then for a message `m` that is coprime to `n`, it holds that:

```
(m^e)^d ≡ m (mod n)
```

This follows from **Euler's theorem**, which states that:

```
m^φ(n) ≡ 1 (mod n)     if gcd(m, n) = 1
```

---

## 6. Security Considerations

RSA’s security is based on the computational difficulty of the **integer factorization problem**. While it is straightforward to compute `n = p × q`, the reverse — determining `p` and `q` from `n` — becomes infeasible when `p` and `q` are large (e.g., 1024 or 2048 bits).

Modern RSA implementations use key sizes of at least **2048 bits** to ensure resistance against known factoring attacks.

In this educational setup, small primes are used for transparency and manual computation, but these are not secure in practice.

---

## 7. Additional Worked Examples

### Example 1: Modular Congruence

Evaluate: `34 mod 12 = 10`
Therefore, `34 ≡ 10 (mod 12)`

---

### Example 2: Modular Inverse

Find `x` such that:

```
7 × x ≡ 1 mod 26
```

Try values manually or use the Extended Euclidean Algorithm:

* `7 × 15 = 105 ≡ 1 (mod 26)`
* Hence, the modular inverse of 7 modulo 26 is 15.

---

### Example 3: Full RSA Example

Let:

* `p = 7`, `q = 17`
* `n = 7 × 17 = 119`
* `φ(n) = (7 − 1)(17 − 1) = 96`
* Choose `e = 5` (coprime with 96)
* Compute `d` such that `5 × d ≡ 1 mod 96` → `d = 77`

To encrypt `m = 42`:

* `c = 42^5 mod 119 = 52`

To decrypt `c = 52`:

* `m = 52^77 mod 119 = 42`

---