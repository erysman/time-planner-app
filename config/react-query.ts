import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import { useEffect } from "react"
import { AppState, Platform } from 'react-native'
import type { AppStateStatus } from "react-native"
import { focusManager } from '@tanstack/react-query'

export const useSetupReactQuery = () => {
    onlineManager.setEventListener(setOnline => {
        return NetInfo.addEventListener(state => {
          setOnline(!!state.isConnected)
        })
      })
      
      function onAppStateChange(status: AppStateStatus) {
        if (Platform.OS !== 'web') {
          focusManager.setFocused(status === 'active')
        }
      }
      
      useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange)
      
        return () => subscription.remove()
      }, [])
}

