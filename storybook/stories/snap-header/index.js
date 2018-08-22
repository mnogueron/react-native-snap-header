import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { storiesOf } from '@storybook/react-native'
import { SnapHeader } from 'react-native-snap-header'
import { withKnobs, number } from '@storybook/addon-knobs'

const styles = StyleSheet.create({
    item: {
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3e3e3',
    },
})

storiesOf('SnapHeader', module)
    .addDecorator(withKnobs)
    .add('Basic', () => (
        <SnapHeader
            headerComponent={ (
                <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                    <Text>Hey</Text>
                </View>
            ) }
            minHeight={ number('Minimum header size', 50) }
            maxHeight={ number('Maximum header size', 200) }
            percentToClose={ number('Percent to close', 0.5) }
        >
            {
                Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                    <View
                        key={ item }
                        style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                    >
                        <Text>{ item }</Text>
                    </View>
                ))
            }
        </SnapHeader>
    ))
