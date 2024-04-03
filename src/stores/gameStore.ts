import { defineStore } from 'pinia'
import Moralis from 'moralis'
import { NFTStorage, File } from 'nft.storage'
import Web3Service from '../lib/web3service.js'
import { useWalletStore } from '../stores/walletStore'
import { useMessageStore } from '../stores/messageStore'
import { Challenge, FormattedChallenge, Game, PreviousWins } from '../types.js'
import { MORALIS_API_KEY, NFT_UP_API_KEY, bigNumberToNumber, formatTimeAgo } from '../lib/utils.js'
import { ElNotification } from 'element-plus'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    history: [] as Game[],
    game: {},
    loading: false,
    modalMessage: '',
    isUserConnected: false,
    modalTitle: '',
    modalVisible: false,
    showPreviousMoves: false,
    isGameActive: false,
    isGameRevealed: false,
    timeLeft: 0,
    previousWins: [] as PreviousWins[],
    etherPrice: 0
  }),

  getters: {},

  actions: {
    addGuessHistory(guess: Game) {
      this.history.push(guess)
    },

    showModal(title: string, message: string) {
      this.modalTitle = title
      this.modalMessage = message
      this.modalVisible = true
    },

    hideModal() {
      this.modalVisible = false
    },

    async getHistory() {
      const walletStore = useWalletStore()
      const messageStore = useMessageStore()
      try {
        if (!walletStore.signer) {
          ElNotification({
            title: 'Error',
            message: 'Not connected with Metamask...',
            type: 'error'
          })
          return
        }
        const web3service = new Web3Service(walletStore.signer)
        const res = await web3service.getGuessHistory()
        this.history = res
      } catch (error) {
        console.error(error)
      }
    },

    async uploadToNFTStorage(uploadContent) {
      if (!NFT_UP_API_KEY) {
        console.error('NFT_UP_API_KEY not found')
        return
      }
      const client = new NFTStorage({ token: NFT_UP_API_KEY })
      if (!client) {
        console.error('NFTStorage not found')
        return
      }
      try {
        const metadata = await client.store(uploadContent)
        return metadata
      } catch (error) {
        console.error('Error uploading to IPFS', error)
      }
    },

    async uploadToMoralis(uploadArray: any) {
      if (!MORALIS_API_KEY) {
        console.error('MORALIS_API_KEY not found')
        return
      }
      if (!Moralis) {
        console.error('Moralis not found')
        return
      }
      try {
        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey: MORALIS_API_KEY
          })
        }
        const response = await Moralis.EvmApi.ipfs.uploadFolder({
          abi: uploadArray
        })
        return response.result
      } catch (error) {
        console.error('Error uploading to IPFS', error)
      }
    },

    async addAdmin(address: string) {
      const walletStore = useWalletStore()
      try {
        if (!walletStore.signer) {
          ElNotification({
            title: 'Error',
            message: 'Not connected with Metamask...',
            type: 'error'
          })
          return
        }
        const web3service = new Web3Service(walletStore.signer)
        const res = await web3service.addAdmin(address)
        return res
      } catch (error) {
        console.error(error)
      }
    },

    async createChallenge(challenges: Challenge[]) {
      const walletStore = useWalletStore()
      try {
        if (!walletStore.signer) {
          ElNotification({
            title: 'Error',
            message: 'Not connected with Metamask...',
            type: 'error'
          })
          return
        }
        const web3service = new Web3Service(walletStore.signer)

        const challengeArray = challenges.map(async (challenge) => {
          // For Moralis
          const uploadArray = challenge.selectedFiles.map(async (file: any) => {
            return {
              path: file.name,
              content: file.contents
            }
          })

          // For NFTStorage
          //   const uploadArray = challenge.selectedFiles.map(async (file: any) => {
          //     const fileObj = new File([file.contents], file.name, { type: file.type })
          //     return {
          //       name: file.name,
          //       description: 'Spot the ball game',
          //       image: fileObj
          //     }
          //   })
          return await Promise.all(uploadArray)
        })

        const challengeArrayRes = await Promise.all(challengeArray)
        // Upload the challenges to IPFS
        const uploadToIpfsRes = await Promise.all(
          challengeArrayRes.map(async (challenge) => {
            return await this.uploadToMoralis(challenge)
          })
        )

        let uploadedChallenges = [] as FormattedChallenge[]
        for (let i = 0; i < uploadToIpfsRes.length; i++) {
          uploadedChallenges.push({
            privateImageURL: uploadToIpfsRes[i][0].path,
            publicImageURL: uploadToIpfsRes[i][1].path,
            topLeft: [Math.round(challenges[i].position.x1), Math.round(challenges[i].position.y1)],
            bottomRight: [
              Math.round(challenges[i].position.x2),
              Math.round(challenges[i].position.y2)
            ],
            centerPoint: [
              Math.round(challenges[i].position.center.x),
              Math.round(challenges[i].position.center.y)
            ]
          })
        }

        const res = await web3service.createChallenge(uploadedChallenges)
        return res
      } catch (error) {
        console.error(error)
      }
    },

    async getGame() {
      const walletStore = useWalletStore()
      const messageStore = useMessageStore()
      try {
        if (!walletStore.signer) {
          ElNotification({
            title: 'Error',
            message: 'Not connected with Metamask...',
            type: 'error'
          })
          return
        }
        const web3service = new Web3Service(walletStore.signer)
        const res = await web3service.getChallengePublicInfo()
        this.game = res
        this.timeLeft = bigNumberToNumber(res?.[4])
        this.isGameActive = res?.[1]
        this.isGameRevealed = res?.[2]
      } catch (error) {
        console.error(error)
      }
    },

    async getPreviousWins() {
      try {
        const walletStore = useWalletStore()
        if (!walletStore.signer) {
          ElNotification({
            title: 'Error',
            message: 'Not connected with Metamask...',
            type: 'error'
          })
          return
        }
        const web3service = new Web3Service(walletStore.signer)
        const res = await web3service.getPreviousWins()
        this.previousWins = res
        return res
      } catch (error) {
        console.error(error)
      }
    },

    async fetchEtherPrice() {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      try {
        const response = await fetch(url)
        const data = await response.json()
        this.etherPrice = data.ethereum.usd
      } catch (error) {
        console.error(error)
      }
    }
  }
})
