import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '@constants';

const TextBadge: React.FC<{ active: boolean; label: string }> = ({ active, label }) => {
  if (!active) return <React.Fragment />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -2,
    right: -15,
    borderRadius: 3,
    backgroundColor: theme.COLORS.PRIMARY
  },
  label: {
    marginHorizontal: 4,
    fontFamily: 'OpenSans-Bold',
    fontSize: 9,
    color: theme.COLORS.WHITE
  }
});

export default TextBadge;
