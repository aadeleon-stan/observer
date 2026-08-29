import React, { useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  visible: boolean;
  onDone: () => void;
}

const MESSAGES = [
  'Noted with care',
  'Gently kept',
  'Softly held',
  'Tucked away',
  'Quietly saved',
];

function Particle({ delay, x, targetY, particleStyle }: { delay: number; x: number; targetY: number; particleStyle: object }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.8, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.timing(translateY, { toValue: targetY, duration: 1400, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          opacity,
          transform: [{ translateX: x }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

export function SaveConfirmation({ visible, onDone }: Props) {
  const { colors, isDark } = useTheme();
  const sproutScale = useRef(new Animated.Value(0)).current;
  const sproutTranslateY = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;
  const wholeOpacity = useRef(new Animated.Value(1)).current;
  const messageRef = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'rgba(26, 22, 20, 0.85)' : 'rgba(250, 247, 242, 0.85)',
    },
    center: {
      alignItems: 'center',
      marginTop: -60,
    },
    particleContainer: {
      position: 'absolute',
      top: 10,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
    },
    particle: {
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accentLight,
    },
    sprout: {
      fontSize: 48,
    },
    message: {
      marginTop: 12,
      fontSize: 16,
      color: colors.accent,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
  }), [colors, isDark]);

  useEffect(() => {
    if (visible) {
      messageRef.current = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      sproutScale.setValue(0);
      sproutTranslateY.setValue(20);
      textOpacity.setValue(0);
      textTranslateY.setValue(8);
      wholeOpacity.setValue(1);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(sproutScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
          Animated.timing(sproutTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(textTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(1800),
        Animated.timing(wholeOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start(() => onDone());
    }
  }, [visible]);

  if (!visible) return null;

  const particles = [
    { delay: 200, x: -20, targetY: -50 },
    { delay: 350, x: 15, targetY: -65 },
    { delay: 500, x: -8, targetY: -55 },
    { delay: 300, x: 25, targetY: -45 },
    { delay: 450, x: -25, targetY: -60 },
    { delay: 550, x: 5, targetY: -70 },
  ];

  return (
    <Animated.View style={[styles.overlay, { opacity: wholeOpacity }]}>
      <Animated.View style={[styles.backdrop, { opacity: wholeOpacity }]} />
      <View style={styles.center}>
        <View style={styles.particleContainer}>
          {particles.map((p, i) => (
            <Particle key={i} {...p} particleStyle={styles.particle} />
          ))}
        </View>
        <Animated.Text
          style={[
            styles.sprout,
            {
              transform: [
                { scale: sproutScale },
                { translateY: sproutTranslateY },
              ],
            },
          ]}
        >
          {'\uD83C\uDF31'}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.message,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          {messageRef.current}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
