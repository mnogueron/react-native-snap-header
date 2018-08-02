import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { storiesOf } from '@storybook/react-native'
import { SnapHeader } from 'react-native-snap-header'

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
    .add('Basic', () => (
        <SnapHeader
            headerComponent={ (
                <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                    <Text>Hey</Text>
                </View>
            ) }
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
