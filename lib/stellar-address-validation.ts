/**
 * Stellar Address Validation Utilities
 * Provides functions to validate Stellar public key addresses
 */

/**
 * Validates if a string is a valid Stellar public key address
 * @param address - The address string to validate
 * @returns true if valid, false otherwise
 */
export function isValidStellarAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }

  // Stellar addresses must be exactly 56 characters long
  if (address.length !== 56) {
    return false
  }

  // Stellar addresses must start with 'G' (for public keys)
  if (!address.startsWith('G')) {
    return false
  }

  // Stellar addresses must contain only base32 characters (A-Z, 2-7)
  const base32Regex = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]+$/
  if (!base32Regex.test(address)) {
    return false
  }

  // Additional validation: Check for common invalid patterns
  // Stellar addresses should not contain easily mistyped characters
  if (address.includes('0') || address.includes('1') || address.includes('8') || address.includes('9')) {
    return false
  }

  // Stellar addresses should not contain lowercase letters
  if (address !== address.toUpperCase()) {
    return false
  }

  return true
}

/**
 * Provides a detailed validation result with specific error messages
 * @param address - The address string to validate
 * @returns Validation result object with isValid boolean and error message
 */
export function validateStellarAddress(address: string): {
  isValid: boolean
  error?: string
} {
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      error: 'Address is required and must be a string'
    }
  }

  if (address.length !== 56) {
    return {
      isValid: false,
      error: `Address must be exactly 56 characters long (current: ${address.length})`
    }
  }

  if (!address.startsWith('G')) {
    return {
      isValid: false,
      error: 'Stellar addresses must start with "G"'
    }
  }

  const base32Regex = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]+$/
  if (!base32Regex.test(address)) {
    return {
      isValid: false,
      error: 'Address contains invalid characters. Only A-Z and 2-7 are allowed'
    }
  }

  if (address.includes('0') || address.includes('1') || address.includes('8') || address.includes('9')) {
    return {
      isValid: false,
      error: 'Address contains invalid characters (0, 1, 8, 9 are not allowed in Stellar addresses)'
    }
  }

  if (address !== address.toUpperCase()) {
    return {
      isValid: false,
      error: 'Address must be in uppercase'
    }
  }

  return { isValid: true }
}

/**
 * Formats a Stellar address for display (adds ellipsis for long addresses)
 * @param address - The full Stellar address
 * @param startLength - Number of characters to show at the start (default: 8)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Formatted address string
 */
export function formatStellarAddress(
  address: string, 
  startLength: number = 8, 
  endLength: number = 4
): string {
  if (!isValidStellarAddress(address)) {
    return 'Invalid Address'
  }

  if (address.length <= startLength + endLength + 3) {
    return address
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Sanitizes user input for Stellar address entry
 * @param input - Raw user input
 * @returns Sanitized string ready for validation
 */
export function sanitizeStellarAddressInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove whitespace and convert to uppercase
  let sanitized = input.trim().toUpperCase()

  // Remove any non-base32 characters
  sanitized = sanitized.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]/g, '')

  return sanitized
}

/**
 * Generates a valid test Stellar address for demo purposes
 * Note: This is NOT a real wallet address - only for testing/demo
 * @returns A valid format Stellar address string
 */
export function generateTestStellarAddress(): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let address = 'G' // Stellar addresses start with G
  
  // Generate 55 random characters (total length will be 56)
  for (let i = 0; i < 55; i++) {
    const randomIndex = Math.floor(Math.random() * base32Chars.length)
    address += base32Chars[randomIndex]
  }
  
  return address
}
