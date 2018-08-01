import React from 'react'

import { storiesOf } from '@storybook/react-native'

import Welcome from './WelcomeView'

storiesOf('Welcome', module)
    .add('to Storybook', () => <Welcome />)
