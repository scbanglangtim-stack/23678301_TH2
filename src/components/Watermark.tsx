import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '@components/ui/Typography';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export const Watermark = () => {
  const stamp = examStamp();
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.top : styles.bottom]}>
      <Typography variant="small" color={COLORS.primary} style={styles.text}>
        {text}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 6,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  top: {
    marginBottom: 6,
  },
  bottom: {
    marginTop: 6,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default memo(Watermark);
