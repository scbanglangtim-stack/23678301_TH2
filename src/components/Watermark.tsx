import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { STUDENT, examStamp } from '@constants/student';

export const Watermark = () => {
  const stamp = examStamp();
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
      <Text style={styles.tagText}>(0)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8E8FC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
  },
  text: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    marginLeft: 4,
  },
});

export default memo(Watermark);
