import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Image from 'react-native-scale-image';

import styles from './style';

/**
 * 背景图片
 */
class ImageBackground extends Component {
  static propTypes = {
    children: PropTypes.node,
    // 样式
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    // 获取RN图片ref
    imageRef: PropTypes.func,
    // 缩放模式
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
    // 图片资源
    source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  };

  static defaultProps = {
    children: null,
    style: null,
    imageRef: ref => ref,
    resizeMode: 'stretch',
    source: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 容器宽
      containerWidth: 0,
      // 容器高
      containerHeight: 0,
    };
  }

  /**
   * 获取样式大小
   * @param sizeName 大小样式名
   * @param minSizeName 最小大小样式名
   * @param maxSizeName 最大大小样式名
   * @private
   */
  _getStyleSize = (sizeName, minSizeName, maxSizeName) => {
    const style = StyleSheet.flatten(this.props.style) || {};
    const getSize = styleName => (typeof style[styleName] === 'number' ? style[styleName] : 0);
    const size = getSize(sizeName);
    const minSize = getSize(minSizeName);
    const maxSize = getSize(maxSizeName);
    if (size) {
      return minSize && size < minSize ? minSize : maxSize && size > maxSize ? maxSize : size;
    }
    return minSize;
  }

  render() {
    const imageStyle = {};

    if (this._getStyleSize('width', 'minWidth', 'maxWidth')) {
      imageStyle.width = this.state.containerWidth;
    }
    if (this._getStyleSize('height', 'minHeight', 'maxHeight')) {
      imageStyle.height = this.state.containerHeight;
    }

    const imageProps = { ...this.props, children: undefined };

    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={event => {
          this.setState({
            containerWidth: event.nativeEvent.layout.width,
            containerHeight: event.nativeEvent.layout.height,
          });
        }}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
        />
        {this.props.children}
      </View>
    );
  }
}

export default ImageBackground;
