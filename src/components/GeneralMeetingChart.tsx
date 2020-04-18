import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

import { theme } from '@constants';
import { TUser } from '@backend/auth';
import { TRecords, TEventDict } from '@backend/kappa';
import { getAttendedEvents, getExcusedEvents, getTypeCounts } from '@services/kappaService';
import Text from './Text';

const GeneralMeetingChart: React.FC<{
  user: TUser;
  records: TRecords;
  events: TEventDict;
  gmCount: number;
}> = ({ user, records, events, gmCount }) => {
  const attended = React.useMemo(() => {
    if (!user.privileged) return {};

    return getAttendedEvents(records, user.email);
  }, [user, records]);

  const excused = React.useMemo(() => {
    if (!user.privileged) return {};

    return getExcusedEvents(records, user.email);
  }, [user, records]);

  const gmCounts = React.useMemo(() => {
    return getTypeCounts(events, attended, excused, 'GM');
  }, [events, attended, excused]);

  const gmStats = React.useMemo(() => {
    const fraction = gmCount === 0 ? 0 : gmCounts.sum / gmCount;

    return {
      raw: fraction,
      percent: `${Math.round(fraction * 100)}%`
    };
  }, [gmCount, gmCounts]);

  return (
    <View style={styles.adminChartsContainer}>
      <View style={styles.circleChartContainer}>
        <ProgressCircle
          style={styles.circleChart}
          progress={gmStats.raw}
          progressColor={theme.COLORS.PRIMARY}
          startAngle={-Math.PI * 0.8}
          endAngle={Math.PI * 0.8}
        />
        <View style={styles.circleChartLabels}>
          <Text style={styles.circleChartValue}>{gmStats.percent}</Text>
          <Text style={styles.circleChartTitle}>GM</Text>
        </View>
      </View>

      <View style={styles.chartPropertyContainer}>
        <View style={styles.chartProperty}>
          <Text style={styles.chartPropertyLabel}>Attended</Text>
          <Text style={styles.chartPropertyValue}>{gmCounts.attended}</Text>
        </View>
        <View style={styles.chartProperty}>
          <Text style={styles.chartPropertyLabel}>Excused</Text>
          <Text style={styles.chartPropertyValue}>{gmCounts.excused}</Text>
        </View>
        <View style={styles.chartProperty}>
          <Text style={styles.chartPropertyLabel}>Pending</Text>
          <Text style={styles.chartPropertyValue}>{gmCounts.pending}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adminChartsContainer: {
    marginTop: 24,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  circleChartContainer: {
    width: 144,
    height: 144
  },
  circleChart: {
    height: '100%'
  },
  circleChartLabels: {
    position: 'absolute',
    width: 144,
    height: 144,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleChartValue: {
    fontFamily: 'OpenSans',
    fontSize: 17
  },
  circleChartTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  chartPropertyContainer: {
    flexGrow: 1,
    paddingLeft: 24,
    justifyContent: 'center'
  },
  chartProperty: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartPropertyLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  chartPropertyValue: {
    fontFamily: 'OpenSans',
    fontSize: 15
  }
});

export default GeneralMeetingChart;