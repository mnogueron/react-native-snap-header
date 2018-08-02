import React from 'react'
import { Text, View } from 'react-native'
import { storiesOf } from '@storybook/react-native'
import { SnapHeader } from 'react-native-snap-header'

storiesOf('SnapHeader', module)
    .add('Basic', () => (
        <SnapHeader
            headerComponent={ (
                <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                    <Text>Hey</Text>
                </View>
            ) }
        />
    ))
