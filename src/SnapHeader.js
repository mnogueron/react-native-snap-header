import React from 'react'
import PropTypes from 'prop-types'
import { Animated, StyleSheet, View } from 'react-native'

class SnapHeader extends React.PureComponent {

    state = {
        scrollY: new Animated.Value(0),
        startDragY: 0,
    }

    headerOpen = true

    lastScrollToY = 0
    isScrolling = false

    _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
           contentSize.height - paddingToBottom
    }

    _onScrollBeginDrag = event => this.setState({ startDragY: event.nativeEvent.contentOffset.y })

    _onScrollEndSnapToEdge = event => {

        if (this.isScrolling) {
            this.isScrolling = false
            return
        }

        const { startDragY } = this.state
        const { minHeight, maxHeight, percentToClose } = this.props
        const scrollRange = maxHeight - minHeight

        const y = event.nativeEvent.contentOffset.y

        if (this._scrollView) {
            console.log('start _onScrollEndSnapToEdge', startDragY, y, this.headerOpen)
            let toY = null

            if (this.headerOpen) {
                if (startDragY < y && y < startDragY + scrollRange * percentToClose) {
                    toY = startDragY
                } else if (startDragY + scrollRange * percentToClose <= y && y < startDragY + scrollRange
                   && !this._isCloseToBottom(event.nativeEvent)) {
                    toY = startDragY + scrollRange
                }

                if (y >= startDragY + scrollRange * percentToClose
                  && !this._isCloseToBottom(event.nativeEvent)) {
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

            // Don't scroll infinitely to the same Y
            if (toY !== null) {
                this.isScrolling = true
                this.lastScrollToY = toY
                this._scrollView.scrollTo({ y: Math.round(toY), animated: true })
                console.log('scrollTo', Math.round(toY))
            }
            console.log('stop _onScrollEndSnapToEdge', this.headerOpen)
        }
    }

    render() {
        const { minHeight, maxHeight, headerComponent, children, style } = this.props
        const { scrollY, startDragY } = this.state
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
            <View style={ [{ flex: 1 }, style ] }>
                <Animated.ScrollView
                    style={{ flex: 1 }}
                    ref={ scrollView => this._scrollView = scrollView ? scrollView._component : null }
                    onScrollEndDrag={ this._onScrollEndSnapToEdge }
                    onScrollBeginDrag={ this._onScrollBeginDrag }
                    onMomentumScrollEnd={ this._onScrollEndSnapToEdge }
                    onScroll={ Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true }
                    ) }
                    scrollEventThrottle={ 16 }
                >
                    <View style={{ flex: 0, height: maxHeight }} />
                    { children }
                </Animated.ScrollView>

                <Animated.View style={ [ styles.header, { height: maxHeight }, animateHeader ] }>
                    { headerComponent }
                </Animated.View>
            </View>
        )
    }
}

SnapHeader.propTypes = {
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    headerComponent: PropTypes.element,
    percentToClose: PropTypes.number,
    style: PropTypes.any,
}

SnapHeader.defaultProps = {
    minHeight: 50,
    maxHeight: 200,
    percentToClose: 0.5,
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        flex: 0,
        width: '100%',
    },
})

export default SnapHeader
