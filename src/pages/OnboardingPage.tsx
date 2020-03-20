import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, ListButton } from '@components';

const { width, height } = Dimensions.get('screen');

const OnboardingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);

  const dispatch = useDispatch();

  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <Block style={styles.fg}>
          <Text style={styles.subtitle}>Hi {user.givenName}</Text>
          <Text style={styles.title}>Let's finish setting up</Text>
          <Text style={styles.heading}>CONTACT</Text>
          <ListButton keyText="Full Name" valueText={`${user.givenName} ${user.familyName}`} disabled={true} />
          <ListButton keyText="Illinois Email" valueText={user.email} disabled={true} />
          <ListButton keyText="Phone" valueText={user.phone} />
          <Text style={styles.heading}>PROFILE</Text>
        </Block>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Block flex>
      {renderBackground()}
      {renderContent()}
    </Block>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  fg: {
    position: 'absolute',
    height: height * 0.67,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  title: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    marginBottom: 20
  },
  subtitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY,
    textTransform: 'uppercase'
  },
  heading: {
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  }
});

export default OnboardingPage;
