import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  size?: number;
  radius?: number;
}

export function Logo({ size = 40, radius }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: radius ?? Math.round(size * 0.22),
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: Math.round(size * 0.58) }]}>N</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
});
