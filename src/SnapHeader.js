import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Animated } from 'react-native'

class HeaderTest extends Component {

    state = {
        scrollY: new Animated.Value(0),
    }

    headerOpen = true

    startDragY = 0
    lastScrollToY = 0
    isScrolling = false

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
           contentSize.height - paddingToBottom
    }

    onScrollBeginDrag = event => this.startDragY = event.nativeEvent.contentOffset.y

    onScrollEndSnapToEdge = event => {

        if (this.isScrolling) {
            this.isScrolling = false
            return
        }

        const startDragY = this.startDragY
        const { minHeight, maxHeight, percentToClose } = this.props
        const scrollRange = maxHeight - minHeight

        const y = event.nativeEvent.contentOffset.y

        if (this._scrollView) {
            console.log('start onScrollEndSnapToEdge', startDragY, y, this.headerOpen)
            let toY = null

            if (this.headerOpen) {
                if (startDragY < y && y < startDragY + scrollRange * percentToClose) {
                    toY = startDragY
                } else if (startDragY + scrollRange * percentToClose <= y && y < startDragY + scrollRange
                   && !this.isCloseToBottom(event.nativeEvent)) {
                    toY = startDragY + scrollRange
                }

                if (y >= startDragY + scrollRange * percentToClose
                  && !this.isCloseToBottom(event.nativeEvent)) {
                    this.headerOpen = false
                }
            }
            else {
                if (startDragY - scrollRange * (1 - percentToClose) < y && y < startDragY) {
                    toY = startDragY
                } else if (startDragY - scrollRange < y && y <= startDragY - scrollRange * (1 - percentToClose)) {
                    toY = startDragY - scrollRange
                }

                if (y <= startDragY - scrollRange * (1 - percentToClose)) {
                    this.headerOpen = true
                }
            }

            console.log('attempt scrolling to ' + Math.round(toY) + ' with last scrollToY ' + this.lastScrollToY)

            // Don't scroll infinitely to the same Y
            if (toY !== null) {
                this.isScrolling = true
                this.lastScrollToY = toY
                this._scrollView.scrollTo({ y: Math.round(toY), animated: true })
                console.log('scrollTo', Math.round(toY))
            }
            console.log('stop onScrollEndSnapToEdge', this.headerOpen)
        }
    }

    render() {
        const { minHeight, maxHeight, headerComponent } = this.props
        const { scrollY } = this.state
        const startDragY = this.startDragY
        const scrollRange = maxHeight - minHeight

        console.log('Rerender', scrollY, startDragY)

        const animationRange = scrollY.interpolate({
            inputRange: this.headerOpen ?
                [ startDragY, startDragY + scrollRange ] :
                [ startDragY - scrollRange, startDragY ],
            outputRange: [ 0, 1 ],
            extrapolate: 'clamp',
        })

        const animateHeader = {
            transform: [
                {
                    translateY: animationRange.interpolate({
                        inputRange: [ 0, 1 ],
                        outputRange: [ 0, -scrollRange ],
                    }),
                },
            ],
        }

        return (
            <View style={ styles.container }>

                <Animated.ScrollView
                    style={ styles.scrollView }
                    ref={ scrollView => this._scrollView = scrollView ? scrollView._component : null }
                    onScrollEndDrag={ this.onScrollEndSnapToEdge }
                    onScrollBeginDrag={ this.onScrollBeginDrag }
                    onMomentumScrollEnd={ this.onScrollEndSnapToEdge }
                    onScroll={ Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true }
                    ) }
                    scrollEventThrottle={ 16 }
                >
                    <View style={{ flex: 0, height: maxHeight }} />
                    {
                        Array.apply(null, { length: 40 }).map(Number.call, Number).map((item) => (
                            <View
                                key={ item }
                                style={ [ styles.item, item % 2 === 1 && { backgroundColor: '#ffffff' } ] }
                            >
                                <Text>
                                    { item }
                                </Text>
                            </View>
                        ))
                    }
                </Animated.ScrollView>

                <Animated.View style={ [ styles.headerBackground, { height: maxHeight }, animateHeader ] }>
                    { headerComponent }
                </Animated.View>
            </View>
        )
    }
}

HeaderTest.propTypes = {
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    headerComponent: PropTypes.element,
    percentToClose: PropTypes.number,
}

HeaderTest.defaultProps = {
    minHeight: 50,
    maxHeight: 200,
    percentToClose: 0.5,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex:1,
    },
    headerBackground: {
        position: 'absolute',
        flex: 0,
        width: '100%',
    },
    item: {
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3e3e3',
    },
})

export default HeaderTest
