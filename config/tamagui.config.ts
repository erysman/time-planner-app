import { config } from '@tamagui/config'
import { createAnimations } from '@tamagui/animations-moti'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui({
  ...config,
  animations: createAnimations({
    fast: {
      type: 'timing',
      duration: 100,
    },
    medium: {
      type: 'timing',
      duration: 200,
    },
    slow: {
      type: 'timing',
      duration: 350,
    },
  })})
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig

declare module 'tamagui' {

  interface TamaguiCustomConfig extends Conf {}

}
export default tamaguiConfig
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web

// be sure the import and declare module lines both use that same name
