import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, FlatList, StyleSheet, Text, View, Animated } from 'react-native'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const { width: screenWidth } = Dimensions.get('window')

class HeaderTest extends Component {

  state = {
      scrollY1: new Animated.Value(0),
      scrollY2: new Animated.Value(0),
      scrollY3: new Animated.Value(0),

      horizontalScrollOffset: new Animated.Value(0),
      startDragY1: 0,
      startDragY2: 0,
      startDragY3: 0,

      lastScrollToY1: 0,
      lastScrollToY2: 0,
      lastScrollToY3: 0,

      currentTabIndex: 1,
  }

  onHorizontalScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.state.horizontalScrollOffset } } }],
      { useNativeDriver: true }
  )

  headerOpen = true
  _scrollView1 = null
  _scrollView2 = null
  _scrollView3 = null

  onScrollBeginDragHorizontal = event => {

      // expend header
      console.log('try opening header')
      const { minHeight, maxHeight } = this.props
      const { currentTabIndex } = this.state

      if (!this.headerOpen) {
          this.setState({ [`startDragY${currentTabIndex}`]: this.state[`startDragY${currentTabIndex}`] - maxHeight }, () => {
              Animated.timing(this.state[`scrollY${currentTabIndex}`], {
                  toValue: minHeight,
                  duration: 100,
                  useNativeDriver: true, // <-- Add this
              }).start(() => this.headerOpen = true)
          })
      }
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
      const paddingToBottom = 20
      return layoutMeasurement.height + contentOffset.y >=
           contentSize.height - paddingToBottom
  }

  onScrollBeginDrag = (index) => event => this.setState({ [`startDragY${index}`]: event.nativeEvent.contentOffset.y })

  onScrollEndSnapToEdge = (index) => event => {
      const startDragY = this.state[`startDragY${index}`]
      const lastScrollToY = this.state[`lastScrollToY${index}`]
      const { minHeight, maxHeight } = this.props
      const scrollRange = maxHeight - minHeight

      const y = event.nativeEvent.contentOffset.y

      const scrollView = this[`_scrollView${index}`]

      if (scrollView) {
          console.log('start onScrollEndSnapToEdge', index, startDragY, y, this.headerOpen)
          let toY = null
          if (this.headerOpen) {
              if (startDragY < y && y < startDragY + scrollRange / 2) {
                  toY = startDragY
              } else if (startDragY + scrollRange / 2 <= y && y < startDragY + scrollRange
                   && !this.isCloseToBottom(event.nativeEvent)) {
                  toY = startDragY + scrollRange
              }

              if (y >= startDragY + scrollRange / 2
            && !this.isCloseToBottom(event.nativeEvent)) {
                  this.headerOpen = false
              }
          }
          else {
              if (startDragY - scrollRange / 2 < y && y < startDragY) {
                  toY = startDragY
              } else if (startDragY - scrollRange < y && y <= startDragY - scrollRange / 2) {
                  toY = startDragY - scrollRange
              }

              if (y <= startDragY - scrollRange / 2) {
                  this.headerOpen = true
              }
          }

          if (toY && lastScrollToY !== toY) {
              scrollView.scrollTo({ y: Math.round(toY) })
              this.setState({ [`lastScrollToY${index}`]: toY })
              console.log('scrollTo', Math.round(toY))
          }
          console.log('start onScrollEndSnapToEdge', this.headerOpen)
      }
  }

  _renderItem = ({ index }) => {
      const { maxHeight } = this.props
      return (
          <View style={{ width: screenWidth }}>
              <Animated.ScrollView
                  style={ styles.scrollView }
                  ref={ scrollView => this[`_scrollView${index + 1}`] = scrollView ? scrollView._component : null }
                  onScrollEndDrag={ this.onScrollEndSnapToEdge(index + 1) }
                  onScrollBeginDrag={ this.onScrollBeginDrag(index + 1) }
                  onMomentumScrollEnd={ this.onScrollEndSnapToEdge(index + 1) }
                  onScroll={ Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.state[`scrollY${index + 1}`] } } }],
                      { useNativeDriver: true }
                  ) }
                  scrollEventThrottle={ 16 }
              >
                  <View style={{ flex: 0, height: maxHeight, width: '100%' }} />
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
          </View>
      )
  }

  _onVerticalScrollEnd = (event) => {
      const { nativeEvent: { contentOffset: { x }, contentSize: { width } } } = event

      const index = Math.round(x / (width / 3))
      console.log(index + 1)

      console.log(this.state.scrollY1)

      // reset all startDragY
      this.setState({
          currentTabIndex: index + 1,
      })
  }

  render() {
      const { currentTabIndex } = this.state
      const { minHeight, maxHeight, headerComponent } = this.props
      const scrollRange = maxHeight - minHeight

      const scrollY = this.state[`scrollY${currentTabIndex}`]
      const startDragY = this.state[`startDragY${currentTabIndex}`]

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
              <AnimatedFlatList
                  ref={ ref => {
                      //TODO figure out nicer way to retrieve flatList ref
                      if (ref) this.list = ref._component
                  } }
                  data={ Array.apply(null, { length: 3 }).map(Number.call, Number) }
                  horizontal={ true }
                  onMomentumScrollEnd={ this._onVerticalScrollEnd }
                  onScrollBeginDrag={ this.onScrollBeginDragHorizontal }
                  onScroll={ this.onHorizontalScroll }
                  pagingEnabled={ true }
                  keyExtractor={ item => `${item}` }
                  renderItem={ this._renderItem }
                  showsHorizontalScrollIndicator={ false }
              />

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
}

HeaderTest.defaultProps = {
    minHeight: 50,
    maxHeight: 200,
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
