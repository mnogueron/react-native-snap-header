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
    .add('Simple', () => (
        <SnapHeader
            headerComponent={ (
                <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                    <Text>Hey</Text>
                </View>
            ) }
            minHeight={ number('Minimum header size', 50) }
            maxHeight={ number('Maximum header size', 150) }
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
    .add('Double', () => (
        <View style={{ flex: 1 }}>
            <SnapHeader
                headerComponent={ (
                    <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                        <Text>Hey</Text>
                    </View>
                ) }
                minHeight={ number('Minimum header size 1', 50) }
                maxHeight={ number('Maximum header size 1', 150) }
                percentToClose={ number('Percent to close 1', 0.5) }
                style={{ flex: 0.5 }}
            >
                {
                    Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                        <View
                            key={ item }
                            style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                        >
                            <Text>A { item }</Text>
                        </View>
                    ))
                }
            </SnapHeader>
            <SnapHeader
                headerComponent={ (
                    <View style={{ backgroundColor: '#8EC449', flex: 1 }}>
                        <Text>Hey</Text>
                    </View>
                ) }
                minHeight={ number('Minimum header size 2', 50) }
                maxHeight={ number('Maximum header size 2', 150) }
                percentToClose={ number('Percent to close 2', 0.5) }
                style={{ flex: 0.5 }}
            >
                {
                    Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                        <View
                            key={ item }
                            style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                        >
                            <Text>B { item }</Text>
                        </View>
                    ))
                }
            </SnapHeader>
        </View>
    ))
    .add('Triple', () => (
        <View style={{ flex: 1 }}>
            <SnapHeader
                headerComponent={ (
                    <View style={{ backgroundColor: '#0084FF', flex: 1 }}>
                        <Text>Hey</Text>
                    </View>
                ) }
                minHeight={ number('Minimum header size 1', 50) }
                maxHeight={ number('Maximum header size 1', 100) }
                percentToClose={ number('Percent to close 1', 0.5) }
                style={{ flex: 0.33 }}
            >
                {
                    Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                        <View
                            key={ item }
                            style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                        >
                            <Text>A { item }</Text>
                        </View>
                    ))
                }
            </SnapHeader>
            <SnapHeader
                headerComponent={ (
                    <View style={{ backgroundColor: '#8EC449', flex: 1 }}>
                        <Text>Hey</Text>
                    </View>
                ) }
                minHeight={ number('Minimum header size 2', 50) }
                maxHeight={ number('Maximum header size 2', 100) }
                percentToClose={ number('Percent to close 2', 0.5) }
                style={{ flex: 0.33 }}
            >
                {
                    Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                        <View
                            key={ item }
                            style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                        >
                            <Text>B { item }</Text>
                        </View>
                    ))
                }
            </SnapHeader>
            <SnapHeader
                headerComponent={ (
                    <View style={{ backgroundColor: '#B70E19', flex: 1 }}>
                        <Text>Hey</Text>
                    </View>
                ) }
                minHeight={ number('Minimum header size 3', 50) }
                maxHeight={ number('Maximum header size 3', 100) }
                percentToClose={ number('Percent to close 3', 0.5) }
                style={{ flex: 0.34 }}
            >
                {
                    Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                        <View
                            key={ item }
                            style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                        >
                            <Text>C { item }</Text>
                        </View>
                    ))
                }
            </SnapHeader>
        </View>
    ))
