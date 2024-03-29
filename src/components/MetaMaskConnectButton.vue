<template>
  <el-button @click="connectMetamask" type="primary" round plain>
    <img class="metamask-icon" src="@/assets/icons/icon_metamask.png" alt="MetaMask Fox" />
    {{ buttonText }}
  </el-button>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import { useWalletStore } from '@/stores/walletStore'
import { ref } from 'vue'
import Web3listener from '@/lib/web3listener'
import Web3Service from '@/lib/web3service'
import { trackEvent } from '../lib/utils'
import Common from '../lib/common'
import { useGameStore } from '../stores/gameStore'

export default {
  name: 'MetaMaskConnectButton',

  setup() {
    const walletStore = useWalletStore()
    const gameStore = useGameStore()
    const buttonText = ref('Connect with MetaMask')

    async function connectMetamask() {
      const provider = await detectEthereumProvider()

      if (provider) {
        const chainId = await provider.request({ method: 'eth_chainId' })
        if (chainId !== '0x1bb') {
          gameStore.isUserConnected = false

          this.$notify({
            title: 'Wrong Network',
            dangerouslyUseHTMLString: true,
            message:
              'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> ',
            type: 'info'
          })
          buttonText.value = 'Wrong Network, Switch to Ten'
          return
        }

        // Request account access if needed
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        gameStore.isUserConnected = accounts.length > 0

        // Set provider and address in the store
        walletStore.setProvider(provider)
        walletStore.setAddress(accounts[0])

        trackEvent('connect_wallet', {
          value: accounts[0]
        })

        this.$notify({
          title: 'Connected',
          message: 'Connected to wallet ! Account: ' + accounts[0],
          type: 'success'
        })
        buttonText.value = 'Connected!'

        new Web3Service(walletStore.signer, Common.CONTRACT_ADDRESS)
        new Web3listener(walletStore.signer, Common.CONTRACT_ADDRESS)

        await gameStore.getHistory()
        await gameStore.getGame()
        await gameStore.fetchEtherPrice()
        await gameStore.getPreviousWins()
      } else {
        console.error('Please install MetaMask!')
        gameStore.isUserConnected = false
        this.$notify({
          title: 'MetaMask not found',
          message: 'Please install MetaMask!',
          type: 'error'
        })
      }
    }

    return {
      connectMetamask,
      buttonText
    }
  },
  async mounted() {
    await this.connectMetamask()
  }
}
</script>

<style scoped>
.metamask-icon {
  width: 24px; /* Set desired width */
  height: 24px; /* Set desired height */
  object-fit: cover; /* Ensure image content is not distorted */
}
</style>
