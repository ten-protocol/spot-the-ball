import { serializeError } from '@metamask/rpc-errors'
import { ethers } from 'ethers'

export function trackEvent(eventName, eventData) {
  if (!window.gtag) {
    return
  }
  window.gtag('event', eventName, eventData)
}

export function bigNumberToNumber(bigNumber) {
  return ethers.BigNumber.from(bigNumber).toNumber()
}

export function formatTimeAgo(seconds, addSuffix = true) {
  if (isNaN(seconds)) {
    return 'Unknown'
  }
  if (seconds <= 0) {
    return addSuffix ? 'Just now' : '0 seconds'
  }
  if (seconds < 60) {
    return `${seconds} second${seconds > 1 ? 's' : ''} ${addSuffix ? 'ago' : ''}`
  }
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60)
    return `${min} minute${min > 1 ? 's' : ''} ${addSuffix ? 'ago' : ''}`
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ${addSuffix ? 'ago' : ''}`
  }
  const days = Math.floor(seconds / 86400)
  return `${days} day${days > 1 ? 's' : ''} ${addSuffix ? 'ago' : ''}`
}

export function handleMetaMaskError(error) {
  if (!error) {
    return 'Unknown error'
  }

  if (!error.code) {
    return error.message ?? error
  }

  const serializedError = serializeError(error)
  const errorMessage =
    serializedError?.data?.cause?.error?.data?.message ?? serializedError?.data?.message

  if (errorMessage?.includes('no signed viewing keys')) {
    return `Missing viewing key. It looks like you may not have registered through the <a href="https://testnet.ten.xyz/" class="connect-link" target="_blank" rel="noopener noreferrer">gateway</a>`
  }

  if (errorMessage?.includes('invalid viewing key signature for requested address')) {
    return `Invalid viewing key. Please ensure the connected account is also authenticated via the gateway <a href="https://testnet.ten.xyz/" class="connect-link" target="_blank" rel="noopener noreferrer">here</a>`
  }

  return errorMessage
}

export const CIRCLE_SIZE = 70

export const MORALIS_API_KEY = import.meta.env.VITE_APP_MORALIS_API_KEY

export const NFT_UP_API_KEY = import.meta.env.VITE_APP_NFT_UP_API_KEY
