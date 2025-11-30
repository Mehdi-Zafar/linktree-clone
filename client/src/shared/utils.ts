import 'vue-sonner/style.css'
import { toast } from 'vue-sonner'
import type { RegleRuleDefinition } from '@regle/core'
import { isFilled } from '@regle/rules'
// import { isFilled, type RegleRuleDefinition } from '@regle/core'

export const showToast = (text: string, type?: 'success' | 'error' | 'info' | 'warning') => {
  if (type === 'success') {
    toast.success(text)
  } else if (type === 'error') {
    toast.error(text)
  } else if (type === 'info') {
    toast.info(text)
  } else if (type === 'warning') {
    toast.warning(text)
  } else {
    toast(text)
  }
}

// /**
//  * Custom URL validator for Regle
//  * Validates that a string is a properly formatted URL
//  */
// export function createUrlValidator(): RegleRuleDefinition<string, [], string> {
//   return {
//     validator:(value: string)=> {
//       // Skip validation for empty values (use 'required' rule separately)
//       if (!isFilled(value)) {
//         return true
//       }

//       try {
//         const url = new URL(value)
//         // Check for valid protocol (http or https)
//         return url.protocol === 'http:' || url.protocol === 'https:'
//       } catch {
//         return false
//       }
//     },
//     message: 'Please enter a valid URL',
//   }
// }

// /**
//  * Platform-specific URL validator
//  * Validates URLs match expected patterns for specific platforms
//  * 
//  * @example
//  * const instagramValidator = createPlatformUrlValidator('instagram', /instagram\.com/)
//  */
// export function createPlatformUrlValidator(
//   platformName: string,
//   pattern: RegExp,
// ): RegleRuleDefinition<string, [], string> {
//   return {
//     validator(value: string) {
//       if (!isFilled(value)) {
//         return true
//       }

//       try {
//         const url = new URL(value)
//         return pattern.test(url.hostname)
//       } catch {
//         return false
//       }
//     },
//     message: `Please enter a valid ${platformName} URL`,
//   }
// }