import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Button from '@components/Button';

const RoundButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  right?: boolean;
  onPress?(): void;
}> = ({ label, icon, loading = false, right = false, onPress = () => {} }) => {
  return (
    <Button
      style={styles.button}
      round
      onPress={() => {
        !loading && onPress();
      }}
      loading={loading}
    >
      <Block style={styles.buttonContent}>
        {!right && icon}

        <Text style={icon ? styles.buttonTextWithIcon : styles.buttonText}>{label}</Text>

        {right && icon}
      </Block>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 0,
    width: '100%',
    backgroundColor: theme.COLORS.ROYALTY,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowColor: theme.COLORS.ROYALTY,
    shadowOpacity: 0.4,
    elevation: 2
  },
  buttonContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonTextWithIcon: {
    marginHorizontal: 10,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: theme.COLORS.WHITE
  },
  buttonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: theme.COLORS.WHITE
  }
});

export default RoundButton;